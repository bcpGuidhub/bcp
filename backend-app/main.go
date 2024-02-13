package main

import (
	"context"
	"fmt"
	"net/http/pprof"
	"os"
	"time"

	"cloud.google.com/go/compute/metadata"
	"cloud.google.com/go/profiler"
	"contrib.go.opencensus.io/exporter/stackdriver"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-redsync/redsync/v4"
	"github.com/go-redsync/redsync/v4/redis/goredis/v9"
	"github.com/golang-migrate/migrate/v4"
	"github.com/google/uuid"
	"github.com/microcosm-cc/bluemonday"
	"github.com/robfig/cron/v3"
	"github.com/sagikazarmark/go-gin-gorm-opencensus/pkg/ocgorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/database"
	eventstream "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/architecture/cqrs"
	cmdHandlers "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/commands/handlers"
	evtHandlers "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/events/handlers"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/infrastructure/kafka"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/middleware"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/instrumentation"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/interactors"
	eventstreaming "gitlab.com/le-coin-des-entrepreneurs/backend-app/interactors/event_streaming"
	sanitisePolicy "gitlab.com/le-coin-des-entrepreneurs/backend-app/interactors/event_streaming/inquisite"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/interactors/inquisite"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/interactors/messaging"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/jobs"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	middlewares "gitlab.com/le-coin-des-entrepreneurs/backend-app/middleware"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/pkg/logging"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/server"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/webrtc"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/writeconcern"
	"go.opencensus.io/plugin/ochttp"
	"go.opencensus.io/stats/view"
	"go.opencensus.io/trace"
	"google.golang.org/genproto/googleapis/api/monitoredres"
	"istio.io/pkg/log"
)

const (
	apiVersion = "v1"
)

// APPENV is the current
// env in which the application is running.
var APPENV string
var PROJECTID string

