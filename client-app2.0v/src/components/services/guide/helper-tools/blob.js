const legalStatusRankStore = {
  single_creator: {
    meta_data: [
      {
        meta_label: 'Nombre de participants et évolution possible',
        status: [
          {
            legal_label: 'Entreprise individuelle',
            rank: 1,
            legal_merit: `<p>L'entreprise individuelle ne comprend qu'un <strong style="color:#fe6116">seul participant, sans évolution possible</strong>. Pour accueillir un nouvel associé, il sera nécessaire de constituer une société.</p>`
          },
          {
            legal_label: 'EURL',
            rank: 3,
            legal_merit: `<p>Une EURL a un <strong style="color:#fe6116">seul associé</strong> mais vous aurez la possibilité de <strong style="color:#fe6116">passer en SARL</strong> si vous comptez accueillir un ou plusieurs nouveaux associés.</p>`
          },
          {
            legal_label: 'SASU',
            rank: 3,
            legal_merit: `<p>Une SASU a un seul associé mais vous aurez la possibilité de <strong style="color:#fe6116">passer en SAS</strong> si vous comptez accueillir un ou plusieurs nouveaux associés.</p>`
          }
        ],
        meta_description:
          "Les formes juridiques d'entreprise présentées dans cet outil s'adressent aux entrepreneurs qui créent leur entreprise seuls. Toutefois, certains statuts pourront vous permettre d'accueillir des associés ultérieurement."
      },
      {
        meta_label: "Statut du chef d'entreprise",
        status: [
          {
            legal_label: 'Entreprise individuelle',
            rank: 1,
            legal_merit: `<p>Le chef d'entreprise a le statut <strong style="color:#fe6116">d'entrepreneur individuel</strong>. Il doit être une personne physique obligatoirement. Il est impossible de le remplacer. Sous cette forme juridique, il n'y a pas de notion d'associé et de dirigeant, il n'y a que l'entrepreneur individuel : il représente l'entreprise et il y a une confusion entre leurs patrimoines. </p>`
          },
          {
            legal_label: 'EURL',
            rank: 2,
            legal_merit: `<p>Le chef d'entreprise est le <strong style="color:#fe6116">gérant</strong> de la société. Seule une personne physique, associée ou non, peut être nommée à ce poste. Il est impossible de nommer une société gérante. Sur décision de l'associé unique, le gérant peut être remplacé par une autre personne physique.</p>
          <p>Ensuite, la société a un <strong style="color:#fe6116">associé unique</strong>. Il n'est pas obligatoire d'être gérant associé unique, deux personnes différentes peuvent occuper ces fonctions. Contrairement au gérant, l'associé unique peut être une personne morale (c'est-à-dire une autre société). </p>
          `
          },
          {
            legal_label: 'SASU',
            rank: 3,
            legal_merit: `
          <p>Le chef d'entreprise a le statut de <strong style="color:#fe6116">président</strong>. Il peut s'agir d'une personne physique ou d'une personne morale, associée ou non. Sur décision de l'associé unique, le président peut être remplacé par une autre personne (physique ou morale).</p>
          <p>Ensuite, la société a un <strong style="color:#fe6116">associé unique</strong>. Il n'est pas obligatoire d'être président associé unique, deux personnes différentes peuvent occuper ces fonctions. Comme le président, l'associé unique peut être une personne physique ou une personne morale. </p>
          `
          }
        ],
        meta_description:
          "Vous pouvez, en tant que créateur, avoir le pouvoir de représenter votre entreprise et/ou celui d'en être propriétaire. Ces prérogatives peuvent être regroupées ou scindées, de façon plus ou moins souple, en fonction du statut juridique que vous allez choisir."
      },
      {
        meta_label: "Statut du conjoint du chef d'entreprise",
        status: [
          {
            legal_label: 'Entreprise individuelle',
            rank: 2,
            legal_merit: `<p>Votre conjoint peut occuper deux rôles au sein de votre entreprise individuelle : être <strong style="color:#fe6116">salarié</strong> ou être <strong style="color:#fe6116">conjoint collaborateur</strong>.</p>`
          },
          {
            legal_label: 'EURL',
            rank: 3,
            legal_merit: `<p>Votre conjoint peut occuper trois rôles au sein de votre entreprise : être <strong style="color:#fe6116">salarié</strong>, être <strong style="color:#fe6116">associé</strong> (passage en SARL nécessaire) ou être <strong style="color:#fe6116">conjoint collaborateur</strong>.</p>`
          },
          {
            legal_label: 'SASU',
            rank: 2,
            legal_merit: `<p>Votre conjoint peut occuper deux rôles au sein de votre entreprise : être <strong style="color:#fe6116">salarié</strong> ou être <strong style="color:#fe6116">associé</strong> (passage en SAS nécessaire).</p>`
          }
        ],
        meta_description:
          "Si vous comptez lancer votre activité professionnelle en faisant participer votre conjoint, vous disposez de plusieurs options pour l'intégrer à votre projet (conjoint associé, conjoint collaborateur, conjoint salarié). Ces possibilités dépendent de la forme juridique de votre entreprise. "
      },
      {
        meta_label: "Réalisation des apports dans l'entreprise",
        status: [
          {
            legal_label: 'Entreprise individuelle',
            rank: 2,
            legal_merit: `<p>Vous pouvez <strong style="color:#fe6116">apporter librement des fonds et des moyens</strong> dans votre entreprise individuelle. Ces fonds pourront également être récupérés librement par la suite. Une entreprise individuelle n'a pas de patrimoine propre. Le patrimoine personnel de l'entrepreneur et celui de l'entreprise sont confondus. </p>`
          },
          {
            legal_label: 'EURL',
            rank: 3,
            legal_merit: `<p>L'entrepreneur doit <strong style="color:#fe6116">consacrer un capital</strong> à sa société. Ce capital social peut être composé d'apports en numéraire (argent) et/ou d'apports en nature (biens autres que de l'argent), aucun minimum n'est requis. La réalisation des apports en capital est encadrée, et ils ne peuvent pas être récupérés. </p>
          <p>Il est également possible d'effectuer des apports en <strong style="color:#fe6116">compte courant d'associé</strong>. Ces apports seront récupérables par la suite. </p>`
          },
          {
            legal_label: 'SASU',
            rank: 2,
            legal_merit: `<p>L'entrepreneur doit <strong style="color:#fe6116">consacrer un capital</strong> à sa société. Ce capital social peut être composé d'apports en numéraire (argent) et/ou d'apports en nature (biens autres que de l'argent), aucun minimum n'est requis. La réalisation des apports en capital est encadrée, et ils ne peuvent pas être récupérés. </p>
           <p>Il est aussi possible d'effectuer des apports en <strong style="color:#fe6116">compte courant d'associé</strong>. Ces apports seront récupérables par la suite. </p>`
          }
        ],
        meta_description:
          "Vous aurez besoin d'injecter des fonds, et même parfois d'autres moyens (du matériel, un véhicule...), pour créer votre entreprise et lancer votre activité. Les modalités de réalisation de ces apports dépendent de la forme juridique que vous avez choisie pour votre entreprise."
      },
      {
        meta_label: 'Responsabilité et protection de votre patrimoine personnel',
        status: [
          {
            legal_label: 'Entreprise individuelle',
            rank: 1,
            legal_merit: `<p>Votre responsabilité est <strong style="color:#fe6116">totale et indéfinie</strong> envers vos créanciers professionnels, cela signifie que vos biens personnels, à l'exception de votre résidence principale, sont saisissables. L'option pour l'EIRL peut toutefois vous permettre de limiter cette responsabilité à hauteur du patrimoine affecté à l'entreprise.</p>`
          },
          {
            legal_label: 'EURL',
            rank: 3,
            legal_merit: `<p>Votre responsabilité est <strong style="color:#fe6116">limitée au montant de vos apports</strong>, cela signifie que le risque de perte se limite au montant de vos apports dans la société. Ce principe comporte des exceptions (par exemple, si vous vous portez garant à titre personnel, ou en cas de faute de gestion ayant entrainé la liquidation judiciaire de votre société).</p>`
          },
          {
            legal_label: 'SASU',
            rank: 3,
            legal_merit: `<p>Votre responsabilité est <strong style="color:#fe6116">limitée au montant de vos apports</strong>, cela signifie que le risque de perte se limite au montant de vos apports dans la société. Ce principe comporte des exceptions (par exemple, si vous vous portez garant à titre personnel, ou en cas de faute de gestion ayant entrainé la liquidation judiciaire de votre société).</p>`
          }
        ],
        meta_description:
          "En tant que créateur d'entreprise, vous engagez votre responsabilité envers vos créanciers professionnels dans le cadre de votre projet. Votre responsabilité sera plus ou moins étendue selon la forme juridique de votre entreprise."
      },
      {
        meta_label: "Formalités de création d'entreprise",
        status: [
          {
            legal_label: 'Entreprise individuelle',
            rank: 3,
            legal_merit: `<p>Les démarches sont <strong style="color:#fe6116">simples</strong>, <strong style="color:#fe6116">rapides</strong> et peu <strong style="color:#fe6116">coûteuses</strong>. Pour créer une entreprise individuelle, il faut compléter une déclaration d'activité (P0), faire une déclaration d'affectation du patrimoine (pour les EIRL), réunir tous les justificatifs et envoyer le dossier au greffe.</p>`
          },
          {
            legal_label: 'EURL',
            rank: 2,
            legal_merit: `<p>Les formalités sont <strong style="color:#fe6116">nombreuses</strong> et peuvent être <strong style="color:#fe6116">compliquées</strong> à gérer seul. Elles sont également plus <strong style="color:#fe6116">coûteuses</strong>. Pour créer une EURL, il faut rédiger les statuts de la société, réaliser les apports en capital social, publier un avis de constitution dans un journal d'annonces légales, compléter un formulaire M0, réunir tous les justificatifs et envoyer le dossier au greffe.</p>`
          },
          {
            legal_label: 'SASU',
            rank: 2,
            legal_merit: `<p>Les formalités sont <strong style="color:#fe6116">nombreuses</strong> et peuvent être <strong style="color:#fe6116">compliquées</strong> à gérer seul. Elles sont également plus <strong style="color:#fe6116">coûteuses</strong>. Pour créer une SASU, il faut rédiger les statuts de la société, réaliser les apports en capital social, publier un avis de constitution dans un journal d'annonces légales, compléter un formulaire M0, réunir tous les justificatifs et envoyer le dossier au greffe.</p>`
          }
        ],
        meta_description:
          "Vous devez, pour donner une existence légale à votre entreprise et obtenir votre numéro SIREN, accomplir des formalités et déposer une demande d'immatriculation au greffe. La complexité et le coût de ces dernières dépendent de la forme juridique de votre entreprise."
      },
      {
        meta_label: "Gestion juridique de l'entreprise",
        status: [
          {
            legal_label: 'Entreprise individuelle',
            rank: 3,
            legal_merit: `<p>Le fonctionnement de l'entreprise est <strong style="color:#fe6116">très simple</strong>. Vous prenez vos décisions sans avoir besoin de les formaliser. Des inscriptions modificatives au greffe sont nécessaires lorsque vous effectuez certains changements (changement d'adresse, ajout d'un nom commercial, modification de l'activité...). </p>`
          },
          {
            legal_label: 'EURL',
            rank: 2,
            legal_merit: `<p>En EURL, des <strong style="color:#fe6116">processus juridiques</strong> génèrent de <strong style="color:#fe6116">nombreuses formalités</strong>, indispensables au fonctionnement de la société. Chaque année, il faut approuver les comptes et affecter les bénéfices. Ensuite, l'associé unique doit prendre des décisions par écrit, qui doivent être retranscrites dans un procès-verbal. Des formalités légales sont nécessaires à chaque mise à jour des statuts. Elles génèrent des frais.</p>`
          },
          {
            legal_label: 'SASU',
            rank: 2,
            legal_merit: `<p>En SASU, des <strong style="color:#fe6116">processus juridiques</strong> génèrent de <strong style="color:#fe6116">nombreuses formalités</strong>, indispensables au fonctionnement de la société. Chaque année, il faut approuver les comptes et affecter les bénéfices. Ensuite, l'associé unique doit prendre des décisions par écrit, qui doivent être retranscrites dans un procès-verbal. Des formalités légales sont nécessaires à chaque mise à jour des statuts. Elles génèrent des frais.</p>`
          }
        ],
        meta_description:
          "Pour faire fonctionner votre entreprise, des formalités juridiques et administratives sont nécessaires (pour prendre des décisions, pour modifier ses caractéristiques, pour fermer l'entreprise...). Leur complexité dépend de la forme juridique de l'entreprise."
      },
      {
        meta_label: "Fermeture de l'entreprise",
        status: [
          {
            legal_label: 'Entreprise individuelle',
            rank: 3,
            legal_merit: `<p>Les formalités de fermeture sont <strong style="color:#fe6116">très simples et peu coûteuses</strong>. Il suffit de transmettre une déclaration de radiation au greffe. L'entreprise individuelle est idéale pour tester un projet si vous n'avez pas vraiment de certitudes quant à ses chances de réussite et que les enjeux financiers sont peu importants.</p>`
          },
          {
            legal_label: 'EURL',
            rank: 1,
            legal_merit: `<p>La fermeture d'une EURL est <strong style="color:#fe6116">complexe</strong> et <strong style="color:#fe6116">coûteuse</strong>, il faut procéder à la dissolution de la société, puis à sa liquidation. Deux annonces légales doivent être publiées et deux dossiers déposés au greffe du tribunal de commerce.</p>`
          },
          {
            legal_label: 'SASU',
            rank: 1,
            legal_merit: `<p>La fermeture d'une SASU est <strong style="color:#fe6116">complexe</strong> et <strong style="color:#fe6116">coûteuse</strong>, il faut procéder à la dissolution de la société, puis à sa liquidation. Deux annonces légales doivent être publiées et deux dossiers déposés au greffe du tribunal de commerce.</p>`
          }
        ],
        meta_description:
          "En cas d'échec du projet de création d'entreprise, vous devrez obligatoirement fermer l'entreprise. La complexité et le coût de la procédure à suivre dépendent du statut juridique que vous avez choisi."
      },
      {
        meta_label: "Imposition des bénéfices de l'entreprise",
        status: [
          {
            legal_label: 'Entreprise individuelle',
            rank: 1,
            legal_merit: `<p>Vos bénéfices professionnels sont imposés à <strong style="color:#fe6116">I'impôt sur le revenu</strong>, dans la catégorie des bénéfices industriels et commerciaux (BIC) ou des bénéfices non-commerciaux (BNC). Ici, c'est vous qui allez payer l'impôt. En EIRL, une option pour l'imposition à l'impôt sur les sociétés est possible. Cela implique d'avoir préalablement opté pour ce régime. </p>`
          },
          {
            legal_label: 'EURL',
            rank: 3,
            legal_merit: `<p>En EURL, vous avez le <strong style="color:#fe6116">choix</strong> entre les deux régimes d'impositions des bénéfices (impôt sur le revenu ou impôt sur les sociétés). Par défaut, c'est <strong style="color:#fe6116">l'impôt sur le revenu</strong> qui s'applique et pour une durée illimitée. Une option pour l'imposition à <strong style="color:#fe6116">l'impôt sur les sociétés</strong> est toutefois possible.</p>`
          },
          {
            legal_label: 'SASU',
            rank: 2,
            legal_merit: `<p>Les bénéfices d'une SASU sont imposés à <strong style="color:#fe6116">l'impôt sur les sociétés</strong>. Une option pour l'imposition des bénéfices à <strong style="color:#fe6116">l'impôt sur le revenu</strong> est possible pendant <strong style="color:#fe6116">5 exercices</strong> maximum. À l'issue de ce délai, l'impôt sur les sociétés s'applique. </p>`
          }
        ],
        meta_description:
          "Les bénéfices réalisés par une entreprise font l'objet d'une imposition fiscale particulière. Deux systèmes d'imposition existent : l'impôt sur les sociétés (taxation des bénéfices au niveau de l'entreprise) ou l'impôt sur le revenu (taxation des bénéfices entre les mains des associés, et non de l'entreprise). Les possibilités en matière de choix du régime d'imposition des bénéfices dépendent de la forme juridique de de votre entreprise. "
      },
      {
        meta_label: 'Accès au régime fiscal de la micro-entreprise',
        status: [
          {
            legal_label: 'Entreprise individuelle',
            rank: 3,
            legal_merit: `<p>Il est <strong style="color:#fe6116">possible</strong> de bénéficier du régime fiscal de la micro-entreprise, à condition de respecter les seuils de recettes prévues dans le micro-BIC ou le micro-BNC.</p>`
          },
          {
            legal_label: 'EURL',
            rank: 2,
            legal_merit: `<p>Les EURL soumise à l'impôt sur le revenu dont le gérant est également associé unique <strong style="color:#fe6116">peuvent opter</strong> pour le régime de la micro-entreprise. Elles doivent également respecter les seuils de recettes du régime en fonction de la nature de l'activité exercée (commerciale, artisanale ou libérale).</p>`
          },
          {
            legal_label: 'SASU',
            rank: 1,
            legal_merit: `<p>Il est <strong style="color:#fe6116">impossible</strong> de bénéficier du régime fiscal de la micro-entreprise dans le cadre d'une SASU.</p>`
          }
        ],
        meta_description:
          "La micro-entreprise n'est pas une forme juridique d'entreprise. Il s'agit d'un régime fiscal ouvert aux entreprises individuelles et à certaines EURL de petites tailles. Ce régime peut vous permettre d'exercer votre activité en bénéficiant de nombreux allégements déclaratifs."
      },
      {
        meta_label: "Sécurité sociale de l'entrepreneur",
        status: [
          {
            legal_label: 'Entreprise individuelle',
            rank: 1,
            legal_merit: `<p>Vous serez <strong style="color:#fe6116">affilié à la sécurité sociale des indépendants</strong> dès la création de votre entreprise. Vous serez redevable de cotisations sociales même en l'absence de bénéfices. Le poids de vos cotisations sociales représente approximativement <strong style="color:#fe6116">40 à 45%</strong> de vos revenus. Cette base de calcul correspond aux bénéfices professionnels, à l'exception des EIRL à l'IS qui fonctionnent comme les EURL.</p>`
          },
          {
            legal_label: 'EURL',
            rank: 3,
            legal_merit: `<p>Vous serez affilié à la <strong style="color:#fe6116">sécurité sociale des indépendants</strong> dès la création de votre entreprise. Vous serez redevable de cotisations sociales même en l'absence de rémunérations. Le poids des charges sociales représente approximativement <strong style="color:#fe6116">40 à 45%</strong> du revenu déclaré. Ce dernier correspond aux bénéfices professionnels (EURL à l'IR), ou aux rémunérations et à une partie des dividendes (EURL à l'IS dont le gérant est aussi l'associé unique).  </p>`
          },
          {
            legal_label: 'SASU',
            rank: 2,
            legal_merit: `<p>Vous serez affilié au <strong style="color:#fe6116">régime général de la sécurité sociale</strong> à partir du moment où vous vous verserez des rémunérations. En l'absence de rémunération, vous ne payez pas de cotisations sociales. Le poids des charges sociales représente approximativement <strong style="color:#fe6116">80 à 85%</strong> des revenus nets perçus. Ces derniers correspondent uniquement aux rémunérations perçues, peu importe le régime fiscal de la société. Les dividendes échappent aux cotisations sociales. </p>`
          }
        ],
        meta_description:
          'Le régime de sécurité sociale dont vous allez bénéficier dépend de la forme juridique de votre entreprise. Il existe deux possibilités : le régime général de la sécurité sociale (celui applicables aux salariés, à quelques différences près) et la sécurité sociale des indépendants (SSI).'
      },
      {
        meta_label: 'Formalisme lié aux rémunérations',
        status: [
          {
            legal_label: 'Entreprise individuelle',
            rank: 3,
            legal_merit: `<p>Le chef d'entreprise peut percevoir la rémunération qu'il souhaite. <strong style="color:#fe6116">Aucun formalisme</strong> ne doit être respecté à ce sujet et il n'existe pas de limite spécifique. Les revenus doivent être <strong style="color:#fe6116">déclarés une fois par an</strong> aux organismes sociaux.</p>`
          },
          {
            legal_label: 'EURL',
            rank: 2,
            legal_merit: `<p>La rémunération du gérant doit être <strong style="color:#fe6116">validée</strong> par l'associé unique et actée dans un procès-verbal. Le gérant ne peut percevoir que les sommes prévues. Par la suite, aucune fiche de paie ne doit être établie. Les revenus doivent être <strong style="color:#fe6116">déclarés une fois par an</strong> seulement aux organismes sociaux.</p>`
          },
          {
            legal_label: 'SASU',
            rank: 1,
            legal_merit: `<p>La rémunération du président est <strong style="color:#fe6116">prévue</strong> par l'associé unique. Un procès-verbal doit être rédigé à cet effet. Des <strong style="color:#fe6116">fiches de paie</strong> doivent être établies chaque mois ainsi que des <strong style="color:#fe6116">déclarations sociales nominatives</strong> (DSN)</p>`
          }
        ],
        meta_description:
          "Les rémunérations octroyées au dirigeant sont plus ou moins faciles à lui verser selon le statut de l'entreprise. Parfois, un formalisme assez contraignant doit être respecté."
      },
      {
        meta_label: 'Optimisation fiscale des revenus',
        status: [
          {
            legal_label: 'Entreprise individuelle',
            rank: 1,
            legal_merit: `<p>L'entreprise individuelle ne laisse <strong style="color:#fe6116">aucune marge de manoeuvre</strong> à ce niveau. Vous serez taxé sur l'intégralité du bénéfice, même si vous n'avez pas perçu, à titre personnel, les sommes d'argent correspondantes. Les bénéfices seront imposés à l'impôt sur le revenu, sans abattement, dans la catégorie des bénéfices industriels et commerciaux (BIC) ou non-commerciaux (BNC).</p>`
          },
          {
            legal_label: 'EURL',
            rank: 2,
            legal_merit: `<p>L'EURL apporte une <strong style="color:#fe6116">marge de manoeuvre limitée</strong> à ce niveau. Vous pouvez arbitrer entre votre rémunération et des dividendes pour abaisser le montant de votre imposition fiscale personnelle, si vous êtes gérant associé unique. Les rémunérations bénéficient d'un abattement de 10% avant d'être soumises au barème de l'impôt sur le revenu. Les dividendes peuvent, quant à eux, supporter la flat'tax de 30% (mais ils sont soumis aux charges sociales...).</p>`
          },
          {
            legal_label: 'SASU',
            rank: 3,
            legal_merit: `<p>La SASU confère le plus de <strong style="color:#fe6116">flexibilité</strong> en matière d'optimisation fiscale. La rémunération du président est fiscalement assimilée à des salaires (abattement de 10%). Les dividendes, servis à l'associé unique, peuvent bénéficier de la flat'tax de 30% en sachant que, contrairement à l'EURL, ils ne supportent pas les cotisations sociales mais auront subit, préalablement à leur distribution, l'impôt sur les sociétés.</p>`
          }
        ],
        meta_description:
          "Les revenus que vous allez percevoir vont être taxés différemment entre vos mains selon la forme juridique et le régime fiscal de votre entreprise. Des arbitrages peuvent vous permettre d'optimiser l'impôt à payer."
      },
      {
        meta_label: 'Distributions de dividendes',
        status: [
          {
            legal_label: 'Entreprise individuelle',
            rank: 1,
            legal_merit: `<p>Il est <strong style="color:#fe6116">impossible</strong> de distribuer des dividendes, sauf pour les EIRL à l'impôt sur les sociétés. La quote-part des dividendes qui excède 10% du montant du patrimoine affecté est soumise aux <strong style="color:#fe6116">cotisations sociales</strong>. </p>`
          },
          {
            legal_label: 'EURL',
            rank: 2,
            legal_merit: `<p>Une EURL à l'impôt sur les sociétés peut <strong style="color:#fe6116">distribuer des dividendes</strong>. Si le gérant est aussi l'associé unique, la quote-part des dividendes qui excède 10% du total formé par le capital social, les primes d'émission et les apports en compte courant d'associé est soumise aux <strong style="color:#fe6116">cotisations sociales</strong>.</p>`
          },
          {
            legal_label: 'SASU',
            rank: 3,
            legal_merit: `<p>Une SASU à l'impôt sur les sociétés peut <strong style="color:#fe6116">distribuer des dividendes</strong> à son associé unique. Ceux-ci ne sont pas soumis aux cotisations sociales, quel que soit leur montant. </p>`
          }
        ],
        meta_description:
          "Les entreprises qui relèvent de l'impôt sur les sociétés, et qui ont des bénéfices distribuables, peuvent verser des dividendes à leurs associés. Les dividendes ne constituent pas des rémunérations, il s'agit de revenus de capitaux mobiliers (revenus du capital). "
      },
      {
        meta_label: "Maintien des allocations d'aide au retour à l'emploi",
        status: [
          {
            legal_label: 'Entreprise individuelle',
            rank: 1,
            legal_merit: `<p>Il est <strong style="color:#fe6116">impossible</strong> de conserver le versement mensuel de <strong style="color:#fe6116">l'intégralité de vos allocations</strong> car vos revenus ne sont pas connus. Pôle emploi vous versera, à titre d'acompte, <strong style="color:#fe6116">70%</strong> du montant de votre allocation mensuelle. Lorsque vous revenus seront connus (votre bénéfice professionnel), une <strong style="color:#fe6116">régularisation</strong> sera effectuée.</p>`
          },
          {
            legal_label: 'EURL',
            rank: 2,
            legal_merit: `<p>Il est <strong style="color:#fe6116">possible</strong> de conserver le versement de <strong style="color:#fe6116">l'intégralité de vos allocations</strong> si vous ne percevez aucune rémunération et que vous choisissez le régime de l'impôt sur les sociétés. Les <strong style="color:#fe6116">dividendes</strong> ont, lorsqu'ils sont soumis aux cotisations sociales, un <strong style="color:#fe6116">impact sur votre indemnisation</strong>. De plus, si vous percevez une rémunération, il conviendra de la déclarer puis Pôle emploi déterminera le montant des allocations auxquelles vous auriez encore droit. </p>
            <p>En cas d'imposition à l'impôt sur le revenu, Pôle emploi vous versera, à titre d'acompte, <strong style="color:#fe6116">70%</strong> du montant de votre allocation mensuelle. Lorsque vous revenus seront connus (votre bénéfice professionnel), une <strong style="color:#fe6116">régularisation</strong> sera ensuite effectuée. </p>`
          },
          {
            legal_label: 'SASU',
            rank: 3,
            legal_merit: `<p>Il est <strong style="color:#fe6116">possible</strong> de conserver le versement de <strong style="color:#fe6116">l'intégralité de vos allocations</strong> si vous ne percevez aucune rémunération et que vous choisissez le régime de l'impôt sur les sociétés. Le versement de <strong style="color:#fe6116">dividendes</strong> n'a, ici, <strong style="color:#fe6116">aucun impact sur votre indemnisation</strong>. Par contre, si vous percevez une rémunération, il conviendra de la déclarer puis Pôle emploi déterminera le montant des éventuelles allocations auxquelles vous auriez éventuellement encore droit. </p>
            <p>En cas d'imposition à l'impôt sur le revenu, Pôle emploi vous versera, à titre d'acompte, <strong style="color:#fe6116">70%</strong> du montant de votre allocation mensuelle. Lorsque vous revenus seront connus (votre bénéfice professionnel), une <strong style="color:#fe6116">régularisation</strong> sera ensuite effectuée. </p>`
          }
        ],
        meta_description:
          "Une personne en cours d'indemnisation chômage a la possibilité de bénéficier d'un maintien du versement de ses allocations après la création de son entreprise. Il s'agit d'un dispositif d'aide Pôle emploi pour soutenir les créateurs et repreneurs d'entreprises.  "
      }
    ],
    meta_queries: [
      'Nombre de participants et évolution possible',
      "Statut du chef d'entreprise",
      "Statut du conjoint du chef d'entreprise",
      "Réalisation des apports dans l'entreprise",
      'Responsabilité et protection de votre patrimoine personnel',
      "Formalités de création d'entreprise",
      "Gestion juridique de l'entreprise",
      "Fermeture de l'entreprise",
      "Imposition des bénéfices de l'entreprise",
      'Accès au régime fiscal de la micro-entreprise',
      "Sécurité sociale de l'entrepreneur",
      'Formalisme lié aux rémunérations',
      'Optimisation fiscale des revenus',
      'Distributions de dividendes',
      "Maintien des allocations d'aide au retour à l'emploi"
    ],
    meta_status: ['Entreprise individuelle', 'EURL', 'SASU']
  },
  multiple_creator: {
    meta_data: [
      {
        meta_label: "Nombre d'associés et évolution",
        status: [
          {
            legal_label: 'SARL',
            rank: 2,
            legal_merit: `<p>Une SARL doit avoir au moins 1 associé (dans ce cas, il s'agit d'une EURL) et <strong style="color:#fe6116">au maximum 100 associés</strong>. Elle ne peut en compter plus, sous peine de dissolution.</p>`
          },
          {
            legal_label: 'SAS',
            rank: 3,
            legal_merit: `<p>Une SAS doit avoir au moins 1 associé (dans ce cas, il s'agit d'une SASU). La Loi ne prévoit <strong style="color:#fe6116">pas</strong> un nombre <strong style="color:#fe6116">maximum</strong> d'associés à ne pas dépasser.</p>`
          }
        ],
        meta_description:
          "Une société doit, en principe, réunir au moins 2 associés. Des exceptions existent toujours et des limites peuvent instaurer un nombre d'associés maximum. "
      },
      {
        meta_label: 'Statut du dirigeant',
        status: [
          {
            legal_label: 'SARL',
            rank: 2,
            legal_merit: `<p>Le dirigeant d'une SARL est un <strong style="color:#fe6116">gérant</strong>. Seule une personne physique, associée ou non, peut être nommée à ce poste. Ce sont les associés qui le nomment, dans les statuts ou dans un acte séparé (assemblée générale).
          La société également plusieurs <strong style="color:#fe6116">associés</strong>. Un gérant n'est pas forcément associé, deux personnes différentes peuvent occuper ces fonctions. Contrairement à ce qui est prévu pour la gérance, une personne morale (c'est-à-dire une autre société) peut être associée dans une SARL. </p>`
          },
          {
            legal_label: 'SAS',
            rank: 3,
            legal_merit: `
          <p>Le dirigeant d'une SAS est un <strong style="color:#fe6116">président</strong>. Il peut s'agir d'une personne physique (particulier) ou d'une personne morale (société), associée ou non. Le président peut être remplacé dans les conditions prévues dans les statuts.</p>
          <p>La société a aussi plusieurs <strong style="color:#fe6116">associés</strong>. Le président n'est pas obligatoirement associé de la société : deux personnes différentes peuvent occuper ces fonctions. Les personnes morales, comme les personnes physiques, peuvent être associées d'une SAS. </p>
          `
          }
        ],
        meta_description:
          "Vous pouvez, en tant que créateur, avoir le pouvoir de représenter votre entreprise et/ou celui d'en être propriétaire. Ces prérogatives peuvent être regroupées ou scindées, de façon plus ou moins souple, en fonction du statut juridique que vous allez choisir."
      },
      {
        meta_label: 'Coûts de création de la société',
        status: [
          {
            legal_label: 'SARL',
            rank: 3,
            legal_merit: `<p>En vous débrouillant seul, vous devez prévoir un budget d'environ <strong style="color:#fe6116">235 €</strong> pour créer et immatriculer une SARL. L'intervention d'un <strong style="color:#fe6116">professionnel</strong> pour rédiger les statuts (expert-comptable ou avocat) est souvent <strong style="color:#fe6116">nécessaire</strong>. Un budget d'au moins 1000 euros est à prévoir.</p>`
          },
          {
            legal_label: 'SAS',
            rank: 1,
            legal_merit: `<p>Pour créer une SAS sans l'aide d'un professionnel, vous devez prévoir un budget de l'ordre de <strong style="color:#fe6116">300 €</strong>. Cela dit, cette pratique présente certains risques. Il faut, en effet, prévoir de nombreuses clauses dans les statuts et un <strong style="color:#fe6116">accompagnement</strong> par un avocat s'avère généralement <strong style="color:#fe6116">indispensable</strong>. Le budget à prévoir est généralement supérieur à 1 500 €.</p>`
          }
        ],
        meta_description:
          "Pour créer une société, il faut notamment rédiger des statuts, publier une annonce légale et déposer une demande d'immatriculation. Ces formalités ont un coût, dont le montant varie essentiellement selon la solution envisagée en terme d'accompagnement."
      },
      {
        meta_label: 'Statut du conjoint du dirigeant',
        status: [
          {
            legal_label: 'SARL',
            rank: 3,
            legal_merit: `<p>Votre conjoint peut bénéficier de l'un des trois statuts suivants au sein de votre SARL : être <strong style="color:#fe6116">salarié</strong>, être <strong style="color:#fe6116">associé</strong> ou être <strong style="color:#fe6116">conjoint collaborateur</strong>.</p>`
          },
          {
            legal_label: 'SAS',
            rank: 2,
            legal_merit: `<p>Votre conjoint peut bénéficier de l'un des deux statuts suivants au sein de votre SAS : être <strong style="color:#fe6116">salarié</strong> ou être <strong style="color:#fe6116">associé</strong>.</p>`
          }
        ],
        meta_description:
          "Si vous comptez lancer votre activité professionnelle en faisant participer votre conjoint, vous disposez de plusieurs possibilités pour l'intégrer à votre projet (conjoint associé, conjoint collaborateur, conjoint salarié). Les statuts disponibles dépendent de la forme juridique de votre entreprise. "
      },
      {
        meta_label: 'Instauration de droits différents entre les associés',
        status: [
          {
            legal_label: 'SARL',
            rank: 0,
            legal_merit: `<p>Dans une SARL, <strong style="color:#fe6116">tous les associés ont les mêmes droits</strong>. Le capital social se répartit obligatoirement en parts sociales de même catégorie ; il est donc impossible de créer différentes catégories de parts sociales (à droit de vote double par exemple). </p>`
          },
          {
            legal_label: 'SAS',
            rank: 3,
            legal_merit: `<p>Le capital d'une SAS se répartit en actions. Il est possible de créer plusieurs <strong style="color:#fe6116">catégories d'actions</strong>, conférant des <strong style="color:#fe6116">droits différents</strong> à leurs porteurs (exemple : actions à droit de vote double, actions à dividendes prioritaire, etc.). On les appelle des actions de préférence.</p>`
          }
        ],
        meta_description:
          "Le capital des sociétés est divisé en titres, appelés des parts sociales (SARL) ou des actions (SAS). Des règles spécifiques s'appliquent pour chaque société, avec la possibilité - ou non - de créer des catégories de titres auxquelles sont attachés des droits différents pour les associés."
      },
      {
        meta_label: "Liberté d'organisation et souplesse de fonctionnement",
        status: [
          {
            legal_label: 'SARL',
            rank: 1,
            legal_merit: `<p>Le <strong style="color:#fe6116">fonctionnement</strong> d'une SARL est assez <strong style="color:#fe6116">rigide</strong>. La plupart des règles sont édictées par le Code de Commerce. Elles permettent de bénéficier d'un cadre plutôt sécurisant mais ne laissent que très <strong style="color:#fe6116">peu de marges de manoeuvre</strong> aux associés pour organiser librement le fonctionnement de leur société.</p>`
          },
          {
            legal_label: 'SAS',
            rank: 3,
            legal_merit: `<p>La Loi <strong style="color:#fe6116">encadre très peu</strong> le fonctionnement d'une SAS. Le Code de Commerce impose simplement une délibération des associés pour certains types de décisions (approbation des comptes, dissolution, transformation...). Pour le reste, ces derniers jouissent d'une grande <strong style="color:#fe6116">liberté</strong>. Ils doivent toutefois <strong style="color:#fe6116">prévoir les règles</strong> applicables dans les <strong style="color:#fe6116">statuts</strong> de la société.</p>`
          }
        ],
        meta_description:
          "Les dispositions légales encadrent de façon plus ou moins stricte le fonctionnement des sociétés, en fonction de leur forme juridique. Parfois, elles laissent une importante liberté aux statuts. Cette flexibilité n'est toutefois pas sans risque, car elle implique d'être complet dans la rédaction de ces derniers."
      },
      {
        meta_label: "Imposition des bénéfices de l'entreprise",
        status: [
          {
            legal_label: 'SARL',
            rank: 3,
            legal_merit: `<p>Les bénéfices d'une SARL sont taxés, en principe, à <strong style="color:#fe6116">l'impôt sur les sociétés</strong>. Toutefois, les SARL constituées entre membres d'une même famille peuvent opter pour l'impôt sur le revenu, pour une durée illimitée (SARL dites <strong style="color:#fe6116">de famille</strong>). Pour les autres, une option pour l'impôt sur le revenu est possible, mais elle ne dure que 5 ans maximum. Passé ce délai, c'est l'impôt sur les sociétés qui s'applique.</p>`
          },
          {
            legal_label: 'SAS',
            rank: 2,
            legal_merit: `<p>Les bénéfices d'une SAS sont taxés de plein droit à <strong style="color:#fe6116">l'impôt sur les sociétés</strong>. Une option pour l'impôt sur le revenu est possible, mais elle ne peut dépasser 5 années. A la fin de ce délai, c'est l'impôt sur les sociétés qui s'applique.</p>`
          }
        ],
        meta_description:
          "Les bénéfices réalisés supportent une imposition fiscale particulière. Deux systèmes d'imposition existent : l'impôt sur les sociétés (taxation des bénéfices au niveau de votre société) ou l'impôt sur le revenu (ce n'est pas la société mais vous qui allez payer l'impôt). Les possibilités en matière de choix du régime d'imposition des bénéfices dépendent de la forme juridique de votre entreprise. "
      },
      {
        meta_label: 'Cadre juridique et fiscal des cessions de titres',
        status: [
          {
            legal_label: 'SARL',
            rank: 2,
            legal_merit: `<p>Les <strong style="color:#fe6116">cessions de parts sociales</strong> de SARL sont obligatoirement soumises à <strong style="color:#fe6116">l'agrément des associés</strong> lorsque la vente est consentie à un tiers, c'est-à-dire à une personne non-associée. Elles sont soumises à un droit de <strong style="color:#fe6116">3%</strong> après application d'un abattement de 23 000 € (pour la totalité du capital - à proporatiser selon la quantité cédée).</p>`
          },
          {
            legal_label: 'SAS',
            rank: 3,
            legal_merit: `<p>Les <strong style="color:#fe6116">cessions</strong> d'actions de SAS sont, en principe, <strong style="color:#fe6116">libres</strong>. Toutefois, les statuts peuvent contenir une clause d'agrément imposant l'accord des associés avant la réalisation de l'opération. Les droits de mutation dus s'élèvent à <strong style="color:#fe6116">0,10%</strong> de la valeur des actions cédées.</p>`
          }
        ],
        meta_description:
          "Les cessions de titres (parts sociales ou actions) obéissent à des règles juridiques particulières, propres à la forme juridique de l'entreprise. Par ailleurs, les taux des droits d'enregistrement diffèrent, dans les mêmes conditions."
      },
      {
        meta_label: 'Sécurité sociale du dirigeant',
        status: [
          {
            legal_label: 'SARL',
            rank: 3,
            legal_merit: `
          <p>Si le gérant détient plus de la moitié du capital de la SARL (50% + 1 part sociale), il est considéré comme un gérant <strong style="color:#fe6116">majoritaire</strong>. Il est affilié à la <strong style="color:#fe6116">sécurité sociale des indépendants</strong> et sera redevable de cotisations sociales même en l'absence de rémunérations. Le poids de celles-ci représente approximativement <strong style="color:#fe6116">40 à 45%</strong> de son revenu net. Ce dernier correspond aux bénéfices professionnels (SARL à l'IR), ou aux rémunérations et à une partie des dividendes (SARL à l'IS)</p>
          <p> Attention, il faut aussi tenir compte des parts sociales du conjoint, partenaire pacsé(e) et des enfants mineurs. En cas de pluralité de gérants, il faut aditionner les participations de chacun pour apprécier le caractère majoritaire de la gérance. Autrement, si les gérants détiennent 50% ou moins du capital, ils relèveront du <strong style="color:#fe6116">régime général de la sécurité sociale</strong>, comme le président de SAS.</p>
          `
          },
          {
            legal_label: 'SAS',
            rank: 2,
            legal_merit: `<p>Le président d'une SAS est systématiquement affilié au <strong style="color:#fe6116">régime général de la sécurité sociale</strong>. En l'absence de rémunération, aucune cotisation sociale ne doit être payée. Le poids des cotisations sociales est très important : il représente approximativement <strong style="color:#fe6116">80 à 85%</strong> des revenus nets perçus. Cette base de calcul ne comprend toutefois que le montant des rémunérations, peu importe le régime fiscal de la société. Les dividendes ne supportent pas les charges sociales.</p>`
          }
        ],
        meta_description:
          'Le régime de sécurité sociale du dirigeant dépend de la forme juridique de votre entreprise. Il existe deux possibilités : le régime général de la sécurité sociale (applicable également aux salariés, à quelques exceptions près) et la sécurité sociale des indépendants (SSI).'
      },
      {
        meta_label: 'Formalisme lié aux rémunérations des dirigeants',
        status: [
          {
            legal_label: 'SARL',
            rank: 3,
            legal_merit: `<p>La rémunération du gérant doit être validée par les associés, dans les statuts ou dans un acte séparé (procès-verbal d'assemblée générale). Elle ne donne pas lieu à l'établissement de fiches de paie. Les revenus du gérant doivent être <strong style="color:#fe6116">déclarés une fois par an</strong> seulement aux organismes sociaux.</p>`
          },
          {
            legal_label: 'SAS',
            rank: 1,
            legal_merit: `<p>La rémunération du président est décidée par les associés, dans les statuts ou dans un acte séparé. Des <strong style="color:#fe6116">fiches de paie</strong> doivent être établies chaque mois. Des <strong style="color:#fe6116">déclarations sociales nominatives</strong> (DSN) doivent être télétransmises mensuellement aux organismes sociaux.</p>`
          }
        ],
        meta_description:
          "Les rémunérations octroyées au dirigeant sont plus ou moins faciles à lui verser selon le statut de l'entreprise. Parfois, un formalisme assez contraignant doit être respecté (bulletin de paie, déclaration de charges sociales, etc.)."
      },
      {
        meta_label: 'Optimisation fiscale des revenus',
        status: [
          {
            legal_label: 'SARL',
            rank: 2,
            legal_merit: `<p>La SARL apporte une <strong style="color:#fe6116">marge de manoeuvre limitée</strong> à ce niveau. Vous pouvez arbitrer entre votre rémunération et des dividendes pour abaisser le montant de votre imposition fiscale personnelle, si vous êtes associé et gérant. Les rémunérations bénéficient d'un abattement de 10% avant d'être soumises au barème de l'impôt sur le revenu. Les dividendes peuvent, quant à eux, supporter la flat'tax de 30% (mais ils sont soumis aux charges sociales s'ils sont versés à un associé gérant majoritaire...).</p>`
          },
          {
            legal_label: 'SAS',
            rank: 3,
            legal_merit: `<p>La SAS confère le plus de <strong style="color:#fe6116">flexibilité</strong> en matière d'optimisation fiscale. La rémunération du président est fiscalement assimilée à des salaires (abattement de 10%). Les dividendes, servis aux associés, peuvent bénéficier de la flat'tax de 30% en sachant que, contrairement à la SARL avec une gérance majoritaire, ils ne supportent pas les cotisations sociales. Toutefois, il faut avoir à l'esprit qu'ils auront subi, préalablement à leur distribution, l'impôt sur les sociétés.</p>`
          }
        ],
        meta_description:
          "Les revenus que vous allez percevoir vont être taxés différemment entre vos mains selon la forme juridique et le régime fiscal de l'entreprise. Des arbitrages peuvent permettre d'optimiser l'impôt que vous aurez à payer, notamment pour les associés qui exercent également un mandat social."
      },
      {
        meta_label: 'Distributions de dividendes',
        status: [
          {
            legal_label: 'SARL',
            rank: 1,
            legal_merit: `<p>Une SARL soumise à l'impôt sur les sociétés peut <strong style="color:#fe6116">distribuer des dividendes</strong>. Si l'associé gérant est majoritaire, la quote-part des dividendes qui excède 10% du total formé par le capital social, les primes d'émission et les apports en compte courant d'associé est soumise aux <strong style="color:#fe6116">cotisations sociales</strong>.</p>`
          },
          {
            legal_label: 'SAS',
            rank: 3,
            legal_merit: `<p>Une SAS soumise à l'impôt sur les sociétés peut <strong style="color:#fe6116">distribuer des dividendes</strong>. Ces derniers ne sont pas soumis aux cotisations sociales, quel que soit leur montant ou le bénéficiaire (associé président par exemple). </p>`
          }
        ],
        meta_description:
          "Les entreprises qui relèvent de l'impôt sur les sociétés, et qui ont des bénéfices distribuables, peuvent distribuer des dividendes à leurs associés. Les dividendes ne constituent pas des rémunérations, il s'agit de revenus de capitaux mobiliers."
      },
      {
        meta_label: "Maintien des allocations d'aide au retour à l'emploi",
        status: [
          {
            legal_label: 'SARL',
            rank: 2,
            legal_merit: `<p>Il est <strong style="color:#fe6116">possible</strong> de conserver le versement de <strong style="color:#fe6116">l'intégralité de vos allocations</strong> si vous ne percevez aucune rémunération et que vous choisissez le régime de l'impôt sur les sociétés. Les <strong style="color:#fe6116">dividendes</strong> ont, lorsqu'ils sont soumis aux cotisations sociales, un <strong style="color:#fe6116">impact sur votre indemnisation</strong>. De plus, si vous percevez une rémunération, il conviendra de la déclarer puis Pôle emploi déterminera le montant des éventuelles allocations auxquelles vous auriez éventuellement encore droit. </p>
          <p>En cas d'imposition à l'impôt sur le revenu, Pôle emploi vous versera, à titre d'acompte, <strong style="color:#fe6116">70%</strong> du montant de votre allocation mensuelle. Lorsque vous revenus seront connus (votre bénéfice professionnel), une <strong style="color:#fe6116">régularisation</strong> sera ensuite effectuée. </p>`
          },
          {
            legal_label: 'SAS',
            rank: 3,
            legal_merit: `
          <p>Il est <strong style="color:#fe6116">possible</strong> de conserver le versement de <strong style="color:#fe6116">l'intégralité de vos allocations</strong> si vous ne percevez aucune rémunération et que vous choisissez le régime de l'impôt sur les sociétés. Le versement de <strong style="color:#fe6116">dividendes</strong> n'a, ici, <strong style="color:#fe6116">aucun impact</strong> sur votre indemnisation. Par contre, si vous percevez une rémunération, il conviendra de la déclarer puis Pôle emploi déterminera le montant des éventuelles allocations auxquelles vous auriez éventuellement encore droit. </p>
          <p>En cas d'imposition à l'impôt sur le revenu, Pôle emploi vous versera, à titre d'acompte, <strong style="color:#fe6116">70%</strong> du montant de votre allocation mensuelle. Lorsque vous revenus seront connus (votre bénéfice professionnel), une <strong style="color:#fe6116">régularisation</strong> sera ensuite effectuée. </p>`
          }
        ],
        meta_description:
          "Une personne en cours d'indemnisation chômage a la possibilité de bénéficier d'un maintien du versement de ses allocations après la création de son entreprise. Il s'agit d'un dispositif d'aide Pôle emploi pour soutenir les créateurs et repreneurs d'entreprises."
      }
    ],
    meta_queries: [
      "Nombre d'associés et évolution",
      'Statut du dirigeant',
      'Coûts de création de la société',
      'Statut du conjoint du dirigeant',
      'Instauration de droits différents entre les associés',
      "Liberté d'organisation et souplesse de fonctionnement",
      "Imposition des bénéfices de l'entreprise",
      'Cadre juridique et fiscal des cessions de titres',
      'Sécurité sociale du dirigeant',
      'Formalisme lié aux rémunérations des dirigeants',
      'Optimisation fiscale des revenus',
      'Distributions de dividendes',
      "Maintien des allocations d'aide au retour à l'emploi"
    ],
    meta_status: ['SARL', 'SAS']
  }
};

export default legalStatusRankStore;
