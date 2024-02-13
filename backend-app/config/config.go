package config

import (
	"context"
	"errors"
	"fmt"

	"github.com/jinzhu/gorm"
	"github.com/spf13/viper"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/pkg/logging"
	"go.mongodb.org/mongo-driver/mongo"
	"googlemaps.github.io/maps"
)

var ErrNoReponse = errors.New("no results for this request")

// Datastore allows access to the database.
var Datastore globalConfig

// Application logger
var AppLogger logging.BCPLogger

// GlobalConfig is the system wide configuration
type globalConfig struct {
	AppDatabase  *gorm.DB
	ReadDatabase *mongo.Client
}

// APPConfig is the config
// object used by the application server.
type APPConfig struct {
	*viper.Viper
}

// Config contains information
// required to set up an APPConfig
type Config struct {
	File   string
	Format string
	Path   string
}

// New returns an APPConfig instance
func New(cfg Config, d map[string]interface{}) (*APPConfig, error) {
	v := viper.New()
	for key, value := range d {
		v.SetDefault(key, value)
	}
	v.AutomaticEnv()
	v.SetConfigType(cfg.Format)
	v.SetConfigName(cfg.File)
	v.AddConfigPath(cfg.Path)
	if err := v.ReadInConfig(); err != nil {
		return nil, err
	}
	return &APPConfig{v}, nil
}

func (appCfg *APPConfig) GeoCode(r *maps.GeocodingRequest) ([2]float64, error) {
	apiKey := appCfg.getGoogleApiKey()
	c, _ := maps.NewClient(maps.WithAPIKey(apiKey))

	resp, err := c.Geocode(context.Background(), r)
	if err != nil {
		return [2]float64{0, 0}, err
	}
	if len(resp) == 0 {
		return [2]float64{0, 0}, ErrNoReponse
	}
	geoLoc := resp[0]
	return [2]float64{
		geoLoc.Geometry.Location.Lng,
		geoLoc.Geometry.Location.Lat,
	}, nil
}

func (appCfg *APPConfig) GetSecret() string {
	return appCfg.GetString("TOKEN_SECRET_SALT")
}
func (appCfg *APPConfig) GetPasswordCallback(env string) string {
	k := fmt.Sprintf("env.%s.password_callback", env)
	return appCfg.GetString(k)
}
func (appCfg *APPConfig) GetAdvisorPasswordCallback(env string) string {
	k := fmt.Sprintf("env.%s.advisor_password_callback", env)
	return appCfg.GetString(k)
}
func (appCfg *APPConfig) GetBAEmailActivationCallback(env string) string {
	k := fmt.Sprintf("env.%s.advisor_email_activation_callback", env)
	return appCfg.GetString(k)
}
func (appCfg *APPConfig) GetFrontendUrl(env string) string {
	k := fmt.Sprintf("env.%s.client", env)
	return appCfg.GetString(k)
}
func (appCfg *APPConfig) GetUserInviteEmbededLink(env string) string {
	k := fmt.Sprintf("env.%s.user_invite_link", env)
	return appCfg.GetString(k)
}
func (appCfg *APPConfig) GetRedisDns(env string) string {
	k := fmt.Sprintf("env.%s.redis", env)
	return appCfg.GetString(k)
}
func (appCfg *APPConfig) GetKafkaDns(env string) string {
	k := fmt.Sprintf("env.%s.kafka", env)
	return appCfg.GetString(k)
}
func (appCfg *APPConfig) GetOTPSecret() string {
	return appCfg.GetString("OTP_SECRET")
}
func (appCfg *APPConfig) GetSendGridApiKey() string {
	return appCfg.GetString("SENDGRID_API_KEY")
}
func (appCfg *APPConfig) getGoogleApiKey() string {
	return appCfg.GetString("GOOGLE_SERVICES_API_KEY")
}
func (appCfg *APPConfig) GetTwilioSID() string {
	return appCfg.GetString("TWILIO_ACCOUNT_SID")
}
func (appCfg *APPConfig) GetTwilioAuthToken() string {
	return appCfg.GetString("TWILIO_AUTH_TOKEN")
}
func (appCfg *APPConfig) GetDBInquist() string {
	return appCfg.GetString("DB_INQUIST")
}
func (appCfg *APPConfig) GetDBInquistConnectionString() string {
	return appCfg.GetString("DB_INQUIST_CONNECTION_STRING")
}