func main() {
	APPENV = os.Getenv("APPENV")
	PROJECTID = os.Getenv("PROJECTID")
	interactors.Env = APPENV
	interactors.ProjectId = PROJECTID
	services.Env = APPENV
	middlewares.Env = APPENV
	kafka.Env = APPENV

	// app config
	configFile := config.Config{
		File:   "config",
		Format: "yaml",
		Path:   ".",
	}

	defaultSetting := map[string]interface{}{
		"port": 8080,
	}

	appConfig, err := config.New(configFile, defaultSetting)
	if err != nil {
		instrumentation.LogAndPrintError(err)
		panic(err)
	}
	// services config
	services.AppConfig = appConfig
	// logger
	requestLogger, err := logging.NewBCPZapLogger("info")
	if err != nil {
		instrumentation.LogAndPrintError(err)
		panic("request logger couldn't be created")
	}
	config.AppLogger, err = logging.NewBCPZapLogger("info")
	if err != nil {
		instrumentation.LogAndPrintError(err)
		panic("application logger couldn't be created")
	}
	defer config.AppLogger.Sync()
	defer requestLogger.Sync()

	// DB connections
	// postgres application Database connection.
	config.Datastore.AppDatabase, err = database.ConnectPostgres()
	if err != nil {
		instrumentation.LogAndPrintError(err)
		fmt.Printf("Failed to connect to the db %s \n", err.Error())
		panic(err)
	}
	defer config.Datastore.AppDatabase.Close()
	ok := database.Sync("./database/migrations")
	if ok != nil && ok != migrate.ErrNoChange {
		panic(ok)
	}

	err = database.RedisConn(appConfig.GetRedisDns(APPENV), APPENV)
	if err != nil {
		// panic(err)
		log.Errorf("error connecting to redis %s", appConfig.GetRedisDns(APPENV))
	}
	defer database.RedisClient.Close()

	// Redis Distributed Lock
	pool := goredis.NewPool(database.RedisClient)
	rs := redsync.New(pool)
	mutexname := "redis-global-mutex"
	database.RedisDL = rs.NewMutex(mutexname)

	if APPENV == "dev" {
		config.Datastore.ReadDatabase, err = mongo.NewClient(options.Client().ApplyURI("mongodb://mongodb"))
	} else {
		config.Datastore.ReadDatabase, err = mongo.NewClient(options.Client().ApplyURI(appConfig.GetDBInquistConnectionString()).SetWriteConcern(writeconcern.New(writeconcern.WMajority())))
	}

	if err != nil {
		panic(err)
	}
	readDbConnectionCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	err = config.Datastore.ReadDatabase.Connect(readDbConnectionCtx)
	if err != nil {
		panic(err)
	}

	defer func() {
		if err = config.Datastore.ReadDatabase.Disconnect(readDbConnectionCtx); err != nil {
			panic(err)
		}
	}()

	err = interactors.CreateFormations()
	if err != nil {
		panic(err)
	}

	//event_streaming config
	eventstreamLogger, _ := logging.NewBCPZapLogger("info")
	router, err := eventstream.NewRouter(eventstream.RouterConfig{}, eventstreamLogger)
	if err != nil {
		panic(err)
	}

	router.AddMiddleware(middleware.Recoverer)

	cqrs.CQRSFacade, err = cqrs.NewFacade(cqrs.FacadeConfig{
		GenerateCommandsTopic: eventstream.StructName,
		CommandHandlers: func(cb *kafka.CommandBusWriteStream, eb *kafka.EventBusWriteStream) []cqrs.CommandHandler {
			return []cqrs.CommandHandler{
				cmdHandlers.AddPostHandler{EventBus: eb},
				cmdHandlers.AddPostAnswerHandler{EventBus: eb},
				cmdHandlers.AddRevisionToPostHandler{EventBus: eb},
				cmdHandlers.AddRevisionToPostAnswerHandler{EventBus: eb},
				cmdHandlers.CommentOnPostHandler{EventBus: eb},
				cmdHandlers.CommentOnAnswerHandler{EventBus: eb},
				cmdHandlers.FlagPostHandler{EventBus: eb},
				cmdHandlers.FlagAnswerHandler{EventBus: eb},
				cmdHandlers.FlagCommentHandler{EventBus: eb},
				cmdHandlers.VoteUpPostHandler{EventBus: eb},
				cmdHandlers.VoteDownPostHandler{EventBus: eb},
				cmdHandlers.VoteUpAnswerHandler{EventBus: eb},
				cmdHandlers.VoteDownAnswerHandler{EventBus: eb},
				cmdHandlers.VoteUpCommentHandler{EventBus: eb},
				cmdHandlers.AcceptAnswerHandler{EventBus: eb},
				cmdHandlers.RetractAcceptAnswerHandler{EventBus: eb},
				cmdHandlers.RetractVoteUpCommentHandler{EventBus: eb},
				cmdHandlers.RetractVoteDownPostHandler{EventBus: eb},
				cmdHandlers.RetractFlagAnswerHandler{EventBus: eb},
				cmdHandlers.RetractVoteUpPostHandler{EventBus: eb},
				cmdHandlers.RetractVoteUpAnswerHandler{EventBus: eb},
				cmdHandlers.RetractFlagCommentHandler{EventBus: eb},
				cmdHandlers.RetractFlagPostHandler{EventBus: eb},
				cmdHandlers.RetractVoteDownAnswerHandler{EventBus: eb},
			}
		},
		CommandsPublisher: kafka.NewProducer(),
		CommandsConsumerConstructor: func(commandName string) (eventstream.Reader, error) {
			return kafka.NewConsumer(commandName, eventstreamLogger), nil
		},
		GenerateEventsTopic: eventstream.StructName,
		EventHandlers: func(cb *kafka.CommandBusWriteStream, eb *kafka.EventBusWriteStream) []cqrs.EventHandler {
			return []cqrs.EventHandler{
				evtHandlers.PostTaggedHandler{CommandBus: cb},
				evtHandlers.PostUpVotedHandler{CommandBus: cb},
				evtHandlers.PostDownVotedHandler{CommandBus: cb},
				evtHandlers.AnswerUpVotedHandler{CommandBus: cb},
				evtHandlers.AnswerDownVotedHandler{CommandBus: cb},
				evtHandlers.AnswerAcceptedHandler{CommandBus: cb},
				evtHandlers.RetractedAnswerAcceptedHandler{CommandBus: cb},
				evtHandlers.RetractedPostDownVotedHandler{CommandBus: cb},
				evtHandlers.RetractedPostUpVotedHandler{CommandBus: cb},
			}
		},
		EventsPublisher: kafka.NewProducer(),
		EventsSubscriberConstructor: func(eventName string) (eventstream.Reader, error) {
			return kafka.NewConsumer(eventName, eventstreamLogger), nil
		},
		Router: router,
		CommandEventMarshaler: eventstream.ProtobufMarshaler{
			NewUUID:      func() string { return uuid.New().String() },
			GenerateName: eventstream.StructName,
		},
		Logger: eventstreamLogger,
	})
	if err != nil {
		panic(err)
	}

	go func() {
		// processors are based on router, so they will work when router will start
		if err := router.Run(context.Background()); err != nil {
			panic(err)
		}
	}()

	// cron
	c := cron.New()
	c.AddFunc("*/2 * * * *", jobs.ModeratorRevisionsReview)
	c.AddFunc("*/4 * * * *", jobs.ModeratorRevisionsReviewed)

	c.Start()
	defer c.Stop()
	//message broker
	redis.MessageBrokerClient = redis.NewBroker()
	// app instrumentatin
	if os.Getenv("DISABLE_TRACING") == "" {
		config.AppLogger.Info("Tracing enabled.")
		ocgorm.RegisterCallbacks(config.Datastore.AppDatabase)
		go initTracing()
	} else {
		config.AppLogger.Info("Tracing disabled.")
	}
	if os.Getenv("DISABLE_PROFILER") == "" {
		config.AppLogger.Info("Profiling enabled.")
		go initProfiling("backend", apiVersion)
	} else {
		log.Info("Profiling disabled.")
	}
	// password reset email callback
	messages.PasswordCallback = appConfig.GetPasswordCallback(APPENV)
	messages.AdvisorPasswordCallback = appConfig.GetAdvisorPasswordCallback(APPENV)
	// secrets.
	services.OTPsecret = appConfig.GetOTPSecret()
	middlewares.TokenSecret = appConfig.GetSecret()
	//api keys
	messages.MailApiKey = appConfig.GetSendGridApiKey()
	messages.SMSApiSID = appConfig.GetTwilioSID()
	messages.SMSAuthToken = appConfig.GetTwilioAuthToken()

	// Do this once for each unique policy, and use the policy for the life of the program
	// Policy creation/editing is not safe to use in multiple goroutines
	sanitisePolicy.PostContentSaniter = bluemonday.UGCPolicy()

	app := gin.New()
	// run in release for staging / prod
	if APPENV != "dev" {
		gin.SetMode(gin.ReleaseMode)
	}
	// app.Use(middleware.RequestID)
	// app.Use(middleware.RealIP)
	// app.Use(middlewares.EnsureSessionID(APPENV))
	app.Use(middlewares.RequestLogger(requestLogger))
	// Recovery middleware recovers from any panics
	// and writes a 500 if there was one.
	app.Use(gin.Recovery())

	// CORS
	config := cors.DefaultConfig()
	okey := fmt.Sprintf("env.%s.clients", APPENV)
	config.AllowOrigins = appConfig.GetStringSlice(okey)
	config.AllowCredentials = true
	//	app.Use(middlewares.CSP())
	app.Use(cors.New(config))

	v := fmt.Sprintf("/%s", apiVersion)

	app.GET("/healthz", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "it's alive",
		})
	})
	app.GET("/custom_debug_path/profile", func(c *gin.Context) {
		pprof.Profile(c.Writer, c.Request)
	})
	app.GET("/robots.txt", func(c *gin.Context) {
		c.JSON(200, "User-agent: *\nDisallow: /")
	})
	app.MaxMultipartMemory = 8 << 20
	app.NoRoute(func(c *gin.Context) {
		c.JSON(404, gin.H{"code": "RESOURCE_NOT_FOUND", "message": "Resource not found"})
	})
	userGroup := app.Group(v)
	// user auth
	userGroup.POST("/user", interactors.UserCreate)
	userGroup.POST("/user/account/password/recover", interactors.UserPasswordRecover)
	userGroup.POST("/user/account/login", interactors.Login)
	userGroup.GET("/renew_password_token/:token", interactors.GetToken)
	userGroup.POST("/token/refresh", interactors.RefreshUserToken)
	// contact guidhub
	// userGroup.POST("/user/account/contact", interactors.SendContactMessage)
	// Auth contact
	userGroup.Use(middlewares.TokenAuthMiddleware())
	userGroup.Use(middlewares.UserActivityMiddleware())

	{
		userGroup.GET("/user/account/projects", interactors.GetUserProjects)
		userGroup.POST("/user/account/confirm", interactors.ValidateOtp)
		userGroup.POST("user/resend-validation-code", interactors.ResendValidationCode)
		userGroup.POST("/user/projects/new", interactors.ProjectCreate)
		userGroup.POST("/user/activity_sector/new", interactors.ActivityCreate)
		userGroup.POST("/user/projects/:id/expert-status", interactors.ProjectExpertStatus)
		userGroup.POST("/user/projects/:id/service-needed", interactors.ProjectServiceCreate)
		userGroup.POST("/user/account/password", interactors.UserPassword)
		userGroup.PUT("/user/account", interactors.UpdateUserProfile)
		// userGroup.POST("/user/account/password/modify", interactors.UserPasswordModify)
		// userGroup.POST("/user/account/email/modify", interactors.UserEmailModify)
		userGroup.POST("/user/feedback", interactors.UserFeedback)
		// userGroup.POST("/user/account/phone/modify", interactors.UserPhoneModify)
		// userGroup.POST("/user/account/name/modify", interactors.UserNameModify)
		userGroup.POST("/user/account/send-code", interactors.UserSendPhoneCode)
		userGroup.POST("/user/account/verify-code", interactors.UserVerifyPhoneCode)
		// userGroup.POST("/user/project-validation/verify-code", interactors.UserProjectValidationVerifyPhoneCode)
		userGroup.POST("/user/account/resend-code", interactors.UserResendPhoneCode)
		userGroup.POST("/user/account/delete", interactors.DeleteUser)
		userGroup.POST("/user/account/logout", interactors.Logout)
		userGroup.GET("/user/account/auth", interactors.GetAuthUser)
		userGroup.POST("/workstation/projects/:id/project_preparation", interactors.EditProjectPreparation)
		userGroup.POST("/workstation/projects/:id/project_market_research", interactors.EditProjectMarketResearch)
		userGroup.POST("/workstation/projects/:id/project_legal_status", interactors.EditProjectLegalStatus)
		userGroup.GET("/workstation/projects/:id/project_legal_status", interactors.GetProjectLegalStatus)
		userGroup.POST("/workstation/projects/:id/project_legal_status/criteria-based", interactors.EditProjectCriteriaBasedLegalStatus)
		userGroup.POST("/workstation/projects/:id/project_taxes_configurations/criteria-based", interactors.EditProjectCriteriaBasedTax)
		userGroup.POST("/workstation/projects/:id/project_tva_configurations/criteria-based", interactors.EditProjectCriteriaBasedTva)
		userGroup.PUT("/workstation/projects/:id/project/edit", interactors.EditProject)
		userGroup.POST("/workstation/projects/:id/project/validation-rdv", interactors.ProjectLaunch)
		userGroup.POST("workstation/projects/:id/project/finance/validation-rdv", interactors.ProjectFinanceLaunch)
		userGroup.POST("/workstation/projects/:id/investments", interactors.CreateProjectInvestment)
		userGroup.GET("/workstation/projects/:id/investments", interactors.FetchProjectInvestments)
		userGroup.DELETE("/workstation/projects/:id/investments", interactors.DeleteProjectInvestment)
		userGroup.PUT("/workstation/projects/:id/investments", interactors.EditProjectInvestment)
		userGroup.POST("/workstation/projects/:id/loans", interactors.CreateProjectLoan)
		userGroup.GET("/workstation/projects/:id/loans", interactors.FetchProjectLoans)
		userGroup.DELETE("/workstation/projects/:id/loans", interactors.DeleteProjectLoan)
		userGroup.PUT("/workstation/projects/:id/loans", interactors.EditProjectLoan)
		userGroup.POST("/workstation/projects/:id/stakeholders", interactors.CreateProjectStakeholder)
		userGroup.GET("/workstation/projects/:id/stakeholders", interactors.FetchProjectStakeholders)
		userGroup.DELETE("/workstation/projects/:id/stakeholders", interactors.DeleteProjectStakeholder)
		userGroup.PUT("/workstation/projects/:id/", interactors.EditProjectStakeholder)
		userGroup.POST("/workstation/projects/:id/revenue-source", interactors.CreateProjectRevenueSource)
		userGroup.DELETE("/workstation/projects/:id/revenue-source", interactors.DeleteProjectRevenueSource)
		userGroup.PUT("/workstation/projects/:id/revenue-source", interactors.EditProjectRevenueSource)
		userGroup.POST("/workstation/projects/:id/associates_capital_contributions", interactors.CreateProjectAssociatesCapitalContribution)
		userGroup.GET("/workstation/projects/:id/associates_capital_contributions", interactors.FetchProjectAssociatesCapitalContributions)
		userGroup.DELETE("/workstation/projects/:id/associates_capital_contributions", interactors.DeleteProjectAssociatesCapitalContribution)
		userGroup.PUT("/workstation/projects/:id/associates_capital_contributions", interactors.EditProjectAssociatesCapitalContribution)
		userGroup.POST("/workstation/projects/:id/capital_contributions", interactors.CreateProjectCapitalContribution)
		userGroup.GET("/workstation/projects/:id/capital_contributions", interactors.FetchProjectCapitalContributions)
		userGroup.DELETE("/workstation/projects/:id/capital_contributions", interactors.DeleteProjectCapitalContribution)
		userGroup.PUT("/workstation/projects/:id/capital_contributions", interactors.EditProjectCapitalContribution)
		userGroup.GET("/workstation/projects/:id/funding-details", interactors.FetchFundingDetails)
		userGroup.POST("/workstation/projects/:id/expenses", interactors.CreateProjectExpense)
		userGroup.GET("/workstation/projects/:id/expenses", interactors.FetchProjectExpenses)
		userGroup.DELETE("/workstation/projects/:id/expenses", interactors.DeleteProjectExpense)
		userGroup.PUT("/workstation/projects/:id/expenses", interactors.EditProjectExpense)
		userGroup.POST("/workstation/projects/:id/revenues", interactors.CreateProjectRevenue)
		userGroup.GET("/workstation/projects/:id/revenue-details", interactors.FetchRevenueDetails)
		userGroup.DELETE("/workstation/projects/:id/revenues", interactors.DeleteProjectRevenue)
		userGroup.PUT("/workstation/projects/:id/revenues", interactors.EditProjectRevenue)
		userGroup.GET("/workstation/projects/:id/employee-details", interactors.FetchEmployeeDetails)
		userGroup.POST("/workstation/projects/:id/employee", interactors.CreateProjectEmployee)
		userGroup.DELETE("/workstation/projects/:id/employee", interactors.DeleteProjectEmployee)
		userGroup.PUT("/workstation/projects/:id/employee", interactors.EditProjectEmployee)
		userGroup.POST("/workstation/projects/:id/director", interactors.CreateProjectDirector)
		userGroup.DELETE("/workstation/projects/:id/director", interactors.DeleteProjectDirector)
		userGroup.PUT("/workstation/projects/:id/director", interactors.EditProjectDirector)
		userGroup.GET("/director-cotisation-processing", interactors.DirectorCotisationProcessing)
		userGroup.GET("/workstation/projects/:id/finance", interactors.FetchFinancialDetails)
		userGroup.GET("/workstation/projects/:id/aid", interactors.GetFinancialAid)
		userGroup.GET("/workstation/projects/:id/aid/:aid", interactors.GetAid)
		userGroup.GET("/workstation/projects/:id/aid-geo-meta/:geoid", interactors.GetTerritory)
		userGroup.POST("/workstation/projects/:id/verifications", interactors.CreateProjectVerification)
		userGroup.GET("/workstation/projects/:id/verifications", interactors.FetchProjectVerifications)
		userGroup.GET("/workstation/projects/:id/verifications/:label", interactors.FetchProjectVerification)
		userGroup.PUT("/workstation/projects/:id/verifications/visibility", interactors.EditProjectVerificationVisibility)
		userGroup.GET("/workstation/projects/:id/verifications-aggregate", interactors.FetchProjectVerificatioAggregate)
		userGroup.GET("/workstation/projects/:id/trouver-son-financement/project-financing-capacity", interactors.FetchProjectFinanceCapacity)
		userGroup.POST("/workstation/projects/:id/trouver-son-financement/project-financing-capacity", interactors.EditProjectFinanceCapacity)
		userGroup.GET("/workstation/guide/:guide/case-study", interactors.FetchGuideCaseStudy)
		userGroup.POST("/workstation/guide/case-study", interactors.EditGuideCaseStudy)
		userGroup.GET("/workstation/projects/:id/project/agency/geo-search", interactors.AgencyGeoSearch)
		userGroup.GET("/workstation/projects/:id/project-address", interactors.FetchProjectAddress)
		userGroup.POST("/workstation/projects/:id/project-address", interactors.EditProjectAddress)
		userGroup.GET("/workstation/projects/:id/testsuite", interactors.GetCreatorProjectTestSuite)
		userGroup.POST("/workstation/user_feedback", interactors.CreateUserFeedback)
		userGroup.GET("/workstation/micro_formation", interactors.GetMicroFormations)
		userGroup.POST("/workstation/micro_formation/:id/view", interactors.MicroFormationViewed)
		userGroup.POST("/workstation/micro_formation/:id/like", interactors.MicroFormationLiked)
		userGroup.POST("/workstation/micro_formation/:id/like_downgrade", interactors.MicroFormationLikedRemove)
		userGroup.GET("/community/chat/:id", messaging.WebSocketUser)
		userGroup.GET("/community/inquisition", eventstreaming.WebSocketUser)
		userGroup.GET("/workstation/projects/:id/wsWebRtc/", webrtc.WebSocketHandler)
		userGroup.GET("/workstation/inquisite/posts", inquisite.GetPosts)
		userGroup.GET("/workstation/inquisite/post", inquisite.GetPostById)
		userGroup.GET("/workstation/inquisite/posts/search", inquisite.GetPostsBy)
		userGroup.GET("workstation/inquisite/post/tags", inquisite.GetPostTags)
		userGroup.GET("workstation/inquisite/post/answers", inquisite.GetPostAnswers)
		userGroup.GET("/workstation/inquisite/post/answer", inquisite.GetPostAnswer)
		userGroup.GET("/workstation/inquisite/answers/:id/votes", inquisite.GetAnswerVotes)
		userGroup.GET("/workstation/inquisite/posts/:id/votes", inquisite.GetPostVotes)
		userGroup.GET("/workstation/inquisite/posts/:id/comments", inquisite.GetPostComments)
		userGroup.GET("/workstation/inquisite/answers/:id/comments", inquisite.GetAnswerComments)
		userGroup.GET("workstation/inquisite/community/reputation", inquisite.GetCommunityReputation)
		userGroup.GET("workstation/inquisite/authors", inquisite.GetAuthor)
		userGroup.GET("workstation/inquisite/comments/:id/flags", inquisite.GetCommentFlag)
		userGroup.GET("workstation/inquisite/posts/:id/flags", inquisite.GetPostFlag)
		userGroup.GET("workstation/inquisite/answers/:id/flags", inquisite.GetAnswerFlag)
		userGroup.GET("workstation/projects/:id/business_plan", interactors.GetBusinessPlan)
	}

	stakeholderGroup := app.Group(v)
	stakeholderGroup.POST("/stakeholder/account/password/recover", interactors.StakeholderPasswordRecover)
	stakeholderGroup.POST("/stakeholder/account/invite/auth", interactors.StakeholderAuthInviteToken)
	stakeholderGroup.POST("/stakeholder/account/login", interactors.Stakeholderlogin)
	stakeholderGroup.GET("/stakeholder/renew_password_token/:token", interactors.GetStakeholderToken)
	stakeholderGroup.POST("/stakeholder/token/refresh", interactors.RefreshStakeholderToken)
	stakeholderGroup.Use(middlewares.StakeholderTokenAuthMiddleware())
	// stakeholderGroup.Use(middlewares.StakeholderActivityMiddleware())

	{
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/business_plan", interactors.GetBusinessPlan)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/testsuite", interactors.GetCreatorProjectTestSuite)
		stakeholderGroup.GET("/stakeholder/account/projects", interactors.GetStakeholderProject)
		stakeholderGroup.POST("stakeholder/resend-validation-code", interactors.ResendStakeholderValidationCode)
		stakeholderGroup.POST("/stakeholder/account/password", interactors.StakeholderPassword)
		stakeholderGroup.POST("/stakeholder/account/confirm", interactors.ValidateStakeholderOtp)
		stakeholderGroup.POST("/stakeholder/account/password/modify", interactors.StakeholderPasswordModify)
		stakeholderGroup.POST("/stakeholder/feedback", interactors.StakeholderFeedback)
		stakeholderGroup.POST("/stakeholder/account/logout", interactors.StakeholderLogout)
		stakeholderGroup.GET("/stakeholder/account/auth", interactors.AuthStakeholder)
		stakeholderGroup.GET("stakeholder/workstation/projects/:id/project_legal_status", interactors.GetProjectLegalStatus)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/investments", interactors.FetchProjectInvestments)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/loans", interactors.FetchProjectLoans)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/stakeholders", interactors.FetchProjectStakeholders)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/associates_capital_contributions", interactors.FetchProjectAssociatesCapitalContributions)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/capital_contributions", interactors.FetchProjectCapitalContributions)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/funding-details", interactors.FetchFundingDetails)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/expenses", interactors.FetchProjectExpenses)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/revenue-details", interactors.FetchRevenueDetails)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/employee-details", interactors.FetchEmployeeDetails)
		stakeholderGroup.GET("/stakeholder/director-cotisation-processing", interactors.DirectorCotisationProcessing)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/finance", interactors.FetchFinancialDetails)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/aid", interactors.GetFinancialAid)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/aid/:aid", interactors.GetAid)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/aid-geo-meta/:geoid", interactors.GetTerritory)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/verifications", interactors.FetchProjectVerifications)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/verifications/:label", interactors.FetchProjectVerification)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/verifications-aggregate", interactors.FetchProjectVerificatioAggregate)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/trouver-son-financement/project-financing-capacity", interactors.FetchProjectFinanceCapacity)
		stakeholderGroup.GET("/stakeholder/workstation/guide/:guide/case-study", interactors.FetchGuideCaseStudy)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/project/agency/geo-search", interactors.AgencyGeoSearch)
		stakeholderGroup.GET("/stakeholder/workstation/projects/:id/project-address", interactors.FetchProjectAddress)
		stakeholderGroup.GET("/stakeholder/workstation/micro_formation", interactors.GetMicroFormationsStakeholder)
		stakeholderGroup.POST("/stakeholder/workstation/micro_formation/:id/view", interactors.MicroFormationViewedStakeholder)
		stakeholderGroup.POST("/stakeholder/workstation/micro_formation/:id/like", interactors.MicroFormationLikedStakeholder)
		stakeholderGroup.POST("/stakeholder/workstation/micro_formation/:id/like_downgrade", interactors.MicroFormationLikedRemoveStakeholder)
		stakeholderGroup.GET("/stakeholder/community/chat", messaging.WebSocketStakeholder)
		stakeholderGroup.GET("/stakeholder/community/inquisition", eventstreaming.WebSocketStakeholder)
		stakeholderGroup.GET("/stakeholder/workstation/projects/wsWebRtc/", webrtc.WebSocketStakeholder)
		stakeholderGroup.GET("/stakeholder/workstation/inquisite/posts", inquisite.GetPosts)
		stakeholderGroup.GET("/stakeholder/workstation/inquisite/post", inquisite.GetPostById)
		stakeholderGroup.GET("/stakeholder/workstation/inquisite/posts/search", inquisite.GetPostsBy)
		stakeholderGroup.GET("/stakeholder/workstation/inquisite/post/tags", inquisite.GetPostTags)
		stakeholderGroup.GET("/stakeholder/workstation/inquisite/post/answers", inquisite.GetPostAnswers)
		stakeholderGroup.GET("/stakeholder/workstation/inquisite/post/answer", inquisite.GetPostAnswer)
		stakeholderGroup.GET("/stakeholder/workstation/inquisite/answers/:id/votes", inquisite.GetAnswerVotes)
		stakeholderGroup.GET("/stakeholder/workstation/inquisite/posts/:id/votes", inquisite.GetPostVotes)
		stakeholderGroup.GET("/stakeholder/workstation/inquisite/posts/:id/comments", inquisite.GetPostComments)
		stakeholderGroup.GET("/stakeholder/workstation/inquisite/answers/:id/comments", inquisite.GetAnswerComments)
		stakeholderGroup.GET("/stakeholder/workstation/inquisite/community/reputation", inquisite.GetCommunityReputation)
		stakeholderGroup.GET("/stakeholder/workstation/inquisite/authors", inquisite.GetAuthor)
		stakeholderGroup.GET("/stakeholder/workstation/inquisite/comments/:id/flags", inquisite.GetCommentStakeholderFlag)
		stakeholderGroup.GET("/stakeholder/workstation/inquisite/posts/:id/flags", inquisite.GetPostFlag)
		stakeholderGroup.GET("/stakeholder/workstation/inquisite/answers/:id/flags", inquisite.GetAnswerStakeholderFlag)
	}
	server.Run(app)
}

