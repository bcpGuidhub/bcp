const legalStatusRankStore = {
  regime_imposition_benefices: {
    meta_data: [
      {
        meta_label: "Redevable de l'impôt",
        status: [
          {
            legal_label: 'Micro',
            legal_merit: `<p>C'est le micro-entrepreneur qui paie, de façon personnelle, l'impôt sur les bénéfices. La micro-entreprise ne subit aucune imposition fiscale.</p>`
          },
          {
            legal_label: 'IR',
            legal_merit: `<p>C'est le chef d'entreprise, ou les associés au prorata de leur participation au capital qui paie directement l'impôt sur les bénéfices. L'entreprise n'est pas imposée.</p>`
          },
          {
            legal_label: 'IS',
            legal_merit: `<p>C'est la société qui paie l'impôt sur les bénéfices. Lorsque les associés perçoivent des dividendes et/ou une rémunération au titre d'un mandat social, ils paient personnellement l'impôt sur le revenu.</p>`
          }
        ],
        meta_description:
          "Le redevable de l'impôt correspond à la personne qui paie l'impôt. Il peut s'agir de l'entreprise, de son représentent (dirigeant ou chef d'entreprise) et/ou de ses associés."
      },
      {
        meta_label: 'Calcul du bénéfice imposable',
        status: [
          {
            legal_label: 'Micro',
            legal_merit: `<p>Le bénéfice est calculé de façon forfaitaire, en appliquant au chiffre d'affaires un abattement (en %) censé tenir compte de toutes les dépenses de l'entreprise. La différence constitue le bénéfice imposable.</p>`
          },
          {
            legal_label: 'IR',
            legal_merit: `<p>Le bénéfice s'obtient en faisant la différence entre le chiffre d'affaires et les charges réelles de l'entreprise. La rémunération du chef d'entreprise ou du dirigeant associé n'est pas déductible.</p>`
          },
          {
            legal_label: 'IS',
            legal_merit: `<p>Le bénéfice se calcule en effectuant une soustraction entre le chiffre d'affaires et les charges réellement supportées par la société. Ici, la rémunération du dirigeant est déductible. Elle génère donc une économie d'impôt pour la société.</p>`
          }
        ],
        meta_description:
          "Le bénéfice imposable sert de base de calcul à l'impôt sur les bénéfices. Il ne correspond pas forcément au résultat comptable. Certaines dépenses ne sont, en effet, parfois pas déductibles."
      },
      {
        meta_label: "Taux d'imposition",
        status: [
          {
            legal_label: 'Micro',
            legal_merit: `<p>Le taux d'imposition d'un micro-entrepreneur dépend de la composition de son foyer fiscal (nombre de parts) et du montant de ses revenus totaux imposables. Il peut être de 0%, 11%, 30%, 41% ou 45%. Une option pour le versement libératoire est possible sous conditions.</p>`
          },
          {
            legal_label: 'IR',
            legal_merit: `<p>Le taux d'imposition du chef d'entreprise ou des associés dépend également de la composition de leur foyer et du montant de leurs revenus imposables. Il peut s'élever à 0%, 11%, 30%, 41% ou 45%. L'option pour le versement libératoire n'existe pas.</p>`
          },
          {
            legal_label: 'IS',
            legal_merit: `<p>Le taux d'imposition est de 26,50%. Sous conditions, la société peut bénéficier d'un taux réduit d'impôt de 15% sur les 38 120 premiers euros de bénéfices. Pour le surplus de bénéfices, c'est le taux normal qui s'applique.</p>`
          }
        ],
        meta_description:
          "Le taux d'imposition correspond à un pourcentage que l'on applique au bénéfice imposable pour calculer l'impôt sur les bénéfices dû par l'entreprise ou ses associés. Il diffère selon le régime choisi (IR, IS ou micro)."
      },
      {
        meta_label: "Paiement de l'impôt",
        status: [
          {
            legal_label: 'Micro',
            legal_merit: `<p>En cas d'option pour le versement libératoire, l'impôt est payé en même temps que les charges sociales : chaque mois ou chaque trimestre. A défaut, c'est le prélèvement à la source qui s'applique sur le compte bancaire du micro-entrepreneur.</p>`
          },
          {
            legal_label: 'IR',
            legal_merit: `<p>Des prélèvements sont effectués chaque mois sur le compte bancaire du chef d'entreprise ou sur celui des associés. Une fois le montant du bénéfice connu et déclaré à l'administration (au plus tard en juin de l'année suivante), une régularisation est effectuée.</p>`
          },
          {
            legal_label: 'IS',
            legal_merit: `<p>La société doit payer 4 acomptes trimestriels provisoires. Une régularisation annuelle est effectuée le 15ème jour du 4ème mois suivant la clôture de l'exercice comptable en fonction du bénéfice réel déclaré.</p>`
          }
        ],
        meta_description:
          "Le calendrier de paiement de l'impôt varie en fonction du régime fiscal choisi. La périodicité peut être mensuelle ou trimestrielle assortie ou non d'une régularisation annuelle."
      },
      {
        meta_label: "Imposition personnelle de l'entrepreneur",
        status: [
          {
            legal_label: 'Micro',
            legal_merit: `<p>Le micro-entrepreneur est imposé à l'impôt sur le revenu sur l'intégralité de son bénéfice déterminé de façon forfaitaire (chiffre d'affaires - abattement), peu importe qu'il ait perçu une somme d'argent à titre personnel ou non.</p>`
          },
          {
            legal_label: 'IR',
            legal_merit: `<p>Les associés (ou le chef d'entreprise) sont imposés à l'impôt sur le revenu à raison de leur quote-part de participation aux bénéfices, peu importe qu'ils aient effectivement perçu l'argent.</p>`
          },
          {
            legal_label: 'IS',
            legal_merit: `<p>Les associés ne sont imposés à l'impôt sur le revenu que sur les sommes qu'ils ont perçues. Il peut s'agir de dividendes et/ou de rémunération s'ils exercent un mandat social dans la société (gérant ou président).</p>`
          }
        ],
        meta_description:
          "Le chef d'entreprise, les associés et/ou le dirigeant d'une société peuvent avoir à payer des impôts à titre personnel, à la place ou en complément de ceux déjà payés par l'entreprise."
      },
      {
        meta_label: 'Impact sur les charges sociales',
        status: [
          {
            legal_label: 'Micro',
            legal_merit: `<p>Les cotisations sociales se calculent, comme l'impôt, sur le montant des recettes brutes encaissées. Le taux varie selon la nature de l'activité. Il est de 12,80% ou de 22%.</p>`
          },
          {
            legal_label: 'IR',
            legal_merit: `<p>Les charges sociales se basent sur la quote-part de bénéfices revenant à chaque associé ou au chef d'entreprise. Les rémunérations versées ne sont pas déductibles.</p>`
          },
          {
            legal_label: 'IS',
            legal_merit: `<p>Les charges sociales sont calculées sur le montant des rémunérations versées (brutes ou nettes) ainsi que sur le montant des dividendes versés (uniquement pour les gérants majoritaires de SARL/EURL).</p>`
          }
        ],
        meta_description:
          "Le régime d'imposition sur les bénéfices a un impact sur le calcul des charges sociales du dirigeant/chef d'entreprise. La base de calcul n'est pas la même à l'IR, à l'IS ou au micro."
      },
      {
        meta_label: 'Impact sur les aides fiscales',
        status: [
          {
            legal_label: 'Micro',
            legal_merit: `<p>Le régime micro-entreprise est exclu de certains dispositifs d'exonération comme l'exonération pour implantation dans une zones AFR. Il est toutefois éligible au dispositif ZFU. Pour ce dernier, l'exonération d'impôt est totale, dans les limites prévues par la Loi.</p>`
          },
          {
            legal_label: 'IR',
            legal_merit: `<p>Les bénéfices peuvent bénéficier d'une exonération totale d'impôt sur le revenu, dans la limite de la réglementation relative aux aides de minimis. Les associés (ou le chef d'entreprise) peuvent donc percevoir des fonds exonérés d'impôt.</p>`
          },
          {
            legal_label: 'IS',
            legal_merit: `<p>Les bénéfices peuvent bénéficier de l'exonération, mais l'allègement ne concerne pas l'impôt sur le revenu dû par les associés (en cas de versement de dividendes notamment). Les bénéfices supportent donc indirectement une imposition.</p>`
          }
        ],
        meta_description:
          "Les entreprises situées dans certaines zones (Zone Franche Urbaine, Zone d'Aide à Finalité Régionale) ou disposant d'un statut particulier (Jeune Entreprise Innovante ou Universitaire) peuvent bénéficier d'une exonération d'impôt sur les bénéfices. Le montant de l'aide est plus ou moins important suivant le régime fiscal de l'entreprise."
      },
      {
        meta_label: 'Impact sur le maintien des ARE',
        status: [
          {
            legal_label: 'Micro',
            legal_merit: `<p>Le maintien de l'ARE est peu évident en micro-entreprise. Dès que le micro-entrepreneur déclare du chiffre d'affaires, ses droits sont revalorisés même s'il ne réalise pas de bénéfice. L'ARCE peut parfois être une option plus intéressante.</p>`
          },
          {
            legal_label: 'IR',
            legal_merit: `<p>La quote-part de bénéfices revenant au demandeur d'emploi indemnisé a un impact sur le maintien de son allocation chômage, même s'il ne perçoit aucune somme d'argent sur son compte personnel.</p>`
          },
          {
            legal_label: 'IS',
            legal_merit: `<p>Les rémunérations versées au dirigeant ont un impact sur le maintien de l'ARE. Les dividendes non-soumis aux charges sociales, en revanche, n'en ont pas. Il est donc possible de cumuler le maintien de l'ARE avec un versement de dividendes.</p>`
          }
        ],
        meta_description:
          "Le demandeur d'emploi qui crée une entreprise peut, en principe et sous conditions, bénéficier du maintien de ses allocations chômage (Aide au Retour à l'Emploi). En pratique, l'ARE s'article plus ou moins bien avec le régime d'imposition choisi pour l'entreprise."
      },
      {
        meta_label: 'Utilisation des déficits',
        status: [
          {
            legal_label: 'Micro',
            legal_merit: `<p>Il n'existe pas de notion de déficit fiscal dans le régime micro-entreprise. Dans le pire des cas de figure, le résultat est nul. Dès que du chiffre d'affaires est encaissé, un bénéfice apparaît.</p>`
          },
          {
            legal_label: 'IR',
            legal_merit: `<p>Le déficit généré par l'activité peut être imputé sur le revenu global du foyer fiscal et sur celui des 6 années suivantes (si l'activité est exercée à titre professionnel).</p>`
          },
          {
            legal_label: 'IS',
            legal_merit: `<p>Le déficit fiscal peut être reporté en avant sur le montant des bénéfices futurs de la société ou reporté en Retour pour récupérer une partie de l'impôt payé antérieurement.</p>`
          }
        ],
        meta_description:
          "Les débuts peuvent être difficiles et l'entreprise non-rentable au cours des premières années d'activité. Dans ce cas, les pertes suivent un traitement spécifique, qui dépend du régime fiscal adopté par l'entreprise."
      }
    ],
    meta_queries: [
      "Redevable de l'impôt",
      'Calcul du bénéfice imposable',
      "Taux d'imposition",
      "Paiement de l'impôt",
      "Imposition personnelle de l'entrepreneur",
      'Impact sur les charges sociales',
      'Impact sur les aides fiscales',
      'Impact sur le maintien des ARE',
      'Utilisation des déficits'
    ],
    meta_status: ['Micro', 'IR', 'IS']
  },
  regime_tva: {
    meta_data: [
      {
        meta_label: "Conditions de chiffre d'affaires",
        status: [
          {
            legal_label: 'Franchise',
            legal_merit: `<p>Pour bénéficier de la franchise en base de TVA, le chiffre d'affaires de l'entreprise ne doit pas dépasser 85 800 € (ventes et fourniture de denrées) ou 34 400 € (prestations de services).</p>`
          },
          {
            legal_label: 'Régime simplifié',
            legal_merit: `<p>Les entreprises qui réalisent un chiffre d'affaires inférieur à 818 000 € (ventes) ou à 247 000 € (services) peuvent relever du régime simplifié d'imposition. Une option est possible pour les bénéficaires de la franchise en base.</p>`
          },
          {
            legal_label: 'Réel normal',
            legal_merit: `<p>Il n'existe aucune limite de chiffre d'affaires pour appliquer le régime du réel réel. Il est possible d'y opter, même si le chiffre d'affaires est inférieur aux seuils du régime simplifié, ou même de la franchise en base.</p>`
          }
        ],
        meta_description: ''
      },
      {
        meta_label: 'Déduction et reversement de la taxe',
        status: [
          {
            legal_label: 'Franchise',
            legal_merit: `<p>L'entreprise n'est pas imposée à la TVA. Elle n'a pas à la mentionner sur ses factures de ventes. La taxe ne doit pas être reversée, mais aucune déduction n'est admise en contrepartie.</p>`
          },
          {
            legal_label: 'Régime simplifié',
            legal_merit: `<p>L'entreprise doit facturer la TVA et peut récupérer la taxe qui grève ses achats (frais généraux, stocks, investissements...). Un acompte est versé en juillet, un autre en décembre. Une régularisation intervient chaque année.</p>`
          },
          {
            legal_label: 'Réel normal',
            legal_merit: `<p>L'entreprise collecte et reverse la TVA sur ses ventes. Elle est autorisée à déduire la taxe sur ses achats. La déclaration et le paiement sont mensuels (ou trimestriels si la TVA annuellement due est inférieure à 4 000 €)</p>`
          }
        ],
        meta_description: ''
      },
      {
        meta_label: 'Remboursement du crédit de TVA',
        status: [
          {
            legal_label: 'Franchise',
            legal_merit: `<p>Une entreprise qui se place en franchise en base de TVA ne peut prétendre au remboursement de crédit de TVA. La taxe qu'elle paie sur ses achats est une charge non-récupérable.</p>`
          },
          {
            legal_label: 'Régime simplifié',
            legal_merit: `<p>Le crédit de TVA sur investissements peut être remboursé une fois tous les six mois s'il excède 760 €. Dans les autres cas, il est remboursable annuellement et seulement s'il est supérieur à 150 €.</p>`
          },
          {
            legal_label: 'Réel normal',
            legal_merit: `<p>Le remboursement du crédit de TVA peut s'effectuer tous les mois, s'il dépasse 760 €. L'origine du crédit (investissements ou frais généraux) n'a aucune incidence sur les modalités de remboursement.</p>`
          }
        ],
        meta_description: ''
      },
      {
        meta_label: 'Autres critères de choix',
        status: [
          {
            legal_label: 'Franchise',
            legal_merit: `<p>La franchise en base est particulièrement adaptée aux petites entreprises qui travaillent avec des particuliers. Ces derniers ne récupèrent pas la TVA et ne voient pas d'inconvénient à ce qu'il n'y en ait pas sur les factures.</p>`
          },
          {
            legal_label: 'Régime simplifié',
            legal_merit: `<p>Le régime simplifié est intéressant pour les entreprises dont l'activité génère des reversements de TVA. Grâce au système des acomptes, elles bénéficient d'un délai de paiment de plusieurs mois et peuvent placer les sommes sur un support rémunéré.</p>`
          },
          {
            legal_label: 'Réel normal',
            legal_merit: `<p>Le réel normal convient notamment aux entreprises qui veulent s'acquitter au plus vite de leur dette de TVA. Celles qui génèrent des crédits TVA ont aussi intérêt à y opter, afin que ces derniers leur soient remboursés rapidement.</p>`
          }
        ],
        meta_description: ''
      }
    ],
    meta_queries: [
      "Conditions de chiffre d'affaires",
      'Déduction et reversement de la taxe',
      'Remboursement du crédit de TVA',
      'Autres critères de choix'
    ],
    meta_status: ['Franchise', 'Régime simplifié', 'Réel normal']
  }
};

export default legalStatusRankStore;
