const InformationTemplate = {
  "Complétez vos choix de création d'entreprise": {
    'Choisissez votre statut juridique': {
      guide: {
        primary: {
          meta_title: "Le statut juridique de l'entreprise en quelques mots",
          meta_content: [
            {
              meta_type: 'p',
              meta_blob:
                "Pour créer votre entreprise, vous devez choisir une forme juridique. De nombreuses solutions sont possibles : l'entreprise individuelle, l'EURL, la SASU, la SARL, la SAS... Tout d'abord, le nombre de participants au projet réduira les options qui s'offrent à vous. Voici les principales options :"
            },
            {
              meta_type: 'list',
              meta_blob: [
                'Si vous envisagez de vous lancer seul, vous avez la possibilité de créer une entreprise individuelle, une EIRL, une EURL ou une SASU ;',
                "Si vous envisagez de vous associer avec d'autres personnes, les principales options sont la SARL et la SAS. D'autres structures existent également : sociétés civiles, SA, SNC..."
              ]
            },
            {
              meta_type: 'p',
              meta_blob:
                "Ensuite, de nombreux autres paramètres doivent être pris en compte dans le cadre de ce choix : mode d'imposition des bénéfices, régime de sécurité sociale du dirigeant, responsabilité des associés, organisation et flexibilité juridique de l'entreprise..."
            }
          ]
        },
        secondary: [
          {
            meta_title: 'Utiliser notre comparateur de statut juridique',
            meta_content: [
              {
                meta_type: 'p',
                meta_blob:
                  "Notre comparateur vous permet d'obtenir un avis sur le statut juridique qui parait le plus approprié pour votre projet, en fonction des critères de choix que vous sélectionnez. Les statuts juridiques pris en compte dans l'outil sont :"
              },
              {
                meta_type: 'list',
                meta_blob: [
                  "pour les projets à un seul participant : l'entreprise individuelle, l'EIRL, l'EURL et la SASU ;",
                  'pour les projets à plusieurs participants : la SARL et la SAS.'
                ]
              },
              {
                meta_type: 'p',
                meta_blob:
                  "La micro-entreprise n'est pas un statut juridique à proprement parler, mais un régime fiscal. Elle est intégrée dans le comparateur en étant rattachée aux entreprises individuelles et aux EIRL."
              },
              {
                meta_type: 'p',
                meta_blob:
                  'Pour commencer, vous devez sélectionner chaque critère qui compte pour vous dans le choix du statut juridique de votre entreprise. Pour chaque critère, vous obtiendrez :'
              },
              {
                meta_type: 'list',
                meta_blob: [
                  "une aide qui vous explique l'importance du critère et son impact pour vous et votre entreprise,",
                  'des explications sur les règles applicables pour chaque statut juridique présent dans le comparateur,',
                  'une notation qui met en valeur le statut juridique le plus approprié par rapport à chaque critère sélectionné.'
                ]
              },
              {
                meta_type: 'p',
                meta_blob:
                  "Une fois que vous avez terminé de sélectionner vos critères, un avis sur le choix du statut juridique de votre entreprise est proposé. Bien entendu, il s'agit d'une suggestion. Nous vous conseillons ensuite de valider le choix de votre statut juridique avec l'un de nos conseillers de l'application. "
              }
            ]
          }
        ]
      },
      guidance_text: {
        major: `Vous devez indiquer quel sera le statut juridique de votre future entreprise. En cas de besoin, notre comparateur vous aide à déterminer quel est le statut juridique le plus adapté pour votre projet en fonction de vos critères.`
      },
      nav_label: ['Statut juridique', 'Guide', 'Ressources et FAQ', 'Comparateur'],
      faq: [
        {
          question: "Est-ce que l'on peut choisir n'importe quel statut juridique pour son entreprise ?",
          response:
            "Non, les solutions à votre disposition dépendront du nombre de participants dans le projet. L'entreprise individuelle, l'EIRL, l'EURL et la SASU sont adaptées pour les entrepreneurs qui se lancent seuls. En présence de plusieurs participants, il faut s'orienter vers la création d'une SARL, d'une SAS ou d'un autre type de société.",
          link: 'https://www.lecoindesentrepreneurs.fr/choix-du-statut-juridique-de-l-entreprise/'
        },
        {
          question: 'Quelle est la démarche à suivre pour choisir son statut juridique ?',
          response:
            "Tout d'abord, renseignez-vous sur les différents statuts qui existent. La précipitation est mauvaise conseillère, n'attendez donc pas la dernière minute pour faire un choix. Ensuite, prenez en considération tous les aspects de votre projet. Ne tentez pas compte des « on-dit » et des « bruits de couloirs ».",
          link: 'https://www.lecoindesentrepreneurs.fr/conseils-pour-trouver-forme-juridique-entreprise/'
        },
        {
          question: 'Quels sont les statuts juridiques disponibles pour une personne qui se lance en solo ?',
          response:
            "Si vous vous lancez dans une aventure entrepreneuriale en solo, vous avez le choix parmi les statuts suivants : l'entreprise individuelle (EI avec option ou non pour le régime micro), l'entreprise individuelle à responsabilité limitée (EIRL), l'entreprise unipersonnelle à responsabilité limitée (EURL) ou la société par actions simplifiée unipersonnelle (SASU).",
          link: 'https://www.lecoindesentrepreneurs.fr/tableau-comparatif-des-structures-unipersonnelles/'
        },
        {
          question: "Quels statut juridique peut-on choisir lorsqu'on crée une entreprise à plusieurs associés ?",
          response:
            "Un projet peut réunir plusieurs participants au sein d'une société par actions simplifiée (SAS), d'une société anonyme (SA), d'une société à responsabilité limitée (SARL), d'une société en nom collectif (SNC) et, dans certains cas, d'une société civile (SCI, SCP, SCM...).",
          link: 'https://www.lecoindesentrepreneurs.fr/tableau-comparatif-societes-pluripersonnelles/'
        },
        {
          question: "Quelles sont les conséquences du choix d'un statut juridique ?",
          response:
            "Le choix effectué a de multiples conséquences pour vous et pour votre entreprise : responsabilité, fiscalité des bénéfices, sécurité sociale du dirigeant, fonctionnement juridique et administratif, taxation des cessions... C'est un choix très important."
        },
        {
          question: 'La micro-entreprise est-elle un statut juridique ?',
          response:
            "Non, la micro-entreprise est un régime fiscal ouvert aux entrepreneurs individuels, aux EIRL et aux EURL ayant un gérant associé unique personne physique. Des seuils de chiffre d'affaires doivent également être respectés.",
          link: 'https://www.lecoindesentrepreneurs.fr/regime-micro-entreprise-avantages-et-inconvenients/'
        },
        {
          question: 'Le statut juridique choisi lors de la création est-il définitif ?',
          response:
            "Non, à tout moment, vous avez la possibilité d'évoluer vers un autre statut juridique si vous en éprouvez le besoin. L'opération peut consister en un passage en société, ou en une transformation de société."
        },
        {
          question: 'Quels sont les statuts juridiques les moins risqués ?',
          response:
            'Pour limiter votre responsabilité vis-à-vis des créanciers sociaux, vous devez créer une société à responsabilité limitée (de type EURL / SARL ou SASU / SAS) ou une EIRL.',
          link: 'https://www.lecoindesentrepreneurs.fr/statut-juridique-sans-risque/'
        }
      ]
    },
    'Choisissez votre régime fiscal': {
      guide: {
        primary: {
          meta_title: 'Le choix des régimes fiscaux en quelques mots',
          meta_content: [
            {
              meta_type: 'p',
              meta_blob:
                "Lors de la création d'une entreprise, il est nécessaire de choisir ses options fiscales. Parmi les options, nous retrouvons les modalités d'imposition des bénéfices de l'entreprise et le régime de TVA. Le créateur d'entreprise doit reporter ses choix dans la déclaration de création d'entreprise. Les possibilités en matière d'imposition des bénéfices sont directement liées au statut juridique de l'entreprise."
            },
            {
              meta_type: 'p',
              meta_blob: "Concernant l'imposition des bénéfices, les régimes possibles sont :"
            },
            {
              meta_type: 'list',
              meta_blob: [
                'Le régime fiscal de la micro-entreprise ;',
                "Le régime réel de l'impôt sur le revenu (IR), ou régime fiscal des sociétés de personnes (pour les sociétés) ;",
                "Le régime de l'impôt sur les sociétés (IS)"
              ]
            },
            {
              meta_type: 'p',
              meta_blob: 'Concernant la TVA, les régimes possibles sont :'
            },
            {
              meta_type: 'list',
              meta_blob: [
                "La franchise en base de TVA, accessible jusqu'à 82 800 € de chiffre d'affaires pour les activités de vente et 33 200 € pour les activités de service (en 2021) ;",
                "Le régime simplifié d'imposition à la TVA, accessible jusqu'à 789 000 € de chiffre d'affaires pour les activités de vente et 238 000 € pour les activités de service (en 2021) ;",
                "Le régime réel normal d'imposition à la TVA, sans limite de chiffre d'affaires."
              ]
            }
          ]
        },
        secondary: [
          {
            meta_title: "Choisir le régime d'imposition des bénéfices de l'entreprise",
            meta_content: [
              {
                meta_type: 'p',
                meta_blob:
                  "Les choix disponibles au niveau de l'imposition des bénéfices dépendent du statut juridique de l'entreprise. Voici ce qu'il faut retenir :"
              },
              {
                meta_type: 'list',
                meta_blob: [
                  "En entreprise individuelle, vous pouvez choisir le régime micro-entreprise ou le régime réel de l'IR",
                  "En EIRL, vous pouvez choisir le régime micro-entreprise, le régime réel à l'IR ou le régime de l'IS (sur option) ;",
                  "En EURL, vous pouvez choisir le régime réel à l'IR ou le régime de l'IS (sur option) ;",
                  "En SASU et en SAS, vous pouvez choisir le régime de l'IS ou le régime réel à l'IR (sur option, pendant 5 exercices maximum) ;",
                  "En SARL, vous pouvez choisir le régime de l'IS ou le régime réel à l'IR (sur option, pendant 5 exercices maximum, ou sans limitation de durée pour les SARL familiales)."
                ]
              },
              {
                meta_type: 'p',
                meta_blob:
                  "Votre prévisionnel financier vous sera utile pour choisir le bon régime d'imposition des bénéfices. Pour les entrepreneurs à la sécurité sociale des indépendants, il faut également tenir compte de l'impact du choix sur la base de calcul des cotisations sociales (sur les bénéfices à l'IR, sur les rémunérations et une partie des dividendes à l'IS)"
              }
            ]
          },
          {
            meta_title: "Choisir le régime de TVA de l'entreprise",
            meta_content: [
              {
                meta_type: 'p',
                meta_blob:
                  "Comme nous l'avons évoqué précédemment, les trois régimes de TVA existants sont accessibles à toutes les entreprises, peu importe leur statut juridique. Par contre, des seuils de chiffre d'affaires sont prévus pour la franchise en base et le régime simplifié d'imposition. Ensuite, voici plusieurs informations à prendre en compte pour faire votre choix."
              },
              {
                meta_type: 'p',
                meta_blob:
                  "Avec la franchise en base de TVA, vous n'êtes pas assujetti à la taxe. Vous facturez vos clients hors taxes (intéressant pour les clients particuliers) et vous ne récupérez pas la TVA sur vos dépenses et investissements (même si vous la payez auprès de vos fournisseurs)."
              },
              {
                meta_type: 'p',
                meta_blob:
                  "Avec le régime simplifié d'imposition, votre entreprise est assujettie à la taxe. La TVA est déclarée annuellement et deux acomptes doivent être payés en cours d'année. Les clients sont facturés TTC et vous récupérez la TVA sur vos dépenses et vos investissements. Si vous avez un crédit de TVA, le remboursement peut être annuel (150 € minimum) ou semestriel (760 € minimum)."
              },
              {
                meta_type: 'p',
                meta_blob:
                  'Avec le régime réel normal, votre entreprise est assujettie à la taxe. La TVA est déclarée et payée mensuellement. Les clients sont facturés TTC et vous récupérez la TVA sur vos dépenses et vos investissements. Si vous avez un crédit de TVA, un remboursement mensuel, ou trimestriel (mini-réel) est possible (760 € minimum).'
              }
            ]
          }
        ]
      },
      guidance_text: {
        major: `Vous devez indiquer le régime d'imposition des bénéfices de votre future entreprise. Vos options dépendent de votre statut juridique. Vous devez également indiquer le régime de TVA de votre future entreprise.`
      },
      nav_label: ['Régimes fiscaux', 'Guide', 'Ressources et FAQ', 'Comparateur'],
      faq: [
        {
          question: "Quels sont les différents modes d'imposition des bénéfices en France ?",
          response:
            "En France, il existe deux modes d'imposition des bénéfices : l'impôt sur les sociétés (IS) et l'impôt sur le revenu (IR). Le statut juridique choisi peut déterminer l'impôt applicable. Parfois, un mécanisme d'option pour l'autre régime existe. Il est définitif ou temporaire.",
          link: 'https://www.lecoindesentrepreneurs.fr/imposition-des-benefices-de-lentreprise/'
        },
        {
          question: "Quels sont les avantages de l'impôt sur les sociétés (IS) ?",
          response:
            "L'IS permet de maîtriser l'imposition des résultats de l'entreprise (taux réduit, déduction des rémunérations). Lorsque le dirigeant est associé, l'IS permet de mieux piloter ses revenus d'activité en effectuant des arbitrages entre la rémunération et les dividendes.",
          link: 'https://www.lecoindesentrepreneurs.fr/impot-sur-les-societes-avantages-inconvenients/'
        },
        {
          question: "Quels sont les points forts de l'impôt sur le revenu (IR) ?",
          response:
            "L'IR permet à l'entrepreneur ou à l'associé ayant peu de revenus d'être faiblement imposé. En présence de déficits, ces dernières peuvent être imputés sur les autres revenus du foyer fiscal. Enfin, en cas d'implantation dans certaines zones (ZFU par exemple), l'imposition globale peut être nulle, contrairement à l'IS.",
          link: 'https://www.lecoindesentrepreneurs.fr/avantages-inconvenients-ir-impot-revenu/'
        },
        {
          question: "Quels sont les critères à étudier avant de faire un choix entre l'IR et l'IS ?",
          response:
            "Tous les paramètres du projet doivent être étudiés : l'éventuel maintien des droits au chômage du créateur d'entreprise, sa situation fiscale personnelle , le versement de dividendes, la présence de déficits fiscaux... La réalisation d'un prévisionnel financier permet généralement d'y voir plus clair.",
          link: 'https://www.lecoindesentrepreneurs.fr/choisir-son-regime-fiscal/'
        },
        {
          question: "L'imposition des bénéfices a-t-il un impact sur les cotisations sociales ?",
          response:
            "Oui, mais uniquement pour les entrepreneurs affiliés à la sécurité sociale des indépendants (SSI). À l'IR, les cotisations seront calculées sur les bénéfices. À l'IS, elles seront calculées sur les rémunérations et une partie des dividendes."
        },
        {
          question: 'Le régime micro-entreprise est-il accessible à toutes les entreprises ?',
          response:
            "Non, le régime fiscal de la micro-entreprise est ouvert uniquement aux entrepreneurs individuels (y compris ceux en EIRL) dont le chiffre d'affaires ne dépasse pas certaines limites. Les EURL ayant un gérant associé unique personne physique peuvent y prétendre en principe. En pratique, cette combinaison n'a pas vraiment d'intérêt.",
          link: 'https://www.lecoindesentrepreneurs.fr/le-regime-micro-entreprise/'
        },
        {
          question: "Est-ce que je dois payer personnellement des impôts si je choisis l'impôt sur les sociétés ?",
          response:
            "Avec ce choix, votre entreprise paie directement l'impôt sur les bénéfices. De votre côté, vous serez imposé personnellement sur vos rémunérations et vos dividendes."
        },
        {
          question: "C'est quoi le régime des sociétés de personnes ? ",
          response:
            "Ce régime consiste en l'imposition directe des bénéfices au nom des associés de la société. Chaque associé est imposé personnellement à l'IR sur sa quote-part de bénéfices. Ses rémunérations éventuelles sont réintégrées dans son bénéfice imposable.",
          link: 'https://www.lecoindesentrepreneurs.fr/societes-de-personnes/'
        },
        {
          question: "Comment estimer le montant de l'IR sur les bénéfices professionnels ? ",
          response:
            "Si vous avez besoin d'estimer le montant de l'impôt à payer au cas où vous choisissez l'IR, nous vous conseillons de réaliser votre prévisionnel puis d'utiliser le simulateur d'IR proposé par le site internet impôt.gouv.fr.",
          link: 'https://www3.impots.gouv.fr/simulateur/calcul_impot/2021/index.htm'
        },
        {
          question: "Quel régime d'imposition permet de conserver l'intégralité du versement des allocations chômage ?",
          response:
            "Pour bénéficier d'un maintien intégral de vos allocations chômage, le régime de l'impôt sur les sociétés est préférable. Ainsi, vous serez en mesure de justifier votre absence de revenu auprès de Pôle emploi (non-rémunération de vos fonctions de dirigeant)."
        },
        {
          question: "Qui peut m'aider pour faire mes choix fiscaux ?",
          response:
            "Le meilleur interlocuteur est votre expert-comptable. Avant cela, vous devez élaborer un premier projet de prévisionnel. Si vous n'êtes pas encore suivi, nos experts-comptables partenaires peuvent vous accompagner."
        },
        {
          question: 'Quel régime de TVA ai-je intérêt à choisir ?',
          response:
            "De nombreux critères doivent être étudier avant de faire un choix. La franchise en base de TVA n'est généralement pas intéressante si vous travaillez avec des professionnels. Si votre activité nécessite d'importants investissements ou génère des crédits de TVA, il vaut probablement mieux opter pour le régime du réel normal.",
          link: 'https://www.lecoindesentrepreneurs.fr/conseils-pour-choisir-regime-imposition-tva/'
        },
        {
          question: "J'ai un crédit de TVA, comment le récupérer rapidement ?",
          response:
            "Le régime réel normal permet de récupérer rapidement le crédit de TVA (le mois ou le trimestre suivant lorsqu'il dépasse 760 euros).",
          link: 'https://www.lecoindesentrepreneurs.fr/remboursement-du-credit-de-tva/'
        },
        {
          question: 'Le régime de la franchise en base de TVA est-il accessible à toutes les entreprises ?',
          response:
            "Oui, toutes les entreprises peuvent choisir la franchise en base de TVA, quel que soit leur statut juridique. Toutefois, des seuils de chiffre d'affaires sont prévus pour prétendre à ce régime.",
          link: 'https://www.lecoindesentrepreneurs.fr/franchise-de-tva/'
        }
      ]
    },
    'Choisissez votre régime de sécurité sociale': {
      guide: {
        primary: {
          meta_title: 'La sécurité sociale du dirigeant en quelques mots',
          meta_content: [
            {
              meta_type: 'p',
              meta_blob:
                "Le dirigeant d'entreprise peut être affilié à deux régimes de sécurité sociale : le régime général de la sécurité sociale (on parle alors du statut de dirigeant assimilé salarié) ou le régime de la sécurité sociale des indépendants (on parle alors du statut de travailleur indépendant). Le régime de sécurité sociale du dirigeant dépend essentiellement du statut juridique de l'entreprise, le choix n'est pas possible."
            },
            {
              meta_type: 'p',
              meta_blob: "Ces deux régimes présentent d'importantes différences pour le dirigeant :"
            },
            {
              meta_type: 'list',
              meta_blob: [
                "Au régime général, la protection sociale est similaire à celle dont bénéficie les salariés, à l'exception de l'assurance chômage (un dirigeant n'y a pas droit). Le dirigeant a le statut cadre. L'affiliation intervient dès qu'une rémunération est versée. Les cotisations sont déclarées et payées mensuellement ou trimestriellement. Les cotisations sociales représentent approximativement 80 à 85% du montant du revenu net.",
                "À la sécurité sociale des indépendants, la protection sociale est différente de celle du régime général (notamment au niveau des droits à la retraite). Le dirigeant n'a pas droit à l'assurance chômage. L'affiliation intervient dès la création de l'entreprise. Les cotisations sont d'abord payées provisoirement, puis régularisée l'année suivante dès que le revenu est connu. Les cotisations sociales représentent approximativement 40 à 45% du montant du revenu net."
              ]
            }
          ]
        },
        secondary: [
          {
            meta_title: 'Utiliser notre simulateur de sécurité sociale',
            meta_content: [
              {
                meta_type: 'p',
                meta_blob:
                  "Notre simulateur de cotisations sociales pour dirigeant vous permet de comparer le régime général de la sécurité sociale et la sécurité sociale des indépendants à plusieurs niveaux : montant des cotisations sociales, coût total pour l'entreprise, pensions de retraite, couverture sociale... Pour cela, il vous suffit simplement de préciser le montant de votre future rémunération (montant net)"
              },
              {
                meta_type: 'p',
                meta_blob: "Voici quelques explications sur les informations que l'on retrouve dans le simulateur :"
              },
              {
                meta_type: 'list',
                meta_blob: [
                  "Revenu net annuel : c'est le montant de la rémunération nette que vous souhaitez vous verser ;",
                  "Montant des cotisations sociales : c'est le montant qui sera appelé par les organismes sociaux et payé par l'entreprise, compte tenu des salaires qu'elle a versés à son dirigeant ;",
                  "Fonctionnement des cotisations sociales : c'est la façon dont les cotisations sont déclarées et payées aux organismes sociaux ;",
                  "Coût total pour l'entreprise : c'est le montant global des frais que l'entreprise va supporter (rémunération nette versée au dirigeant + charges sociales payées aux organismes sociaux) ;",
                  "Pension de retraite brute annuelle : c'est le montant qui va sera versé chaque année, suite à votre départ en retraite, sous réserve que vous cotisiez de façon continue et dans les mêmes proportions tout au long de votre carrière ;",
                  "Montant de l'indemnité journalière : c'est le montant que vous versera votre CPAM au titre de chaque jour non travaillé en cas d'arrêt maladie."
                ]
              },
              {
                meta_type: 'p',
                meta_blob:
                  "Vous avez la possibilité de modifier le montant de votre rémunération nette autant de fois que nécessaire. Les informations vous permettront d'obtenir une comparaison complète des deux régimes de sécurité sociale."
              }
            ]
          }
        ]
      },
      guidance_text: {
        major: `Vous devez valider votre futur régime de sécurité sociale, qui dépend de votre statut juridique. En cas de besoin, notre comparateur vous aide à apprécier les différences entre le régime général de la sécurité sociale et la sécurité sociale des indépendants.`
      },
      nav_label: ['Régime de sécurité sociale', 'Guide', 'Ressources et FAQ', 'Comparateur'],
      faq: [
        {
          question: 'Quels sont les différents statuts possibles pour un travailleur indépendant ?',
          response:
            "Un dirigeant de société a le choix entre deux statuts : celui de travailleur non-salarié (TNS) ou celui d'assimilé salarié. Le chef d'entreprise (entreprise individuelle) est systématiquement traité comme un travailleur non-salarié.",
          link: 'https://www.lecoindesentrepreneurs.fr/travailleur-independant/'
        },
        {
          question: 'Quelles sont les spécificités du statut de travailleur non-salarié (TNS) ?',
          response:
            "Le TNS est affilié à la sécurité sociale des indépendants (SSI). Au niveau de sa protection sociale, il existe de moins en moins de différences avec celle dont bénéficie l'assimilé salarié. En revanche, ses taux de cotisations sont 1,5 fois moins importants que son homologue.",
          link: 'https://www.lecoindesentrepreneurs.fr/travailleur-non-salarie-tns/'
        },
        {
          question: 'Quelles sont les principales caractéristiques du statut de dirigeant assimilé salarié ?',
          response:
            "L'assimilé salarié est, pour sa part, affilié au régime général de la sécurité sociale. Il bénéficie des mêmes prestations que les salariés classiques et cotisent dans les mêmes proportions à quelques exceptions près. Il est exclu des mesures abattements et ne cotise pas à l'assurance chômage.",
          link: 'https://www.lecoindesentrepreneurs.fr/statut-assimile-salarie/'
        },
        {
          question: 'TNS ou assimilé salarié : comment faire le bon choix ?',
          response:
            "De nombreux critères doivent être étudiés avant de faire un choix. En général, le poids des cotisations sociales est décisif. Mais il faut aussi avoir connaissance de la protection sociale souhaitée par le dirigeant. La participation du conjoint à l'activité peut également avoir un impact dans la décision.",
          link: 'https://www.lecoindesentrepreneurs.fr/choix-du-statut-social-du-dirigeant-dentreprise/'
        },
        {
          question: "Quand est-ce qu'un dirigeant doit-il s'affilier à un régime de sécurité sociale ?",
          response:
            "Les dirigeants relevant de la sécurité sociale des indépendants sont affiliés dès la création de l'entreprise. Par contre, les dirigeants relevant du régime général de la sécurité sociale sont affiliés dès qu'ils se rémunèrent."
        },
        {
          question: 'Peut-on choisir librement son régime de sécurité sociale ?',
          response:
            "Le régime de sécurité sociale du dirigeant dépend du statut juridique de l'entreprise, et parfois des pourcentages de participation (en SARL). Le choix n'est donc pas libre à ce niveau."
        },
        {
          question: 'Les dirigeants doivent-il payer des cotisations sociales minimales ?',
          response:
            "Les dirigeants affiliés à la sécurité sociale des indépendants sont redevables de cotisations sociales minimales, même en l'absence de rémunération. Par contre, les dirigeants affiliés au régime général de la sécurité sociale n'ont pas de cotisations sociales minimales à payer."
        },
        {
          question: 'Les dividendes sont-ils soumis aux cotisations sociales ?',
          response:
            'Une partie des dividendes des travailleurs indépendants (donc affiliés à la sécurité sociale des indépendants) sont soumis aux cotisations sociales.'
        },
        {
          question: "De quelle protection sociale un créateur d'entreprise bénéficie-t-il ?",
          response:
            "L'étendue de la protection sociale d'un créateur d'entreprise dépend de son statut du travailleur indépendant. Au final, peu de différences existent. L'assimilé salarié a droit à une meilleure retraite (mais il cotise plus) et à une prise en charge spéciale des accidents du travail. Pour le reste, tout est identique (remboursements de soins par exemple).",
          link: 'https://www.lecoindesentrepreneurs.fr/protection-sociale-createur-dentreprise/'
        },
        {
          question: 'Un dirigeant peut-il améliorer sa protection sociale ?',
          response:
            "Oui, en souscrivant un ou plusieurs contrats d'assurance complémentaire (complémentaire santé, prévoyance, retraite complémentaire). Ces contrats peuvent être prise en charge directement par l'entreprise.",
          link: 'https://www.lecoindesentrepreneurs.fr/travailleur-independant-contrats-assurance-complementaire/'
        },
        {
          question: "Le régime micro-social, qu'est-ce que c'est ?",
          response:
            "Il s'agit d'un régime spécifique de calcul et de paiement des cotisations sociales prévu uniquement pour les micro-entrepreneurs.",
          link: 'https://www.lecoindesentrepreneurs.fr/regime-micro-social-simplifie-calcul-et-paiement-des-cotisations/'
        },
        {
          question: 'Peut-on changer de régime de sécurité sociale ?',
          response:
            "C'est le statut juridique qui détermine les règles au niveau de l'affiliation des dirigeants. Pour changer de régime, il faut envisager un changement de statut juridique au niveau de l'entreprise (passer de l'EURL à la SASU par exemple)."
        }
      ]
    }
  },
  'Complétez votre prévisionnel financier': {
    "Ajoutez votre chiffre d'affaires prévisionnel": {
      guide: {
        primary: {
          meta_title: "Le chiffre d'affaires prévisionnel en quelques mots",
          meta_content: [
            {
              meta_type: 'p',
              meta_blob:
                "Le chiffre d'affaires regroupe l'ensemble des ventes que vous avez prévues d'effectuer chaque année. Il peut s'agir de ventes de biens (marchandises, produits fabriqués) ou de prestations de services (prestations intellectuelles ou manuelles). Un chiffre d'affaires prévisionnel se calcule toujours de la même manière, par produit ou service, quelle que soit la périodicité (hebdomadaire, mensuelle, trimestrielle, annuelle…) : Nombre de ventes au cours de la période * Prix unitaire hors taxes."
            },
            {
              meta_type: 'p',
              meta_blob: 'Pour pouvoir remplir vos informations, vous devez donc avoir connaissance, au préalable :'
            },
            {
              meta_type: 'list',
              meta_blob: [
                "Du nombre de ventes réalisées chaque mois ou chaque année : vous pouvez estimer cette donnée en effectuant, par exemple, une analyse de votre zone de chalandise et une étude de marché plus ou moins poussée selon votre secteur d'activité et les spécificités de votre projet",
                "Et de votre (ou de vos) prix de vente : plusieurs méthodes existent pour fixer un prix de vente mais veillez à toujours vous comparer à vos concurrents. En effet, votre produit n'intéressera personne s'il est plus cher que celui d'un concurrent et n'apporte aucune valeur ajoutée par rapport celui-ci."
              ]
            }
          ]
        },
        secondary: [
          {
            meta_title: "Ajouter un chiffre d'affaires : comment s'y prendre ?",
            meta_content: [
              {
                meta_type: 'p',
                meta_blob:
                  "Pour ajouter des ventes de biens et/ou de services, cliquez sur le bouton de couleur bleue intitulé « Ajouter un chiffre d'affaires ». Dans la fenêtre, vous devez alors y renseigner :"
              },
              {
                meta_type: 'list',
                meta_blob: [
                  "Intitulé du chiffre d'affaires : il doit donner une indication sur la nature exacte de vos ventes. Soyez plus précis et utilisez d'autres termes que « ventes de marchandises » ou « prestations de services » comme, par exemple, « Missions de conseils » ou « Ventes d'articles de sport » ;",
                  "Répartition du chiffre d'affaires sur l'année : vous devez indiquer ici si le chiffre d'affaires que vous allez saisir sera annuel et réparti par parts égales sur l'année (sélectionnez « mensualisée ») ou si vous souhaitez renseigner votre chiffre d'affaires mois par mois (sélectionnez « personnalisée ») ;",
                  "Avez-vous des achats directement liés à votre chiffre d'affaires : pour certaines activités, le moindre euro de chiffre d'affaires génère X € d'achats (de marchandises, matières, matériaux…) Si c'est votre cas, sélectionnez « Oui ». Attention, ne tenez pas compte de vos frais généraux, ils doivent figurer dans l'onglet « Les dépenses » ;",
                  "Pourcentage de marge (%) : Si vous avez répondu « Oui » à la question précédente, indiquez ici votre taux de marge. Donné en pourcentage, il correspond au résultat du calcul suivant : ( chiffre d'affaires – achats ) * 100 / chiffre d'affaires ;",
                  "Montant hors taxes en euros de votre stock de départ : le stock de départ correspond aux biens – en valeur d'achat – dont vous souhaitez disposer dès le lancement de votre activité. Il résulte de l'estimation de vos premières ventes et de votre stock de sécurité (voir ci-dessous) ;",
                  "Montant hors taxes en euros de votre stock moyen : c'est votre stock critique, ou, autrement dit, le niveau de stocks minimal que vous souhaitez. Lorsqu'une vente a pour effet de faire passer vos stocks à un niveau inférieur au stock de sécurité, un réapprovisionnement sera automatiquement déclenché ;",
                  'Taux de TVA sur les ventes et Taux de TVA sur les achats : indiquez ici le taux applicable à vos ventes et celui applicable à vos achats de marchandises, matières, fournitures. Attention, ils peuvent être différents (notamment dans la restauration par exemple)',
                  "Délai de paiement des clients et Délai de paiement des fournisseurs : sélectionnez ici le délai – en nombre de jours – qui va séparer la date de réalisation d'une vente ou de passation d'un achat de celle du paiement (0, 30 ou 60 jours)"
                ]
              },
              {
                meta_type: 'p',
                meta_blob:
                  "À tout moment, vous avez la possibilité de modifier ou de supprimer un élément figurant dans votre chiffre d'affaires."
              }
            ]
          },
          {
            meta_title: "Ajouter des autres produits : comment s'y prendre ?",
            meta_content: [
              {
                meta_type: 'p',
                meta_blob:
                  "Ici, il ne s'agit pas d'ajouter du chiffre d'affaires à proprement parler, mais des recettes accessoires. Elles ont un caractère marginal et n'ont généralement aucun rapport avec la nature de l'activité. Il peut notamment s'agir de produits financiers ou d'autres produits d'exploitation. Attention, les subventions d'exploitation ne doivent pas figurer ici car il s'agit d'un financement."
              },
              {
                meta_type: 'p',
                meta_blob:
                  "Pour ajouter ces recettes annexes, cliquez sur « Ajouter un autre produit ». Donnez un nom à ce produit (exemple : « Intérêts de placements financiers ») puis précisez sa nature : « produit financier » ou « autre produit d'exploitation »."
              },
              {
                meta_type: 'p',
                meta_blob:
                  "La distinction est importante car ces recettes ne vont pas figurer au même endroit dans votre compte de résultat prévisionnel. Il ne vous reste plus qu'à saisir le montant, puis l'année et le mois de l'encaissement du produit. Éventuellement, sélectionnez le taux de TVA."
              },
              {
                meta_type: 'p',
                meta_blob:
                  'À tout moment, vous avez la possibilité de modifier ou de supprimer un élément figurant dans vos autres produits.'
              }
            ]
          }
        ]
      },
      guidance_text: {
        major: `Vous devez ajouter dans ce tableau toutes les ventes de marchandises, de produits et/ou de services prévues dans le cadre de votre projet. La somme de tous les éléments ajoutés ici correspond à votre chiffre d'affaires prévisionnel.`
      },
      nav_label: ["Votre chiffre d'affaires", 'Guide', 'Ressources et FAQ'],
      faq: [
        {
          question: "Quelle est la différence entre le chiffre d'affaires HT et le chiffre d'affaires TTC ?",
          response:
            "Le chiffre d'affaires TTC est égale à la somme de votre chiffre d'affaires HT et de la TVA appliquée sur le chiffre d'affaires HT."
        },
        {
          question: "Quelle est l'importance du taux de TVA sur le chiffre d'affaires ?",
          response:
            'Si votre entreprise est assujettie à la TVA, la prise en compte de la taxe est importante pour votre budget de trésorerie (qui se base sur des montants TTC).'
        },
        {
          question: 'Comment trouver le taux de TVA à appliquer ?',
          response:
            "Le taux de TVA dépend de votre activité, de votre localisation et de la nature des biens ou des services que vous vendez. Le taux normal est à 20%, il s'applique sur la majorité des ventes. Votre expert-comptable et l'administration fiscale peuvent vous conseiller à ce niveau.",
          link: 'https://www.economie.gouv.fr/cedef/taux-tva-france-et-union-europeenne#:~:text=Le%20taux%20normal%20de%20la,r%C3%A9duit%20de%2010%20%25%20(art.'
        },
        {
          question: "Quelle est la formule à utiliser pour calculer le chiffre d'affaires prévisionnel ?",
          response:
            "Pour obtenir le chiffre d'affaires prévisionnel de votre entreprise, vous devez multiplier le prix de vente unitaire d'un produit/service par les quantités vendues (nombre d'articles, heures de travail...). Effectuez ce calcul pour chaque bien vendu ou service rendu et aditionnez ensuite tous les résultats entre eux.",
          link: 'https://www.lecoindesentrepreneurs.fr/le-chiffre-daffaires-previsionnel/'
        },
        {
          question: "Comment fixer le prix de vente d'un produit ou d'un service ?",
          response:
            "Le prix de vente de votre offre doit tenir compte de nombreux paramètres. Vous devez intégrer non seulement le coût de revient mais également vos objectifs de marge. Aussi, il est indispensable d'analyser les prix pratiqués par les concurrents ainsi que ceux attendus par vos futurs consommateurs.",
          link: 'https://www.lecoindesentrepreneurs.fr/calculer-determiner-un-prix-de-vente/'
        },
        {
          question: "Comment déterminer ses objectifs de chiffre d'affaires ?",
          response:
            "Les hypothèses retenues sont fortement corrélées à votre étude de marché. Plusieurs méthodes peuvent être utilisées ou combinées pour travailler sur les objectifs de chiffre d'affaires.",
          link: 'https://www.lecoindesentrepreneurs.fr/fixer-objectifs-chiffre-daffaires/'
        },
        {
          question: "Comment obtenir une hypothèse réaliste de chiffre d'affaires ?",
          response:
            "Si votre activité n'est pas innovante, votre objectif de chiffre d'affaires doit être cohérent par rapport à ce que réalise vos plus proches concurrents (au niveau de l'activité et également des moyens dont ils disposent)."
        },
        {
          question: "Le seuil de rentabilité, qu'est-ce que c'est ?",
          response:
            "Il s'agit du chiffre d'affaires à réaliser pour atteindre l'équilibre, c'est-à-dire pour couvrir toutes vos charges (le résultat est égal à zéro).",
          link: 'https://www.lecoindesentrepreneurs.fr/seuil-de-rentabilite-definition-calcul-utilite/'
        }
      ]
    },
    'Ajoutez vos dépenses': {
      guide: {
        primary: {
          meta_title: 'Les dépenses prévisionnelles en quelques mots',
          meta_content: [
            {
              meta_type: 'p',
              meta_blob:
                'Les dépenses prévisionnelles correspondent aux frais généraux que va supporter votre entreprise pour fonctionner et exercer son activité. On les appelle, en langage comptable, des charges externes. Elles comprennent notamment les :'
            },
            {
              meta_type: 'list',
              meta_blob: [
                'Petits équipements et matériels de faible valeur (inférieure à 500 € hors taxes) ;',
                "Fournitures administratives (ramettes de papier, enveloppes postales, toners, cartouches d'encre…) ;",
                "Dépenses d'énergie (eau, électricité, gaz, fioul) ;",
                "Loyers mobiliers (location d'un bien ou d'un logiciel) et immobiliers (local commercial, siège social…) ;",
                "Frais d'entretien du matériel et/ou du local d'exploitation ;",
                'Assurances professionnelles (responsabilité civile, assurance décennale, assurance flotte, multirisques…) ;',
                "Abonnements téléphoniques et fourniture d'accès à Internet (ADSL, fibre…) ;",
                'Honoraires des conseils (expert-comptable, commissaire aux comptes, avocat…) ;',
                'Frais bancaires, frais publicitaires et les frais de déplacements, de missions et de réception.'
              ]
            },
            {
              meta_type: 'p',
              meta_blob: 'Attention, il ne faut pas indiquer ici :'
            },
            {
              meta_type: 'list',
              meta_blob: [
                "Les achats de marchandises, de matières premières et de fournitures déjà calculés avec votre taux de marge (au niveau de votre chiffre d'affaires) ;",
                'Les investissements ;',
                'Les charges de personnel.'
              ]
            },
            {
              meta_type: 'p',
              meta_blob:
                "Tout d'abord, vous devez recenser toutes les dépenses nécessaires pour faire fonctionner votre entreprise. Ensuite, il vous faut évaluer précisément chaque dépense. Pour cela, vous pouvez demander des devis ou des propositions de contrat auprès des fournisseurs, étudier les grilles tarifaires, et vous renseigner sur internet."
            }
          ]
        },
        secondary: [
          {
            meta_title: "Ajouter une dépense : comment s'y prendre ?",
            meta_content: [
              {
                meta_type: 'p',
                meta_blob:
                  'Pour ajouter des frais généraux dans notre application, cliquez tout simplement sur le bouton « Ajouter une dépense ». Ensuite, nous vous demandons plusieurs informations. Voici quelques conseils pour vous aider :'
              },
              {
                meta_type: 'list',
                meta_blob: [
                  'Catégorie de la dépense : sélectionnez la nature de votre dépense, parmi celles qui sont proposées,',
                  'Nom de la dépense : donnez un nom à votre dépense (« Honoraires comptables » par exemple),',
                  'Montant annuel hors taxes en année 1 : indiquez le montant total de la dépense versée au titre de la 1ère année,',
                  'Montant annuel hors taxes en année 2 : indiquez le montant total de la dépense versée au titre de la 2ème année,',
                  'Montant annuel hors taxes en année 3 : indiquez le montant total de la dépense versée au titre de la 3ème année,',
                  "Répartition de la dépense sur l'année : sélectionnez la ventilation du paiement sur l'année parmi les propositions,",
                  "Taux de TVA sur la dépense : sélectionnez le taux de TVA applicable à l'opération (de 0%, à 20%)."
                ]
              },
              {
                meta_type: 'p',
                meta_blob:
                  "Le choix que vous allez effectuer au niveau de la « répartition de la dépense sur l'année » est essentiel. Ne le négligez surtout pas, car il peut avoir un impact significatif sur votre tableau de trésorerie."
              },
              {
                meta_type: 'list',
                meta_blob: [
                  'Répartition mensuelle : 12 décaissements mensuels de 1/12 du montant de la dépense annuelle ;',
                  'Répartition trimestrielle : 4 décaissements, en mois 1, 4, 7, 10, de 25% du montant de la dépense annuelle ;',
                  'Répartition semestrielle : 2 décaissements, en mois 1 et 7, de 50% du montant de la dépense annuelle ;',
                  "Répartition annuelle (début d'année) : 1 décaissement au mois 1 de l'année (entre dans le calcul du BFR pour l'année 1) ;",
                  "Répartition annuelle (fin d'année) : 1 décaissement au dernier mois de l'année (mois 12) ;",
                  'Répartition ponctuelle : 1 décaissement à la date renseignée par vos soins (année et mois).'
                ]
              },
              {
                meta_type: 'p',
                meta_blob:
                  'À tout moment, vous avez la possibilité de modifier ou de supprimer un élément figurant dans vos dépenses.'
              }
            ]
          }
        ]
      },
      guidance_text: {
        major: `Vous devez ajouter dans ce tableau tous les frais généraux et les autres dépenses prévues dans le cadre de votre projet de création d'entreprise (fournitures, petit équipement, loyers, frais de comptabilité, assurances, frais de déplacement…), en dehors des investissements, des salaires et des cotisations sociales.`
      },
      nav_label: ['Vos dépenses', 'Guide', 'Ressources et FAQ'],
      faq: [
        {
          question: 'Comment budgétiser une dépense avec précision ?',
          response:
            'Pour obtenir une estimation précise, la solution la plus fiable consiste à demander des devis ou des propositions de contrat à vos fournisseurs. Chaque montant doit être justifié. Les tarifs peuvent parfois être consultés sur Internet, directement sur les sites des fabricants ou dans leurs brochures.',
          link: 'https://www.lecoindesentrepreneurs.fr/charges-previsionnelles-du-business-plan-partie-1/'
        },
        {
          question: 'Quels sont les frais généraux les plus courants ?',
          response:
            "Il s'agit des dépenses liées au local professionnel (loyers immobiliers), des fournitures administratives, des petits matériels et équipements, des honoraires comptabilité, des frais bancaires, des cotisations d'assurance et des dépenses de télécommunication (téléphone et internet).",
          link: 'https://www.lecoindesentrepreneurs.fr/previsionnel-financier-check-list-depenses/'
        },
        {
          question: "Comment réduire le risque d'oublier des dépenses dans le prévisionnel ?",
          response:
            "Au préalable, il est important que vous réalisiez un travail de préparation sur les moyens nécessaires au lancement et au l'exercice de votre activité. Vous devez répondre à la question : « de quoi vais-je avoir besoin pour lancer et exercer mon activité ? ». Cette réflexion est la base de votre travail de budgétisation des dépenses."
        },
        {
          question: 'Comment optimiser les frais généraux ?',
          response:
            'Pour obtenir le meilleur rapport qualité / prix sur chaque poste de dépense, il faut solliciter systématiquement plusieurs professionnels pour les mettre en concurrence et comparer leur proposition.'
        }
      ]
    },
    'Ajoutez vos charges de personnel': {
      guide: {
        primary: {
          meta_title: 'Les charges de personnel en quelques mots',
          meta_content: [
            {
              meta_type: 'p',
              meta_blob:
                "Les salaires que vous devez renseigner ici correspondent à toutes les rémunérations versées par votre future entreprise à ses salariés, et également à ses dirigeants (président de SASU/de SAS ou gérant d'EURL/de SARL). Ils peuvent aussi correspondre aux montants prélevés par l'exploitant (cas de l'entreprise individuelle)."
            },
            {
              meta_type: 'p',
              meta_blob:
                "Faîtes attention aux données saisies : vous devez renseigner les rémunérations nettes versées au(x) dirigeant(s) de société tandis qu'il vous faut indiquer les salaires bruts attribués au(x) salarié(s). La distinction est importante car notre outil va, comme précisé ci-dessous, calculer automatiquement les charges sociales dues sur la base de ces montants."
            },
            {
              meta_type: 'p',
              meta_blob:
                "Les rémunérations octroyées au personnel doivent respecter la réglementation sur les minimas sociaux notamment (SMIC) ainsi que les règles en vigueur dans votre secteur d'activité (convention collective). Pour les dirigeants, il n'existe aucun minima, la rémunération est librement fixée."
            }
          ]
        },
        secondary: [
          {
            meta_title: "Ajouter un salaire pour un dirigeant : comment s'y prendre ?",
            meta_content: [
              {
                meta_type: 'p',
                meta_blob:
                  "Pour ajouter un salaire de dirigeant, cliquez sur « Ajouter un dirigeant ». Une nouvelle fenêtre s'affiche à l'écran. le Nom et le Prénom du dirigeant permettront de l'identifier. Ensuite, vous devez préciser si le dirigeant bénéfice de l'ACRE. Cette réponse a un impact sur le calcul des cotisations sociales. Vous devez également préciser la répartition de la rémunération :"
              },
              {
                meta_type: 'list',
                meta_blob: [
                  "Mensualisée : vous devez, dans ce cas, saisir les rémunérations nettes annuelles globales pour l'année 1, l'année 2 et l'année 3. L'application considérera que vous versez, chaque mois, 1/12ème du montant saisi au dirigeant, en tant que salaire net.",
                  "Personnalisée : cette option vous permet de personnaliser le calendrier de versement des salaires au dirigeant. Ici, vous devez indiquer les rémunérations nettes mensuelles dans les cases appropriées (un versement en cours d'année est possible)."
                ]
              },
              {
                meta_type: 'p',
                meta_blob:
                  "Le montant des cotisations sociales, figurant dans l'encadré orange, se calcule automatiquement (sauf pour les travailleurs indépendants dont les cotisations sociales sont calculées sur les bénéfices). Notre application est connectée à l'URSSAF, ce qui permet de déterminer avec exactitude les montants de charges sociales. Attendez bien que l'outil ait terminé son calcul pour enregistrer."
              }
            ]
          },
          {
            meta_title: "Ajouter un salaire pour un salarié : comment s'y prendre ?",
            meta_content: [
              {
                meta_type: 'p',
                meta_blob:
                  "Pour ajouter une rémunération d'un salarié, cliquez sur « Ajouter un salarié ». Une nouvelle fenêtre s'affiche à l'écran. Indiquez l'intitulé du poste que va occuper le salarié embauchée. Sélectionnez ensuite la nature du contrat de travail : CDD ou CDI."
              },
              {
                meta_type: 'p',
                meta_blob:
                  "Précisez la durée du contrat de travail en mois (uniquement pour le cas du CDD). Puis, indiquez le montant de la rémunération brute mensuelle versée au salarié. Le montant des cotisations sociales, figurant dans l'encadré orange, se calcule automatiquement"
              },
              {
                meta_type: 'p',
                meta_blob:
                  "Dès que les montants s'affichent à l'écran, sélectionnez l'année et le mois de l'embauche pour que l'embauche soit budgétisée avec précision dans le prévisionnel."
              }
            ]
          }
        ]
      },
      guidance_text: {
        major: `Vous devez ajouter dans ces tableaux les salaires prévus pour les dirigeants et les salariés dans le cadre de votre projet de création d'entreprise. Les cotisations sociales sont calculées automatiquement par notre application.`
      },
      nav_label: ['Vos salaires', 'Guide', 'Ressources et FAQ'],
      faq: [
        {
          question: "Comment estimer le montant du salaire brut d'un salarié ?",
          response:
            "Vous pouvez obtenir des informations sur les sites d'offres d'emploi, sur les pratiques de vos concurrents, auprès des cabinets de recrutement et de votre expert-comptable (s'il a d'autres clients dans le même secteur d'activité). Ensuite, des études sont également disponibles sur le site internet de l'INSEE."
        },
        {
          question: 'En dehors des cotisations sociales et des salaires, que faut-il budgétiser ?',
          response:
            "La taxe d'apprentissage et la contribution à la formation professionnelle sont calculées par l'application. Ensuite, vous ne devez pas oublier le coût de la mutuelle collective (à mettre dans les dépenses), les frais de gestion de la paie, et les coûts directement liés à l'activité du salarié (déplacement, repas, téléphone...).",
          link: 'https://www.lecoindesentrepreneurs.fr/embaucher-un-salarie-budget-a-prevoir/'
        },
        {
          question: 'Quels sont les taux de charges sociales applicables aux salaires ?',
          response:
            "Les taux de cotisations sociales dépendent du statut du bénéficiaire (salarié, assimilé salarié ou travailleur non-salarié). Pour les salariés, le montant dépend du niveau de rémunération (il existe des abattements pour les bas salaires). Pour le dirigeant assimilé salarié, le taux de charges s'élève à environ 70% de son salaire net. Pour le TNS, ce taux descend à environ 40%."
        },
        {
          question: 'Vos calculs tiennent-ils compte des réductions de cotisations sur les bas salaires ?',
          response:
            "Oui, notre application prend en compte les réductions de cotisations sociales applicables aux salariés et aux travailleurs indépendants. Nous suivons exactement les règles de calcul utilisées par l'Urssaf."
        },
        {
          question: "Faut-il indiquer le salaire net ou le salaire brut dans l'application ?",
          response:
            "Pour les salariés, il faut indiquer le salaire brut mensuel (salaire net + charges sociales salariales). Même chose pour les dirigeants assimilés salariés (président de SASU/SAS). En revanche, pour les travailleurs non-salariés (gérants de SARL/EURL), c'est  la rémunération nette qui doit être précisée."
        }
      ]
    },
    'Ajoutez vos investissements': {
      guide: {
        primary: {
          meta_title: 'Les investissements en quelques mots',
          meta_content: [
            {
              meta_type: 'p',
              meta_blob:
                "vous devez renseigner ici tous les biens qui vont servir à produire les biens ou les services vendus par votre entreprise et/ou à être loués à des tiers. Ce sont des biens qui ne se consomment pas lors du premier usage, que votre entreprise va conserver au moins un an et qui ne sont pas destinés à de l'achat-revente. On les appelle des immobilisations."
            },
            {
              meta_type: 'p',
              meta_blob: 'En général, on distingue trois types de biens durables :'
            },
            {
              meta_type: 'list',
              meta_blob: [
                'Les investissements corporels : biens non-monétaires qui ont une substance physique (terrain, construction, matériel informatique, véhicule, outillage, mobilier…),',
                "Les investissements incorporels : biens non-monétaires qui n'ont pas de substance physique (logiciel, marque, droit au bail, fonds de commerce…),",
                "Les investissements financiers : dépôts de garanties versés, actions et parts sociales d'autres sociétés et prêts accordés."
              ]
            },
            {
              meta_type: 'p',
              meta_blob:
                "Les stocks, les consommables, les créances clients ou encore le capital social ne constituent pas, par exemple, des immobilisations. Également, les investissements de faible valeur (moins de 500 euros) peuvent être considérées comme des achats de frais généraux. Ils doivent, dans ce cas, figurer dans l'onglet « Les dépenses »"
            }
          ]
        },
        secondary: [
          {
            meta_title: "Ajouter un investissement : comment s'y prendre ?",
            meta_content: [
              {
                meta_type: 'p',
                meta_blob:
                  "Pour ajouter un investissement, cliquez simplement sur le bouton « Ajouter un investissement ». Une nouvelle page s'ouvre. Vous devez y renseigner plusieurs informations importantes. Voici quelques conseils qui peuvent vous aider :"
              },
              {
                meta_type: 'list',
                meta_blob: [
                  "Nature de l'investissement : sélectionnez le type d'immobilisation (corporelle, incorporelle ou financière) ;",
                  "Apport en nature : indiquez ici si le bien en question appartient initialement à un associé et que ce dernier l'apporte à la société ;",
                  "Nom de l'investissement : identifiez l'investissement en lui attribuant un nom (« iMac » ou « Peugeot 5008 » par exemple) ;",
                  "Montant hors taxes de l'investissement : renseignez le coût d'achat de l'immobilisation (prix d'achat + frais accessoires) ;",
                  "Année et mois de l'opération : précisez la date exacte à laquelle votre entreprise achètera le bien ;",
                  "Durée d'utilisation : choisissez la durée pendant laquelle vous pensez que votre entreprise utilisera le bien (en mois) ;",
                  'Taux de TVA : sélectionnez le taux de TVA applicable.'
                ]
              },
              {
                meta_type: 'p',
                meta_blob:
                  "Pour que vos investissements de départ soient repris dans votre plan de financement, vous devez obligatoirement sélectionner « Année 1 Mois 1 » dans les rubriques Année et Mois de l'investissement."
              },
              {
                meta_type: 'p',
                meta_blob:
                  "Notre application calcule automatiquement les amortissements de vos immobilisations, en fonction des durées d'utilisation que vous avez sélectionnées. En cas de doute, vous pouvez utiliser les durées suivantes : 3 ans pour le matériel informatique, 4 ou 5 ans pour le matériel de transport, 5 à 10 ans pour les machines et outillages industriels et 10 à 20 ans pour les agencements."
              },
              {
                meta_type: 'p',
                meta_blob:
                  "Attention, certains biens ne sont pas amortissables. C'est notamment le cas des terrains ou de la plupart des immobilisations financières (prêt ou fonds de commerce)."
              }
            ]
          }
        ]
      },
      guidance_text: {
        major: `Vous devez ajouter ici tous les investissements prévus dans le cadre de votre projet de création d'entreprise et valant plus de 500 euros (véhicule, local, matériel informatique, outillage, mobilier, agencement).`
      },
      nav_label: ['Vos investissements', 'Guide', 'Ressources et FAQ'],
      faq: [
        {
          question: 'Comment savoir si un bien est considéré comme un investissement ou pas ?',
          response:
            "Si le bien en question n'est pas consommé lors du premier usage et que votre entreprise va s'en servir dans le cadre de son activité pendant plus d'un an, il s'agit d'un investissement. Dans le cas contraire, c'est une charge à inscrire dans la rubrique « Les dépenses ».",
          link: 'https://bofip.impots.gouv.fr/bofip/2109-PGP.html/identifiant=BOI-BIC-CHG-20-30-10-20170301'
        },
        {
          question: 'Quels sont les investissements les plus courants ?',
          response:
            'Cela dépend, en pratique, de votre activité : matériel informatique pour les consultants par exemple, matériel de transport pour les chauffeurs de taxi ou VTC, dépôt de garantie, mobiliers et agencements pour les commerces de détail, etc.'
        },
        {
          question: 'Comment faire pour évaluer au mieux le montant des investissements ?',
          response:
            'Pour obtenir une estimation précise de chacun de vos investissements, effectuez des demandes de devis auprès de différents fournisseurs. Prenez connaissance des tarifs en vigueur dans leurs brochures ou sur leurs sites Internet.'
        },
        {
          question: "Qu'est-ce que l'amortissement ?",
          response:
            "Un investissement représente généralement une somme d'argent importante. Il est, par ailleurs, utilisé plus d'une année. C'est pourquoi sa valeur n'est pas déduite en une fois du résultat comptable. En réalité, elle est répartie sur sa durée d'utilisation : cet étalement est appelé l'amortissement.",
          link: 'https://www.lecoindesentrepreneurs.fr/amortissements-previsionnels/'
        },
        {
          question: 'Comment calculer un amortissement ?',
          response:
            "De nombreuses méthodes permettent de calculer un amortissement. La plus connue et utilisée et la technique de l'amortissement linéaire. L'amortissement est le fruit du rapport entre la valeur de l'investissement et sa durée d'utilisation. Notre application calcule automatiquement le montant de la dotation aux amortissements, vous n'avez donc pas à le faire vous-même."
        },
        {
          question: 'Sur quelle durée amortir un investissement ?',
          response:
            "En théorie, il faut amortir un bien sur sa durée d'utilisation. Toutefois, dans le cadre d'un projet de création d'entreprise, il est souvent difficile d'estimer cette durée. Ce sont donc généralement les durées d'amortissement fiscales qui sont appliquées. Elles dépendent de la nature du bien.",
          link: 'https://bofip.impots.gouv.fr/bofip/4520-PGP.html/identifiant=BOI-BIC-AMT-10-40-30-20130923'
        }
      ]
    },
    'Ajoutez vos financements': {
      guide: {
        primary: {
          meta_title: 'Les financements en quelques mots',
          meta_content: [
            {
              meta_type: 'p',
              meta_blob:
                "Les financements correspondent à toutes les ressources financières mobilisées pour la réalisation d'un projet de création ou de reprise d'entreprise. Les financements peuvent être apportées par les fondateurs de l'entreprise (on parle alors de fonds propres) et également par des partenaires extérieurs (prêts, subventions, investisseurs...)."
            },
            {
              meta_type: 'p',
              meta_blob: 'En matière de financement, il existe de nombreuses possibilités parmi lesquelles :'
            },
            {
              meta_type: 'list',
              meta_blob: [
                "Les apports au capital de l'entreprise, pouvant prendre la forme d'un apport en numéraire (de l'argent) ou en nature (bien autre que de l'argent) ;",
                "Les apports en compte courant d'associé, qui permettent à un associé de faire une avance de trésorerie à sa société ;",
                "Les prêts bancaires professionnels et les prêts d'honneur ;",
                "Les subventions, qui sont des aides financières accordées par l'État."
              ]
            }
          ]
        },
        secondary: [
          {
            meta_title: "Ajouter un apport en capital : comment s'y prendre ?",
            meta_content: [
              {
                meta_type: 'p',
                meta_blob:
                  "Pour ajouter un apport en capital, quelle que soit sa nature (argent ou bien) cliquez sur le bouton « Ajouter un apport en capital ». Sélectionnez ensuite le type d'apport : apport en numéraire ou apport en nature."
              },
              {
                meta_type: 'list',
                meta_blob: [
                  "Pour les apports en nature : l'application vous indique la procédure à suivre. Vous devez vous rendre dans « Les investissements ». cliquez sur « Ajouter un investissement », remplissez les différentes informations demandées. Au passage répondez « Oui » à la question « S'agit-il d'un apport en nature ? ». Votre apport en nature intégré au capital social sera généré automatiquement par l'application. ",
                  "Pour les apports en numéraire : vous devrez renseigner le montant total des apports d'argent réalisés par chaque associé dans le capital social de la société, ainsi que l'année et le mois de mise à disposition des fonds. Pour les entreprises individuelles, il s'agit des apports d'argent effectués par le chef d'entreprise. "
                ]
              }
            ]
          },
          {
            meta_title: "Ajouter un apport en compte courant d'associé : comment s'y prendre ?",
            meta_content: [
              {
                meta_type: 'p',
                meta_blob:
                  "Les associés de sociétés peuvent effectuer des avances d'argent qui ne seront pas incorporées au capital de la structure. Elles sont, en principe, récupérables à tout moment si la trésorerie de l'entreprise le permet. Ce type d'apport est impossible en entreprise individuelle et en EIRL. "
              },
              {
                meta_type: 'P',
                meta_blob:
                  "L'application vous permet de gérer non seulement les apports mais également les remboursements. Pour cela, cliquez sur « Ajouter un apport / remboursement en compte courant d'associé ». Sélectionnez la nature de l'opération (apport ou remboursement) puis précisez l'année et le mois."
              }
            ]
          },
          {
            meta_title: "Ajouter un financement extérieur : comment s'y prendre ?",
            meta_content: [
              {
                meta_type: 'p',
                meta_blob:
                  "Les prêts bancaires traditionnels (accordés par les établissements de crédit), les prêts d'honneur (accordés par certains organismes), les autres prêts (prêts familiaux) ainsi que les subventions (accordées par l'État et les collectivités) sont regroupés dans ce tableau."
              },
              {
                meta_type: 'p',
                meta_blob: 'Les informations à renseigner dépendent de la nature du financement'
              },
              {
                meta_type: 'list',
                meta_blob: [
                  "Pour les prêts : il faut identifier le financement, indiquer le montant initial du prêt, sélectionner l'année et le mois du déblocage des fonds, préciser le taux annuel du prêt et la durée de remboursement. L'application calcule automatiquement le montant de votre mensualité et l'affiche à l'écran",
                  "Pour les subventions : il faut identifier la subvention, le montant octroyé ainsi que l'année et le mois du versement des fonds. "
                ]
              }
            ]
          }
        ]
      },
      guidance_text: {
        major: `Vous devez ajouter dans ce tableau tous les financements, personnels et extérieurs, mobilisés dans le cadre de votre projet. Pour créer une société, nous rappelons qu'un apport en capital est obligatoire. Si vous prévoyez de réaliser un apport en nature, vous devez ajouter un nouvel investissement dans la page "Les investissements" en précisant qu'il s'agit d'un apport en nature et l'apport au capital sera généré automatiquement.`
      },
      nav_label: ['Vos financements', 'Guide', 'Ressources et FAQ'],
      faq: [
        {
          question: "Quels sont les différents moyens de financement d'un projet de création d'entreprise ?",
          response:
            "Il existe de nombreuses solutions de financement. Les plus courantes sont les apports du créateur et les participations d'investisseurs ; mais il existe également des sources externes de financement : l'emprunt bancaire, le crédit-bail, la location, les subventions, etc.",
          link: 'https://www.lecoindesentrepreneurs.fr/les-solutions-de-financement-creation-d-entreprise/'
        },
        {
          question: 'A quoi correspond le capital social ?',
          response:
            "Le capital social représente le montant qu'a reçu une société, directement sous forme d'apport argent ou indirectement sous forme d'apport de biens et en contrepartie de quoi elle a attribué des titres aux apporteurs (parts sociales ou actions). Un formalisme juridique doit être respecté en cas d'augmentation ou de diminution.",
          link: 'https://www.lecoindesentrepreneurs.fr/le-capital-social/'
        },
        {
          question: "Le compte courant d'associé, qu'est-ce que c'est ?",
          response:
            "Avant toute chose, il faut savoir que le compte courant d'associé (C/CT) ne concerne que les sociétés. Les associés et dirigeants peuvent mettre à la disposition de leur société des sommes d'argent dans un compte ouvert à leur nom. Ces fonds n'entrent pas dans la composition du capital social. Ils sont donc, en principe, récupérables à tout moment et sans formalisme particulier.",
          link: 'https://www.lecoindesentrepreneurs.fr/compte-courant-associe/'
        },
        {
          question: 'Comment estimer le montant du financement nécessaire pour son projet ?',
          response:
            "Le plan de financement initial permet de déterminer le montant des ressources financières nécessaires pour le projet. Un financement suffisant couvre l'ensemble de vos besoins, vous permet d'avoir une trésorerie positive et de dispose d'une marge de sécurité financière pour gérer les imprévus.",
          link: 'https://www.lecoindesentrepreneurs.fr/creation-dentreprise-calculer-le-besoin-de-financement/'
        },
        {
          question: 'Peut-on créer une entreprise sans aucun apport ?',
          response:
            "En théorie, il est possible de créer une entreprise sans apport. En pratique, cela reste toutefois très rare. En effet, il est généralement impossible, dans ce cas de figure, d'obtenir un prêt bancaire ou de financer ses investissements/stocks de départ. ",
          link: 'https://www.lecoindesentrepreneurs.fr/creer-entreprise-sans-apport/'
        },
        {
          question: 'Comment savoir si le financement prévu est bien équilibré ?',
          response:
            "Pour cela, vous devez estimer votre capacité de financement pour votre projet. Pour une création d'entreprise, elle se calcule comme suit : montant de votre contribution personnelle / 0,25. Cela vous permet d'avoir une idée du financement maximal que vous êtes en mesure de mobiliser.",
          link: 'https://www.lecoindesentrepreneurs.fr/estimer-votre-capacite-de-financement-de-projet/'
        },
        {
          question: 'Comment faire pour renforcer ses fonds propres ?',
          response:
            "Plusieurs solutions peuvent vous permettre de renforcer vos fonds propres, par exemple : faire entrer un investisseur ou un nouvel associé, solliciter un prêt d'honneur, demander le versement en capital de vos droits au chômage (ARCE), créer un dossier sur une plateforme de financement participatif, etc.",
          link: 'https://www.lecoindesentrepreneurs.fr/trouver-des-fonds-propres/'
        },
        {
          question: 'Comment être prudent au niveau des financements prévus ?',
          response:
            "La première chose consiste à être cohérent avec vos capacités de financement. Ensuite, vous devez valider l'obtention de chaque financement (accord de principe de la banque, feu vert de votre courtier en financement), vérifier que chaque associé dispose des fonds qu'il prévoit d'apporter, commencer les démarches pour les prêts d'honneur et les subventions... L'incorporation d'un financement incertain pourra engendrer des problèmes si vous ne l'obtenez pas."
        }
      ]
    },
    steps: [
      "Ajoutez votre chiffre d'affaires prévisionnel",
      'Ajoutez vos dépenses',
      'Ajoutez vos charges de personnel',
      'Ajoutez vos investissements',
      'Ajoutez vos financements'
    ]
  },
  'Etudiez votre synthèse prévisionnelle': {},
  'Vérifiez votre prévisionnel': {},
  'Téléchargez votre prévisionnel': {},
  'Validez votre prévisionnel avec un expert': {}
};
export default InformationTemplate;