func initStats(exporter *stackdriver.Exporter) {
	view.SetReportingPeriod(60 * time.Second)
	view.RegisterExporter(exporter)
	if err := view.Register(
		// Gin (HTTP) stats
		ochttp.ServerRequestCountView,
		ochttp.ServerRequestBytesView,
		ochttp.ServerResponseBytesView,
		ochttp.ServerLatencyView,
		ochttp.ServerRequestCountByMethod,
		ochttp.ServerResponseCountByStatusCode,

		// Gorm stats
		ocgorm.QueryCountView,
	); err != nil {
		instrumentation.LogAndPrintError(err)
		config.AppLogger.Warn("Error registering http default server views")
	} else {
		config.AppLogger.Info("Registered http default server views")
	}
}

func initStackdriverTracing() {

	instanceID, err := metadata.InstanceID()
	if err != nil {
		instanceID = "unknown"
	}
	zone, err := metadata.Zone()
	if err != nil {
		instrumentation.LogAndPrintError(err)
		zone = "unknown"
	}
	clusterName := os.Getenv("CLUSTER_NAME")
	namespace := os.Getenv("MY_POD_NAMESPACE")
	pod := os.Getenv("MY_POD_NAME")
	container := os.Getenv("MY_CONTAINER_NAME")
	for i := 1; i <= 3; i++ {
		config.AppLogger = config.AppLogger.AddContext("retry_stackdriver_tracing_", i)
		exporter, err := stackdriver.NewExporter(stackdriver.Options{
			ProjectID: PROJECTID,
			// Set a MonitoredResource that represents a GKE container.
			Resource: &monitoredres.MonitoredResource{
				Type: "gke_container",
				Labels: map[string]string{
					"project_id":   PROJECTID,
					"cluster_name": clusterName,
					"instance_id":  instanceID,
					"zone":         zone,

					// See: https://kubernetes.io/docs/tasks/inject-data-application/environment-variable-expose-pod-information/
					"namespace_id":   namespace,
					"pod_id":         pod,
					"container_name": container,
				},
			},
			// Set DefaultMonitoringLabels to avoid getting the default "opencensus_task"
			// label. For this to be valid, this exporter should be the only writer
			// to the metrics against this gke_container MonitoredResource. In this case,
			// it means you should only have one process writing to Stackdriver from this
			// container.
			DefaultMonitoringLabels: &stackdriver.Labels{},
		})
		if err != nil {
			// log.Warnf is used since there are multiple backends (stackdriver & jaeger)
			// to store the traces. In production setup most likely you would use only one backend.
			// In that case you should use log.Fatalf.
			instrumentation.LogAndPrintError(err)
			config.AppLogger.Fatal(fmt.Sprintf("failed to initialize Stackdriver exporter: %+v", err))
		} else {
			trace.RegisterExporter(exporter)
			config.AppLogger.Info("registered Stackdriver tracing")

			// Register the views to collect server stats.
			initStats(exporter)
			return
		}
		d := time.Second * 20 * time.Duration(i)
		config.AppLogger.Debug(fmt.Sprintf("sleeping %v to retry initializing Stackdriver exporter", d))
		time.Sleep(d)
	}
	config.AppLogger.Warn("could not initialize Stackdriver exporter after retrying, giving up")
}

