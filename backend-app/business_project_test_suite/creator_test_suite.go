package businessProjectTestSuite

import (
	"context"
	"os"

	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

var (
	dbname                                        = "DB_BUSINESS_TEST_SUITES"
	DB                                            = os.Getenv(dbname)
	dbCollectionCreatorProjectTestSuite           = "testSuites.creator"
	dbCollectionCreatorProjectTestSuiteConditions = "testSuitesConditions.creator"
	dbCollectionCreatorProjectTestSuiteFollowUp   = "testSuitesFollowUp.creator"
	dbCollectionCreatorProjectTestSuiteSupport    = "testSuitesSupport.creator"
)

type CreatorProjectTestSuite map[string]interface{}

var testSuite CreatorProjectTestSuite = map[string]interface{}{
	"pole_emploi_aid_scheme_for_business_creation": map[string]interface{}{
		"label": "Votre dispositif d'aide Pôle emploi",
		"recommendation": map[string]interface{}{
			"response": map[string]interface{}{
				"Le maintien des allocations d'aide au retour à l'emploi": map[string]map[string]string{
					"IR": {
						"independant": "Attention, étant donné que vous serez affilié à la sécurité sociale des indépendants et que vous avez choisi l'IR au niveau de l'imposition des bénéfices de votre entreprise, vous ne pourrez pas obtenir le maintien intégral de vos allocations. Une régularisation de vos allocations sera également opérée lorsque vos revenus définitifs seront déclarés à l'administration. Le maintien intégral des allocations est uniquement possible à la double condition suivante : vous créez une entreprise à l'impôt sur les sociétés (IS) et vous ne vous versez pas de rémunération.",
						"employee":    "En principe, vous pourrez conserver le versement de vos allocations après avoir créé votre entreprise. Étant donné que vous n'êtes pas affilié à la sécurité sociale des indépendants, votre revenu servant de base de calcul de vos cotisations sociales ne correspond pas à votre bénéfice professionnel. Pour obtenir le maintien de vos allocations, vous devez signaler votre création d'entreprise auprès de votre agence Pôle emploi. En fournissant un procès-verbal de non-rémunération de vos fonctions de dirigeant, vous pourrez obtenir le maintien intégral du versement de vos allocations.",
					},
					"IS": {
						"Pas de salaires dirigeant les 24 premiers mois": "Vous pourrez conserver le versement de vos allocations après avoir créé votre entreprise. Pour cela, vous devez signaler votre création d'entreprise auprès de votre agence Pôle emploi. En fournissant un procès-verbal de non-rémunération de vos fonctions de dirigeant, vous pourrez obtenir le maintien intégral du versement de vos allocations. ",
						"Salaires dirigeant les 24 premiers mois":        "Vous pourrez conserver le versement de vos allocations après avoir créé votre entreprise. Pour cela, vous devez signaler votre création d'entreprise auprès de votre agence Pôle emploi. Étant donné que vous comptez vous octroyer une rémunération, le maintien du versement de vos allocations sera partiel, voire suspendu, en fonction du montant de votre rémunération.",
					},
				},
				"Le versement en capital d'une partie de mes droits (ARCE)": map[string]string{
					"Pas de salaires dirigeant": "Nous avons remarqué, dans votre prévisionnel, que vous n'avez pas prévu de vous rémunérer. Attention, en choisissant le versement en capital, vous ne percevrez plus vos allocations mensuelles. Avant de valider ce choix, êtes-vous certain de pouvoir subvenir à vos besoins personnels avec vos économies et/ou vos autres revenus ? Enfin, pour obtenir le versement en capital, vous devez remplir un formulaire de demande d'ARCE et le transmettre à Pôle emploi, et justifier la création de votre entreprise (en fournissant un extrait K-Bis par exemple). ",
					"Salaires dirigeant prévus": "Nous avons remarqué, dans votre prévisionnel, que vous avez prévu de vous rémunérer. Vous aurez donc un revenu régulier qui compensera l'absence de versement de vos allocations mensuelles (étant donné que l'option pour l'ARCE entraîne l'arrêt de l'indemnisation mensuelle). Enfin, pour obtenir le versement en capital, vous devez remplir un formulaire de demande d'ARCE et le transmettre à Pôle emploi, et justifier la création de votre entreprise (en fournissant un extrait K-Bis par exemple).",
				},
			},
		},
		"dependency": map[string][]bson.M{
			"current_employment_status": {
				{
					"field":     "Je suis sans emploi",
					"condition": false,
				}, {
					"field": "Je suis salarié", "condition": true,
				},
			},
		},
		"status": nil,
	},
	"accumulation_professional_income_retirement_pension": map[string]interface{}{
		"label": "Cumul revenu / pension retraite",
		"recommendation": map[string]interface{}{
			"response": map[string]interface{}{
				"Oui": map[string]string{
					"Oui": `
					<p>Vous pouvez cumuler librement votre pension retraite et vos revenus professionnels.</p>
					<p>Vous êtes tenu de prévenir votre caisse de retraite dans le mois qui suit la création de votre entreprise.</p>
					<p>Un modèle de déclaration est disponible sur le site internet <a target='_blank' href="https://www.service-public.fr/">service-public.fr</a>.</p>
					`,
					"Non": `
					<p>Vous pouvez cumuler votre pension retraite et vos revenus professionnels dans la limite d'un certain plafond propre à votre régime de retraite. </p>
					<p>Vous êtes tenu de prévenir votre caisse de retraite dans le mois qui suit la création de votre entreprise. </p>
					<p>Un modèle de déclaration est disponible sur le site internet <a target='_blank' href="https://www.service-public.fr/">service-public.fr</a>.</p>
					`,
				},
				"Non": map[string]string{
					"Oui": `
					<p>Vous pourrez cumuler librement votre pension retraite et vos revenus professionnels. </p>
					<p>Tout d'abord, vous devez demander la liquidation de votre pension retraite, ce qui implique de stopper toutes vos activités professionnelles. </p>
					<p>Il faut donc impérativement demander la liquidation de votre pension retraite avant de créer votre entreprise. Ensuite, vous devrez prévenir votre caisse de retraite dans le mois qui suit la création de votre entreprise. Un modèle de déclaration est disponible sur le site internet <a target='_blank' href="https://www.service-public.fr/">service-public.fr</a>.</p>
					`,
					"Non": `
					<p>Vous pouvez cumuler votre pension retraite et vos revenus professionnels dans la limite d'un certain plafond propre à votre régime de retraite. </p>
					<p>Tout d'abord, vous devez demander la liquidation de votre pension retraite, ce qui implique de stopper toutes vos activités professionnelles. Il faut donc impérativement demander la liquidation de votre pension retraite avant de créer votre entreprise. </p>
					<p>Ensuite, vous devrez prévenir votre caisse de retraite dans le mois qui suit la création de votre entreprise. Un modèle de déclaration est disponible sur le site internet <a target='_blank' href="https://www.service-public.fr/">service-public.fr</a>.</p>
					<p>Votre caisse de retraite vous renseignera sur les modalités précises du cumul envisageable. </p>
					`,
				},
			},
		},
		"dependency": map[string][]bson.M{
			"current_employment_status": {{"field": "Je suis retraité", "condition": true}},
		},
		"status": nil,
	},
	"authorizations_installation_conditions_exercise_professional_activity": map[string]interface{}{
		"label": "Règlementation de votre activité",
		"recommendation": map[string]interface{}{
			"response": map[string]string{
				"Oui": `
					<p>Super ! vous remplissez donc toutes les conditions qui vont vous permettre d'exercer votre activité en toute légalité. </p>
					`,
				"Non": `
					<p>Avant de vous lancer dans vos démarches de création d'entreprise et de démarrer votre activité, vous devez impérativement satisfaire à toutes les conditions d'exercice de votre activité. En cas de besoin, nous vous invitons à vous reprocher des organisations de votre profession et de l'administration (Chambre de commerce et d'industrie, Chambre des métiers et de l'artisanat...)</p>
					`,
			},
		},
		"dependency": map[string]string{},
		"status":     nil,
	},
	// "match_profitability_financial_needs": map[string]interface{}{
	// 	"label": "Équilibre revenus resultats",
	// 	"recommendation": map[string]interface{}{
	// 		"response": map[string]string{},
	// 	},
	// 	"dependency": map[string]string{},
	// 	"status":     nil,
	// },
	"choice_legal_status": map[string]interface{}{
		"label": "Statut juridique de votre entreprise",
		"recommendation": map[string]interface{}{
			"response": map[string]string{
				"Vous êtes sûr d'avoir fait le bon choix":         "Vous êtes parvenu à identifier la meilleure solution pour votre projet. Par mesure de sécurité, nous vous conseillons tout de même de faire valider vos choix de création d'entreprise par le professionnel qui vous accompagne.",
				"Vous avez besoin de faire confirmer votre choix": "Nous vous recommandons de faire valider vos choix de création d'entreprise par un professionnel. Un expert-comptable bien sensibilisé sur les problématiques de création d'entreprise serait idéal dans votre situation. Compte tenu des nombreux paramètres dont il faut tenir compte, l'analyse d'un expert vous permettra de vous conforter dans vos choix, ou, le cas échéant, d'effectuer les modifications nécessaires. ",
			},
		},
		"dependency": map[string]string{},
		"status":     nil,
	},
	"social_security_system_contributions": map[string]interface{}{
		"label": "Regime fiscal et protection sociale",
		"recommendation": map[string]interface{}{
			"response": map[string]string{
				"IR": `
				<p>Vous serez obligatoirement affilié à la sécurité sociale des indépendants dès le début de votre activité. Compte tenu de votre régime d'imposition des bénéfices (IR), vos cotisations sociales seront calculées sur votre bénéfice professionnel. Attention, vous n'aurez que peu de marge de manoeuvre pour piloter le revenu déclaré pour le calcul de vos cotisations. Plus vos bénéfices seront élevés, plus vos cotisations sociales seront importantes.</p> 
				<p>Lorsque vous serez en activité, si vous constatez que vos bénéfices commencent à devenir importants, il sera important d'échanger avec votre expert-comptable à propos de votre régime d'imposition des bénéfices.</p>
				`,
				"IS": `
				<p>Vous serez obligatoirement affilié à la sécurité sociale des indépendants dès le début de votre activité. Compte tenu de votre régime d'imposition des bénéfices (IS), la base de calcul de vos cotisations sociales correspondra au montant de vos rémunérations. Attention, si vous comptez vous distribuer des dividendes, vous ne devez pas oublier que vous allez devoir payer des cotisations sociales sur le montant des dividendes qui excède 10% du montant de vos apports (en capital et en compte courant d'associé).</p>
				<p>Nous vous conseillons d'être prudent au niveau du paiement de vos cotisations. En effet, vous paierez des cotisations provisionnelles puis vos cotisations définitives seront régularisées l'année suivante. Par mesure de sécurité, vous pouvez anticiper la régularisation en mettant la trésorerie nécessaire de côté. Dans votre tableau de trésorerie, la régularisation est prise en compte (en année 2, de mois 7 à mois 12, et en année 3, de mois 7 à mois 12).</p>
				`,
			},
		},
		"dependency": map[string]string{},
		"status":     nil,
	},
	"social_security_system_contributions_directors": map[string]interface{}{
		"label": "Remuneration et protection sociale",
		"recommendation": map[string]interface{}{
			"response": map[string]string{
				"Pas de salaires pour le dirigeant en année 1, année 2 et année 3 ": `
				<p>Nous avons remarqué que vous n'avez pas prévu de vous verser de rémunération dans le cadre de vos fonctions de dirigeant sur vos trois premières années d'activité. Sur cette période, vous ne serez pas affilié au régime général de la sécurité sociale dans le cadre de votre nouvelle activité.</p>
				`,
				"Pas de salaires pour le dirigeant en année 1, année 2 et année 3 + Le maintien des allocations d'aide au retour à l'emploi : ": `
				<p>Nous avons remarqué que vous n'avez pas prévu de vous verser de rémunération dans le cadre de vos fonctions de dirigeant sur vos trois premières années d'activité. Sur cette période, vous ne serez pas affilié au régime général de la sécurité sociale dans le cadre de votre nouvelle activité. Par contre, étant donné que vous allez bénéficier du maintien de vos allocations d'aide au retour à l'emploi, vous disposerez, à ce titre, de la couverture sociale du régime général. À l'issue de votre période d'indemnisation, vous pourrez profiter d'un maintien gratuit de vos droits aux prestations en espèces pendant un an. </p>
				`,
				"Pas de salaires pour le dirigeant en année 1 et année 2 :": `
				<p>Nous avons remarqué que vous n'avez pas prévu de vous verser de rémunération dans le cadre de vos fonctions de dirigeant sur vos deux premières années d'activité. Sur cette période, vous ne serez donc pas affilié au régime général de la sécurité sociale dans le cadre de votre nouvelle activité.</p>
				<p>Vous devez donc vous assurer de bénéficier d'une couverture sociale au titre d'une autre activité. 
				Dès que vous allez commencer à vous verser des rémunérations dans le cadre de vos fonctions de dirigeant, vous serez affilié au régime général de la sécurité sociale. Pour chaque versement de rémunération, un bulletin de paie devra être établi. Les cotisations sociales seront déclarées et de payées aux organismes sociaux, mensuellement ou trimestriellement, en effectuant déclaration sociale nominative.</p>
				`,
				"Pas de salaires pour le dirigeant en année 1 et année 2 + Le maintien des allocations d'aide au retour à l'emploi : ": `
				<p>Nous avons remarqué que vous n'avez pas prévu de vous verser de rémunération dans le cadre de vos fonctions de dirigeant sur vos deux premières années d'activité. 
				Sur cette période, vous ne serez donc pas affilié au régime général de la sécurité sociale dans le cadre de votre nouvelle activité.</p>
				<p>Par contre, étant donné que vous allez bénéficier du maintien de vos allocations d'aide au retour à l'emploi, vous disposerez, à ce titre, de la couverture sociale du régime général.</p>
				`,
				"Pas de salaires pour le dirigeant en année 1 :": `
				<p>Nous avons remarqué que vous n'avez pas prévu de vous verser de rémunération dans le cadre de vos fonctions de dirigeant sur votre première année d'activité. Sur cette période, vous ne serez donc pas affilié au régime général de la sécurité sociale dans le cadre de votre nouvelle activité. Vous devez donc vous assurer de bénéficier d'une couverture sociale au titre d'une autre activité. </p>
				<p>Dès que vous allez commencer à vous verser des rémunérations dans le cadre de vos fonctions de dirigeant, vous serez affilié au régime général de la sécurité sociale. Pour chaque versement de rémunération, un bulletin de paie devra être établi. Les cotisations sociales seront déclarées et de payées aux organismes sociaux, mensuellement ou trimestriellement, en effectuant déclaration sociale nominative. </p>
				`,
				"Pas de salaires pour le dirigeant en année 1 + Le maintien des allocations d'aide au retour à l'emploi : ": `
				<p>Nous avons remarqué que vous n'avez pas prévu de vous verser de rémunération dans le cadre de vos fonctions de dirigeant sur votre première année d'activité. </p><p>
				<p>Sur cette période, vous ne serez donc pas affilié au régime général de la sécurité sociale dans le cadre de votre nouvelle activité. </p><p>
				<p>Vous devez donc vous assurer de bénéficier d'une couverture sociale au titre d'une autre activité. Par contre, étant donné que vous allez bénéficier du maintien de vos allocations d'aide au retour à l'emploi, vous disposerez, à ce titre, de la couverture sociale du régime général.</p><p>
				`,
				"Salaires pour le dirigeant :": `
				<p>Nous avons remarqué que vous avez prévu de vous verser une rémunération dans le cadre de vos fonctions de dirigeant. Vous serez donc affilié au régime général de la sécurité sociale.</p>
				<p>Pour chaque versement de rémunération, un bulletin de paie devra être établi. </p>
				<p>Les cotisations sociales seront déclarées et de payées aux organismes sociaux, mensuellement ou trimestriellement, en effectuant déclaration sociale nominative.</p>
				`,
			},
		},
		"dependency": map[string]string{},
		"status":     nil,
	},
	"initial_financing_plan": map[string]interface{}{
		"label": "Votre plan de financement initial",
		"recommendation": map[string]interface{}{
			"response": map[string]interface{}{
				"Le maintien des allocations d'aide au retour à l'emploi": map[string]map[string]string{
					"IR": {
						"independant": "Attention, étant donné que vous serez affilié à la sécurité sociale des indépendants et que vous avez choisi l'IR au niveau de l'imposition des bénéfices de votre entreprise, vous ne pourrez pas obtenir le maintien intégral de vos allocations. Une régularisation de vos allocations sera également opérée lorsque vos revenus définitifs seront déclarés à l'administration. Le maintien intégral des allocations est uniquement possible à la double condition suivante : vous créez une entreprise à l'impôt sur les sociétés (IS) et vous ne vous versez pas de rémunération.",
						"employee":    "En principe, vous pourrez conserver le versement de vos allocations après avoir créé votre entreprise. Étant donné que vous n'êtes pas affilié à la sécurité sociale des indépendants, votre revenu servant de base de calcul de vos cotisations sociales ne correspond pas à votre bénéfice professionnel. Pour obtenir le maintien de vos allocations, vous devez signaler votre création d'entreprise auprès de votre agence Pôle emploi. En fournissant un procès-verbal de non-rémunération de vos fonctions de dirigeant, vous pourrez obtenir le maintien intégral du versement de vos allocations.",
					},
					"IS": {
						"Pas de salaires dirigeant les 24 premiers mois": "Vous pourrez conserver le versement de vos allocations après avoir créé votre entreprise. Pour cela, vous devez signaler votre création d'entreprise auprès de votre agence Pôle emploi. En fournissant un procès-verbal de non-rémunération de vos fonctions de dirigeant, vous pourrez obtenir le maintien intégral du versement de vos allocations. ",
						"Salaires dirigeant les 24 premiers mois":        "Vous pourrez conserver le versement de vos allocations après avoir créé votre entreprise. Pour cela, vous devez signaler votre création d'entreprise auprès de votre agence Pôle emploi. Étant donné que vous comptez vous octroyer une rémunération, le maintien du versement de vos allocations sera partiel, voire suspendu, en fonction du montant de votre rémunération.",
					},
				},
				"Le versement en capital d'une partie de mes droits (ARCE)": map[string]string{
					"Pas de salaires dirigeant": "Nous avons remarqué, dans votre prévisionnel, que vous n'avez pas prévu de vous rémunérer. Attention, en choisissant le versement en capital, vous ne percevrez plus vos allocations mensuelles. Avant de valider ce choix, êtes-vous certain de pouvoir subvenir à vos besoins personnels avec vos économies et/ou vos autres revenus ? Enfin, pour obtenir le versement en capital, vous devez remplir un formulaire de demande d'ARCE et le transmettre à Pôle emploi, et justifier la création de votre entreprise (en fournissant un extrait K-Bis par exemple). ",
					"Salaires dirigeant prévus": "Nous avons remarqué, dans votre prévisionnel, que vous avez prévu de vous rémunérer. Vous aurez donc un revenu régulier qui compensera l'absence de versement de vos allocations mensuelles (étant donné que l'option pour l'ARCE entraîne l'arrêt de l'indemnisation mensuelle). Enfin, pour obtenir le versement en capital, vous devez remplir un formulaire de demande d'ARCE et le transmettre à Pôle emploi, et justifier la création de votre entreprise (en fournissant un extrait K-Bis par exemple).",
				},
			},
		},
		"dependency": map[string]string{},
		"status":     nil,
	},
	"financial_security_margin": map[string]interface{}{
		"label": "Votre marge de sécurité financière",
		"recommendation": map[string]interface{}{
			"response": map[string]string{},
		},
		"dependency": map[string]string{},
		"status":     nil,
	},
	"match_profitability_financial_needs_director": map[string]interface{}{
		"label": "Rentabilité de votre projet",
		"recommendation": map[string]interface{}{
			"response": map[string]string{},
		},
		"dependency": map[string]string{},
		"status":     nil,
	},
	"micro_reel_tax_regime": map[string]interface{}{
		"label": "Micro ou régime réel d'imposition ?",
		"recommendation": map[string]interface{}{
			"response": map[string]string{},
		},
		"dependency": map[string]string{},
		"status":     nil,
	},
	"compatibility_micro_regime": map[string]interface{}{
		"label": "Compatibilité avec le régime micro",
		"recommendation": map[string]interface{}{
			"response": map[string]string{},
		},
		"dependency": map[string]string{},
		"status":     nil,
	},
}

var testSuiteConditions CreatorProjectTestSuite = map[string]interface{}{
	"pole_emploi_aid_scheme_for_business_creation": map[string][]bson.M{
		"conditions": {
			{"label": "Régime fiscal"},
			{"label": "Sécurité sociale du dirigeant"},
			{"label": "Salaires du dirigeant"},
		},
	},
	"accumulation_professional_income_retirement_pension": map[string][]bson.M{
		"conditions": {
			{"label": "Votre situation professionnelle "},
		},
	},
	// "match_profitability_financial_needs": map[string][]bson.M{
	// 	"conditions": {
	// 		{"label": "Votre situation professionnelle"},
	// 		{"label": "Vous comptez quitter votre emploi salarié "},
	// 	},
	// },
	"choice_legal_status": map[string][]bson.M{
		"conditions": {
			{"label": "Le statut juridique choisi pour votre entreprise "},
		},
	},
	"social_security_system_contributions": map[string][]bson.M{
		"conditions": {
			{"label": "Régime fiscal"},
		},
	},
	"social_security_system_contributions_directors": map[string][]bson.M{
		"conditions": {
			{"label": "Salaires du dirigeant"},
		},
	},
	"initial_financing_plan": map[string][]bson.M{
		"conditions": {
			{"label": "Montant des prêts en année 1 (prêts bancaires, autres prêts, prêts d'honneur): "},
			{"label": "Montant des apports en capital en année 1:"},
			{"label": "Montant des apports en compte courant d'associé en année 1: "},
			{"label": "Type de projet (création ou reprise d'entreprise): "},
			{"label": "Trésorerie année 1:"},
			{"label": "Le pourcentage d'apports personnels: "},
		},
	},
	"financial_security_margin": map[string][]bson.M{
		"conditions": {
			{"label": "Soldes mensuels de trésorerie de votre prévisionnel"},
			{"label": "Montant total de vos décaissements mensuel moyen :"},
		},
	},
	"match_profitability_financial_needs_director": map[string][]bson.M{
		"conditions": {
			{"label": "Votre situation professionnelle "},
			{"label": "Vous comptez quitter votre emploi salarié "},
			{"label": "Le statut juridique choisi pour votre entreprise "},
			{"label": "Résultat net"},
			{"label": "Salaires du dirigeant"},
			{"label": "Régime fiscal"},
		},
	},
	"micro_reel_tax_regime": map[string][]bson.M{
		"conditions": {
			{"label": "Cotisations sociales en année 1, année 2 et année 3"},
			{"label": "Résultat net en année 1, année 2 et année 3"},
		},
	},
	"compatibility_micro_regime": map[string][]bson.M{
		"conditions": {
			{"label": "Chiffre d'affaires en année 1, année 2 et année 3: "},
			{"label": "Seuil de chiffre d'affaires du régime micro : "},
			{"label": "- 176 200 € de chiffre d'affaires pour les activités de vente de marchandises"},
			{"label": "- 72 600 € pour les prestataires de services et les activités libérales"},
		},
	},
}

var testSuiteQuestions CreatorProjectTestSuite = map[string]interface{}{
	"pole_emploi_aid_scheme_for_business_creation": map[string]interface{}{
		"questions": []bson.M{
			{
				"label": "Quel dispositif d'aide Pôle emploi pensez-vous choisir ?",
				"responses": []string{
					"Le maintien des allocations d'aide au retour à l'emploi",
					"Le versement en capital d'une partie de mes droits (ARCE)",
				},
			},
		},
	},
	"accumulation_professional_income_retirement_pension": map[string]interface{}{
		"questions": []bson.M{
			{
				"label": "Avez-vous déjà demandé la liquidation de votre pension retraite ?",
				"responses": []string{
					"Oui",
					"Non",
				},
			},
			{
				"label": "Avez-vous atteint l'âge légal pour partir en retraite (62 ans) et validé suffisammant de trimestre pour avoir la retraite à taux plein, ou atteint l'âge pour percevoir automatiquement la retraite à taux plein (entre 65 et 67 ans pour les assurés nés à partir de 1955) ?",
				"responses": []string{
					"Oui",
					"Non",
				},
			},
		},
	},
	"authorizations_installation_conditions_exercise_professional_activity": map[string]interface{}{
		"questions": []bson.M{
			{
				"label": "Remplissez-vous toutes les conditions préalables pour pouvoir exercer légalement votre activité ?",
				"responses": []string{
					"Oui",
					"Non",
				},
			},
		},
	},
	"choice_legal_status": map[string]interface{}{
		"questions": []bson.M{
			{
				"label": "Par rapport à votre statut juridique ",
				"responses": []string{
					"Vous êtes sûr d'avoir fait le bon choix",
					"Vous avez besoin de faire confirmer votre choix",
					"Vous n'arrivez pas à faire votre choix",
				},
			},
		},
	},
	"social_security_system_contributions_directors": map[string]interface{}{
		"questions": []bson.M{
			{
				"label": "Allez-vous bénéficier du maintien de vos allocations d'aide au retour à l'emploi ?",
				"responses": []string{
					"Oui",
					"Non",
				},
			},
		},
	},
	"initial_financing_plan": map[string]interface{}{
		"questions": []bson.M{
			{
				"label": "Avez-vous déjà avancé au niveau de votre financement ?",
				"responses": []string{
					"Je n'ai pas encore commencé mes démarches",
					"Mon dossier est en cours d'étude auprès d'une ou de plusieurs banques",
					"J'ai obtenu mon accord de financement",
				},
			},
		},
	},
	"financial_security_margin": map[string]interface{}{
		"questions": []bson.M{
			{
				"label": "De quelle marge de sécurité financière avez-vous besoin pour votre projet ? ",
				"responses": []int64{
					0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
				},
			},
		},
	},
	"match_profitability_financial_needs_director": map[string]interface{}{
		"questions": []bson.M{
			{
				"label":     "Quel est le montant du revenu annuel minimum dont vous avez besoin pour être dans une situation financière personnelle confortable ?",
				"responses": []string{},
			},
			{
				"label":     "Quel est le montant annuel de vos autres revenus (en dehors de votre nouveau projet) ?",
				"responses": []string{},
			},
		},
	},
	"micro_reel_tax_regime": map[string]interface{}{
		"questions": []bson.M{
			{
				"label": "Votre activité est imposée dans la catégorie :",
				"responses": []string{
					"des BIC",
					"des BNC",
				},
			},
		},
	},
}

var testSuiteSupport CreatorProjectTestSuite = map[string]interface{}{
	"pole_emploi_aid_scheme_for_business_creation": map[string]map[string]string{
		"text": {
			"node": `
      <p>Aide pour répondre à la question : </p>
      <p>Le maintien vous permet de continuer à percevoir vos allocations après avoir créé votre entreprise. En fonction de vos nouveaux revenus professionnels, le versement sera intégral, partiel ou nul. Un maintien intégral est envisageable à condition de pouvoir justifier l'absence de rémunération de vos fonctions de dirigeant. Le versement en capital (ARCE) permet d'obtenir un capital pour financer votre création d'entreprise. Le versement, réalisé en deux fois, s'élève à 45% de votre solde de droits à l'indemnisation chômage. L'option pour l'ARCE met fin au versement de vos allocations mensuelles.</p>
      <p>Pour comparer les deux dispositifs, nous vous invitons à consulter ce dossier : <a target="_blank" href="https://www.lecoindesentrepreneurs.fr/aides-pole-emploi-creation-dentreprise-choix/">Aides Pôle emploi à la création d'entreprise : comment faire le bon choix</a> ?</p>
      `,
		},
	},
	"authorizations_installation_conditions_exercise_professional_activity": map[string]map[string]string{
		"text": {
			"node": `
      <p>Votre activité fait l'objet d'une <strong>réglementation spécifique</strong> pour pouvoir être exercée en toute légalité. Des conditions de qualifications et/ou des conditions d'installation sont prévues dans ce secteur. Afin pouvoir créer votre entreprise et lancer votre activité, vous devez, au préalable, valider toutes ces conditions.</p>
      <p>Pour vous informer sur la réglementation de votre métier et identifier les organismes ainsi que les organismes auprès desquels vous pouvez obtenir d'avantage de renseignements, vous pouvez consulter la page d'information relative à votre secteur d'activité : <a target='_blank' href="/projet/secteur-activite"> Mon activité </a> .</p>
      <p>Si nécessaire, nous vous conseillons également de vous informer auprès des organisations professionnelles de votre métier et de l'administration (Chambre de commerce et d'industrie, Chambre des métiers et de l'artisanat...). Des liens vers ces organisations vont sont proposés dans votre page "Secteur d'activité</p>
      `,
		},
	},
	"choice_legal_status": map[string]map[string]string{
		"text": {
			"Entreprise individuelle": `
      <strong>Voici une synthèse rapide sur le statut juridique que vous avez choisi :</strong>
      <br><br/>
      <p>L'entreprise individuelle consiste à exercer son activité professionnelle en <strong>nom propre</strong>. Ce choix vous permet de créer puis de gérer votre entreprise très simplement, et d'avoir accès au régime <strong>micro-entreprise</strong>. En contrepartie, vous devez tenir compte du niveau de risque associé à ce statut juridique : votre responsabilité est <strong>totale et infinie</strong> au niveau de vos dettes professionnelles. Vous supporterez <strong>personnellement l'imposition de vos bénéfices</strong> à l'impôt sur le revenu. Concernant votre protection sociale, vous serez affilié à la <strong>sécurité sociale des indépendants</strong>.</p>`,
			"EIRL": `
      <strong>Voici une synthèse rapide sur le statut juridique que vous avez choisi :</strong>
      <br><br/>
      <p>L'EIRL est une possibilité offerte aux entrepreneurs individuels pour leur permettre de bénéficier de deux avantages par rapport à l'entreprise individuelle classique. Le premier avantage correspond à la <strong>limitation de votre responsabilité</strong>, vis-à-vis de vos créanciers professionnels, au patrimoine que vous affecterez à votre entreprise. Le second avantage est d'avoir la possibilité d'<strong>opter pour l'imposition de vos bénéfices à l'impôt sur les sociétés (IS)</strong>. Pour le reste, l'EIRL fonctionne comme une entreprise individuelle. Ce choix vous permet de créer puis de gérer votre entreprise très simplement, et d'avoir accès au régime micro-entreprise (à condition de ne pas avoir opté pour l'IS). Concernant votre protection sociale, vous serez affilié à la sécurité sociale des indépendants.</p>`,
			"EURL": `
      <strong>Voici une synthèse rapide sur le statut juridique que vous avez choisi :</strong>
      <br><br/>
      <p>L'EURL est une SARL qui ne compte qu'un seul associé, il s'agit d'une forme de <strong>société</strong> commerciale. Ce choix vous permet donc de créer une société sans avoir d'associé, et de protéger votre patrimoine personnel puisque votre responsabilité vis-à-vis des dettes professionnelles sera limitée au montant de vos apports. Vous aurez plusieurs démarches de création à effectuer (rédiger vos statuts, déposer votre capital, nommer le dirigeant, publier un avis de constitution...) et vous devrez respecter un formalisme juridique pour faire fonctionner votre entreprise (approbation des comptes, procès-verbal de décision pour modifier vos statuts...). Par rapport à l'imposition des bénéfices, une EURL relève en principe du <strong>régime des sociétés de personnes</strong> (imposition directe des bénéfices au nom de l'associé unique). Sur option, vous pourrez toutefois choisir l'imposition des bénéfices à <strong>l'impôt sur les sociétés (IS)</strong>. Si vous souhaitez opter pour l'IS, vous devez impérativement notifier l'option auprès de l'administration fiscale lors de la création de votre entreprise. Concernant votre protection sociale, vous serez affilié à la <strong>sécurité sociale des indépendants</strong>.</p>`,
			"SASU": `
      <strong>Voici une synthèse rapide sur le statut juridique que vous avez choisi :</strong>
      <br><br/>
      <p>La SASU est une SAS qui ne compte qu'un seul associé, il s'agit d'une forme de <strong>société</strong> commerciale. Ce choix vous permet donc de créer une société sans avoir d'associé, et de protéger votre patrimoine personnel puisque votre responsabilité vis-à-vis des dettes professionnelles sera limitée au montant de vos apports. Vous aurez plusieurs démarches de création à effectuer (rédiger vos statuts, déposer votre capital, nommer le dirigeant, publier un avis de constitution...) et vous devrez respecter un formalisme juridique pour faire fonctionner votre entreprise (approbation des comptes, procès-verbal de décision pour modifier vos statuts...). Par rapport à l'imposition des bénéfices réalisés en SASU, ceux-ci sont en principe imposés à <strong>l'impôt sur les sociétés (IS)</strong>. Toutefois, vous avez la possibilité d'opter pour le <strong>régime des sociétés de personnes</strong> (imposition directe des bénéfices au nom de l'associé unique) pendant 5 exercices maximum. Concernant votre protection sociale, vous serez affilié au <strong>régime général de la sécurité sociale</strong> dès que vous vous verserez une rémunération.</p>`,
			"SARL": `
      <strong>Voici une synthèse rapide sur le statut juridique que vous avez choisi :</strong>
      <br><br/>
      <p>La SARL est une forme de <strong>société</strong> commerciale qui comporte au moins 2 associés. Ce choix vous permet donc de créer une société avec des associés, et de protéger votre patrimoine personnel puisque votre responsabilité vis-à-vis des dettes professionnelles sera limitée au montant de vos apports. Vous aurez <strong>plusieurs démarches de création</strong> à effectuer (rédiger vos statuts, déposer votre capital, nommer les dirigeants, publier un avis de constitution...) et vous devrez respecter un <strong>formalisme juridique</strong> pour faire fonctionner votre entreprise (approbation des comptes, décisions en assemblée générale...). Par rapport à l'imposition des bénéfices réalisés en SARL, ceux-ci sont en principe imposés à <strong>l'impôt sur les sociétés (IS)</strong>. Toutefois, vous avez la possibilité d'opter pour le régime des sociétés de personnes (imposition directe des bénéfices au nom de l'associé unique) pendant 5 exercices maximum, et sans limitation de durée pour les SARL familiales. Concernant la protection sociale des gérants, cela dépend de leur pourcentage de participation : sécurité sociale des indépendants pour les gérants majoritaires et régime général de la sécurité sociale pour les gérants non majoritaires. </p>`,
			"SAS": `
      <strong>Voici une synthèse rapide sur le statut juridique que vous avez choisi :</strong>
      <br><br/>
      <p>La SAS est une forme de société commerciale qui comporte au moins 2 associés. Ce choix vous permet donc de créer une société avec des associés, et de protéger votre patrimoine personnel puisque votre responsabilité vis-à-vis des dettes professionnelles sera limitée au montant de vos apports. Vous aurez <strong>plusieurs démarches de création</strong> à effectuer (rédiger vos statuts, déposer votre capital, nommer les dirigeants, publier un avis de constitution...) et vous devrez respecter un <strong>formalisme juridique</strong> pour faire fonctionner votre entreprise (approbation des comptes, décisions en assemblée générale...). Par rapport à l'imposition des bénéfices réalisés en SAS, ceux-ci sont en principe imposés à <strong>l'impôt sur les sociétés (IS)</strong>. Toutefois, vous avez la possibilité d'opter pour le régime des sociétés de personnes (imposition directe des bénéfices au nom de l'associé unique) pendant 5 exercices maximum. Concernant la protection sociale, tous les dirigeants de SAS sont affiliés au <strong>régime général de la sécurité sociale</strong> dès qu'ils sont rémunérés. </p>`,
		},
	}, "financial_security_margin": map[string]map[string]string{
		"text": {
			"node": `<p>La marge de sécurité financière correspond à un nombre de mois durant lesquels vous n'enregistrez aucune rentrée d'argent tout en ayant une trésorerie qui reste positive malgré tout. Elle vous permet d'avoir la capacité d'anticiper des évènements imprévus et donc d'éviter de vous retrouver en difficulté financière.</p>
      `,
		},
	},
}

func CreateCreatorTestSuite(id string) error {

	db := config.Datastore.ReadDatabase.Database(DB)
	filter := bson.M{"aggregate_id": id}
	update := bson.M{
		"$set": bson.M{"aggregate_id": id},
		"$addToSet": bson.M{"test_suite": bson.M{"test_suite_id": primitive.NewObjectID(),
			"tests":      testSuite,
			"status":     nil,
			"updated_at": nil}},
	}
	opts := options.Update().SetUpsert(true)
	_, err := db.Collection(dbCollectionCreatorProjectTestSuite).UpdateOne(context.Background(), filter, update, opts)
	if err != nil {
		return err
	}

	return nil
}

func CreateCreatorTestSuiteConditions(id string) error {

	db := config.Datastore.ReadDatabase.Database(DB)
	filter := bson.M{"aggregate_id": id}
	update := bson.M{
		"$set": bson.M{"aggregate_id": id},
		"$addToSet": bson.M{"test_suite_conditions": bson.M{"test_suite_conditions_id": primitive.NewObjectID(),
			"tests":      testSuiteConditions,
			"status":     nil,
			"updated_at": nil}},
	}
	opts := options.Update().SetUpsert(true)
	_, err := db.Collection(dbCollectionCreatorProjectTestSuiteConditions).UpdateOne(context.Background(), filter, update, opts)
	if err != nil {
		return err
	}

	return nil
}

func CreateCreatorTestSuiteFollowUp(id string) error {

	db := config.Datastore.ReadDatabase.Database(DB)
	filter := bson.M{"aggregate_id": id}
	update := bson.M{
		"$set": bson.M{"aggregate_id": id},
		"$addToSet": bson.M{"test_suite_follow_up": bson.M{"test_suite_follow_up_id": primitive.NewObjectID(),
			"tests":      testSuiteQuestions,
			"status":     nil,
			"updated_at": nil}},
	}
	opts := options.Update().SetUpsert(true)
	_, err := db.Collection(dbCollectionCreatorProjectTestSuiteFollowUp).UpdateOne(context.Background(), filter, update, opts)
	if err != nil {
		return err
	}

	return nil
}

func CreateCreatorTestSuiteSupport(id string) error {

	db := config.Datastore.ReadDatabase.Database(DB)
	filter := bson.M{"aggregate_id": id}
	update := bson.M{
		"$set": bson.M{"aggregate_id": id},
		"$addToSet": bson.M{"test_suite_follow_up": bson.M{"test_suite_follow_up_id": primitive.NewObjectID(),
			"tests":      testSuiteSupport,
			"status":     nil,
			"updated_at": nil}},
	}
	opts := options.Update().SetUpsert(true)
	_, err := db.Collection(dbCollectionCreatorProjectTestSuiteSupport).UpdateOne(context.Background(), filter, update, opts)
	if err != nil {
		return err
	}

	return nil
}

func BuildTestSuites(id string) error {
	db := config.Datastore.ReadDatabase.Database(DB)
	session, err := db.Client().StartSession()
	if err != nil {
		return err
	}

	if session, err = db.Client().StartSession(); err != nil {
		return err
	}
	if err = session.StartTransaction(); err != nil {
		return err
	}
	if err = mongo.WithSession(context.Background(), session, func(sc mongo.SessionContext) error {
		if err := CreateCreatorTestSuite(id); err != nil {
			return err
		}

		if err := CreateCreatorTestSuiteConditions(id); err != nil {
			return err
		}

		if err := CreateCreatorTestSuiteFollowUp(id); err != nil {
			return err
		}

		if err := CreateCreatorTestSuiteSupport(id); err != nil {
			return err
		}

		if err = session.CommitTransaction(sc); err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}
	session.EndSession(context.Background())

	if err != nil {
		return err
	}
	return nil
}