func initProfiling(service, version string) {
	for i := 1; i <= 3; i++ {
		config.AppLogger = config.AppLogger.AddContext("retry_stackdriver_profiling_", i)
		if err := profiler.Start(profiler.Config{
			Service:        service,
			ServiceVersion: version,
			// ProjectID must be set if not running on GCP.
			// ProjectID: "my-project",
		}); err != nil {
			instrumentation.LogAndPrintError(err)
			config.AppLogger.Warn(fmt.Sprintf("warn: failed to start profiler: %+v", err))
		} else {
			config.AppLogger.Info("started Stackdriver profiler")
			return
		}
		d := time.Second * 10 * time.Duration(i)
		config.AppLogger.Debug(fmt.Sprintf("sleeping %v to retry initializing Stackdriver profiler", d))
		time.Sleep(d)
	}
	config.AppLogger.Warn("warning: could not initialize Stackdriver profiler after retrying, giving up")
}

func initTracing() {
	// This is a demo app with low QPS. trace.AlwaysSample() is used here
	// to make sure traces are available for observation and analysis.
	// In a production environment or high QPS setup please use
	// trace.ProbabilitySampler set at the desired probability.
	trace.ApplyConfig(trace.Config{DefaultSampler: trace.ProbabilitySampler(0.001)})

	//initJaegerTracing(log)
	initStackdriverTracing()
}
