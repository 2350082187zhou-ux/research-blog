/* Zedong Zhou | Four-language interface | No translation API or data transfer. */
(() => {
  'use strict';
  const supported = ['en', 'zh', 'fr', 'de'];
  const originals = new WeakMap();
  const nav = {
    en: {about:'About',research:'Research',publications:'Publications',blog:'Blog',deadlines:'Security Deadlines',cv:'CV'},
    zh: {about:'关于我',research:'研究方向',publications:'学术论文',blog:'技术博客',deadlines:'会议截稿日',cv:'简历'},
    fr: {about:'À propos',research:'Recherche',publications:'Publications',blog:'Blog',deadlines:'Conférences',cv:'CV'},
    de: {about:'Über mich',research:'Forschung',publications:'Publikationen',blog:'Blog',deadlines:'Konferenztermine',cv:'Lebenslauf'}
  };
  const content = {
    '.page__content > p:first-child': {
      zh:`<strong>欢迎来到我的网站！</strong>`,fr:`<strong>Bienvenue sur mon site !</strong>`,de:`<strong>Willkommen auf meiner Website!</strong>`
    },
    '#about-me': {zh:'关于我',fr:'À propos de moi',de:'Über mich'},
    '#about-me + p': {
      zh:`我于 2025 年毕业于中国安徽省芜湖市的<strong>安徽工程大学</strong>，获得<strong>电气工程及其自动化学士学位</strong>。目前，我在美国<strong>内华达大学里诺分校（UNR）</strong>攻读<strong>计算机科学博士学位</strong>，导师为 <a href="https://www.unr.edu/cse/people/niusen-chen">Niusen Chen 博士</a>。`,
      fr:`J’ai obtenu en 2025 une <strong>licence en génie électrique et automatisation</strong> à l’<strong>Université polytechnique de l’Anhui</strong>, à Wuhu (Chine). Je poursuis actuellement un <strong>doctorat en informatique</strong> à l’<strong>Université du Nevada à Reno (UNR)</strong>, aux États-Unis, sous la direction du <a href="https://www.unr.edu/cse/people/niusen-chen">Dr Niusen Chen</a>.`,
      de:`2025 erwarb ich meinen <strong>Bachelorabschluss in Elektrotechnik und Automatisierung</strong> an der <strong>Anhui Polytechnic University</strong> in Wuhu, China. Derzeit promoviere ich in <strong>Informatik</strong> an der <strong>University of Nevada, Reno (UNR)</strong>, USA, unter der Betreuung von <a href="https://www.unr.edu/cse/people/niusen-chen">Dr. Niusen Chen</a>.`
    },
    '#about-me + p + p': {
      zh:`我的研究兴趣包括<strong>计算机系统安全、操作系统、存储系统、AI 智能体安全和硬件安全</strong>。目前我重点研究高权限 AI 智能体引发的安全风险，评估文件系统、内核和块设备层的主机侧防护机制，并探索更可靠的数据完整性安全边界。`,
      fr:`Mes recherches portent sur la <strong>sécurité des systèmes informatiques, les systèmes d’exploitation, le stockage, la sécurité des agents d’IA et la sécurité matérielle</strong>. J’étudie les risques liés aux agents d’IA disposant de privilèges élevés, j’évalue les protections au niveau du système de fichiers, du noyau et des périphériques de blocs, et j’explore des frontières de confiance plus robustes pour l’intégrité des données.`,
      de:`Meine Forschungsinteressen umfassen <strong>Computersystemsicherheit, Betriebssysteme, Speichersysteme, die Sicherheit von KI-Agenten und Hardwaresicherheit</strong>. Ich untersuche Risiken hochprivilegierter KI-Agenten, evaluiere Schutzmechanismen auf Datei-, Kernel- und Blockgeräteebene und erforsche robustere Vertrauensgrenzen für die Datenintegrität.`
    },
    '#education': {zh:'教育经历',fr:'Formation',de:'Ausbildung'},
    '#university-of-nevada-reno': {zh:'内华达大学里诺分校',fr:'Université du Nevada à Reno',de:'University of Nevada, Reno'},
    '#university-of-nevada-reno + p': {
      zh:`<strong>计算机科学博士（在读）</strong><br>美国内华达州里诺市<br><em>2026 年 9 月至今</em>`,
      fr:`<strong>Doctorat en informatique (en cours)</strong><br>Reno, Nevada, États-Unis<br><em>Depuis septembre 2026</em>`,
      de:`<strong>Promotion in Informatik (laufend)</strong><br>Reno, Nevada, USA<br><em>Seit September 2026</em>`
    },
    '#anhui-polytechnic-university': {zh:'安徽工程大学',fr:'Université polytechnique de l’Anhui',de:'Anhui Polytechnic University'},
    '#anhui-polytechnic-university + p': {
      zh:`<strong>电气工程及其自动化学士</strong><br>中国安徽省芜湖市<br><em>2021 年 9 月—2025 年 6 月 20 日</em>`,
      fr:`<strong>Licence en génie électrique et automatisation</strong><br>Wuhu, Anhui, Chine<br><em>Septembre 2021 – 20 juin 2025</em>`,
      de:`<strong>Bachelor in Elektrotechnik und Automatisierung</strong><br>Wuhu, Anhui, China<br><em>September 2021 – 20. Juni 2025</em>`
    },
    '#undergraduate-research-background': {zh:'本科科研经历',fr:'Recherche pendant la licence',de:'Forschung während des Bachelorstudiums'},
    '#undergraduate-research-background + p': {
      zh:`本科期间，我的研究重点是<strong>智能算法的工程应用</strong>，涉及<strong>视觉惯性 SLAM 与建图</strong>、电池健康状态预测和能源预测。我也学习了<strong>计算机视觉、三维重建</strong>以及<strong>大语言模型（LLM）</strong>的基本概念与应用。这些经历与目前的系统安全及 AI 智能体安全研究相互补充。`,
      fr:`Pendant ma licence, j’ai travaillé sur les <strong>algorithmes intelligents appliqués</strong>, notamment le <strong>SLAM visuo-inertiel et la cartographie</strong>, la prédiction de l’état de santé des batteries et les prévisions énergétiques. Je me suis aussi familiarisé avec la <strong>vision par ordinateur, la reconstruction 3D</strong> et les <strong>grands modèles de langage (LLM)</strong>. Ces acquis complètent mes recherches actuelles en sécurité des systèmes et des agents d’IA.`,
      de:`Im Bachelorstudium befasste ich mich mit <strong>angewandten intelligenten Algorithmen</strong>, insbesondere <strong>visuell-inertialem SLAM und Kartierung</strong>, der Vorhersage des Batteriezustands und Energieprognosen. Außerdem beschäftigte ich mich mit <strong>Computer Vision, 3D-Rekonstruktion</strong> und den Grundlagen <strong>großer Sprachmodelle (LLMs)</strong>. Diese Erfahrungen ergänzen meine heutige Forschung zur System- und KI-Agentensicherheit.`
    },
    '#undergraduate-research-background + p + p': {
      zh:`<a href="https://zhouzedong.top/research/">了解更多我的研究</a>`,fr:`<a href="https://zhouzedong.top/research/">En savoir plus sur mes recherches</a>`,de:`<a href="https://zhouzedong.top/research/">Mehr über meine Forschung erfahren</a>`
    },
    '#research-interests': {zh:'研究兴趣',fr:'Thématiques de recherche',de:'Forschungsinteressen'},
    '#research-interests + ul li:nth-child(1)': {
      zh:`<strong>AI 智能体安全：</strong>研究高权限智能体带来的安全风险，包括未经授权的文件修改和删除。`,
      fr:`<strong>Sécurité des agents d’IA :</strong> risques liés aux agents dotés de privilèges élevés, notamment les modifications et suppressions non autorisées de fichiers.`,
      de:`<strong>Sicherheit von KI-Agenten:</strong> Risiken hochprivilegierter Agenten, insbesondere unbefugte Dateiänderungen und -löschungen.`
    },
    '#research-interests + ul li:nth-child(2)': {
      zh:`<strong>操作系统与内核安全：</strong>Linux 安全机制、访问控制与内核级策略执行。`,
      fr:`<strong>Systèmes d’exploitation et sécurité du noyau :</strong> mécanismes de sécurité Linux, contrôle d’accès et application des politiques au niveau du noyau.`,
      de:`<strong>Betriebssystem- und Kernelsicherheit:</strong> Linux-Sicherheitsmechanismen, Zugriffskontrolle und Durchsetzung im Kernel.`
    },
    '#research-interests + ul li:nth-child(3)': {
      zh:`<strong>存储与硬件安全：</strong>研究超越主机软件栈的数据完整性与安全防护机制。`,
      fr:`<strong>Sécurité du stockage et du matériel :</strong> intégrité des données et mécanismes de protection indépendants de la pile logicielle de l’hôte.`,
      de:`<strong>Speicher- und Hardwaresicherheit:</strong> Datenintegrität und Schutzmechanismen jenseits des Host-Software-Stacks.`
    },
    '#research-interests + ul li:nth-child(4)': {
      zh:`<strong>AI 驱动的安全分析：</strong>机器学习与程序分析在软件安全中的应用。`,
      fr:`<strong>Analyse de sécurité par l’IA :</strong> applications de l’apprentissage automatique et de l’analyse de programmes à la sécurité logicielle.`,
      de:`<strong>KI-gestützte Sicherheitsanalyse:</strong> Einsatz von maschinellem Lernen und Programmanalyse in der Softwaresicherheit.`
    },
    '#selected-research-project': {zh:'代表性研究项目',fr:'Projet de recherche sélectionné',de:'Ausgewähltes Forschungsprojekt'},
    '#when-ai-agents-go-rogue-who-protects-your-files': {
      zh:'当 AI 智能体失控：谁来保护你的文件？',
      fr:'Quand les agents d’IA dérapent : qui protège vos fichiers ?',
      de:'Wenn KI-Agenten außer Kontrolle geraten: Wer schützt Ihre Dateien?'
    },
    '#when-ai-agents-go-rogue-who-protects-your-files + p': {
      zh:`本项目研究：当 AI 智能体拥有 root 权限时，主机控制的防护机制能否保护敏感文件？我评估了软件栈不同层级的防护，包括 <strong>AppArmor</strong>、<strong>eBPF LSM</strong> 和<strong>块层策略执行</strong>，分析主机侧防护的局限，并探索更可靠的数据完整性边界。`,
      fr:`Dans ce projet, j’étudie si les protections contrôlées par l’hôte peuvent sécuriser des fichiers sensibles lorsqu’un agent d’IA dispose des privilèges root. J’évalue <strong>AppArmor</strong>, <strong>eBPF LSM</strong> et les protections <strong>au niveau des blocs</strong> afin de comprendre les limites des mécanismes côté hôte et de rechercher des frontières de confiance plus fortes pour l’intégrité des données.`,
      de:`Dieses Projekt untersucht, ob vom Host kontrollierte Schutzmechanismen sensible Dateien sichern können, wenn ein KI-Agent Root-Rechte besitzt. Ich evaluiere <strong>AppArmor</strong>, <strong>eBPF LSM</strong> und Schutzmaßnahmen <strong>auf Blockgeräteebene</strong>, um die Grenzen hostseitiger Mechanismen und stärkere Vertrauensgrenzen für die Datenintegrität zu erforschen.`
    },
    '#when-ai-agents-go-rogue-who-protects-your-files + p + p': {
      zh:`<em>研究及海报项目；正式论文发表后将在此补充引用信息。</em>`,
      fr:`<em>Projet de recherche et poster ; une référence bibliographique sera ajoutée lorsqu’elle sera disponible.</em>`,
      de:`<em>Forschungs- und Posterprojekt; eine zitierfähige Publikation wird ergänzt, sobald sie verfügbar ist.</em>`
    },
    '#when-ai-agents-go-rogue-who-protects-your-files + p + p + p': {
      zh:'有关我的研究兴趣和项目详情，请参阅<a href="https://zhouzedong.top/research/">研究页面</a>。',
      fr:'Consultez la <a href="https://zhouzedong.top/research/">page Recherche</a> pour en savoir plus sur mes travaux et projets.',
      de:'Weitere Informationen zu meinen Interessen und Projekten finden Sie auf meiner <a href="https://zhouzedong.top/research/">Forschungsseite</a>.'
    },
    '#publications': {zh:'学术成果',fr:'Publications',de:'Publikationen'},
    '#publications + p': {
      zh:`我的论文与预印本涉及高效三维重建、电池健康预测、视觉惯性 SLAM 和电力需求预测。完整论文列表、引用信息及代码链接请见<a href="https://zhouzedong.top/publications/">学术论文页面</a>。`,
      fr:`Mes publications et prépublications portent sur la reconstruction 3D efficace, la prédiction de l’état de santé des batteries, le SLAM visuo-inertiel et la prévision de la demande d’électricité. Consultez la <a href="https://zhouzedong.top/publications/">page Publications</a> pour les références complètes, les articles et le code.`,
      de:`Meine Veröffentlichungen und Preprints behandeln effiziente 3D-Rekonstruktion, die Vorhersage des Batteriezustands, visuell-inertiales SLAM und Strombedarfsprognosen. Vollständige Angaben und Links zu Publikationen und Code stehen auf der <a href="https://zhouzedong.top/publications/">Publikationsseite</a>.`
    },
    '#contact': {zh:'联系方式',fr:'Contact',de:'Kontakt'},
    '#contact + ul li:nth-child(1)': {zh:'<strong>主要邮箱（UNR）：</strong><a href="mailto:zedongz@unr.edu">zedongz@unr.edu</a>',fr:'<strong>E-mail principal (UNR) :</strong> <a href="mailto:zedongz@unr.edu">zedongz@unr.edu</a>',de:'<strong>Haupt-E-Mail (UNR):</strong> <a href="mailto:zedongz@unr.edu">zedongz@unr.edu</a>'},
    '#contact + ul li:nth-child(2)': {zh:'<strong>备用邮箱：</strong><a href="mailto:2350082187zhou@gmail.com">2350082187zhou@gmail.com</a>',fr:'<strong>Autre e-mail :</strong> <a href="mailto:2350082187zhou@gmail.com">2350082187zhou@gmail.com</a>',de:'<strong>Alternative E-Mail:</strong> <a href="mailto:2350082187zhou@gmail.com">2350082187zhou@gmail.com</a>'},
    '#links': {zh:'相关链接',fr:'Liens',de:'Links'}
  };
  const blog = {
    '.skip-link': {zh:'跳转到正文',fr:'Aller au contenu',de:'Zum Inhalt springen'},
    '.eyebrow': {zh:'网络安全科研博客',fr:'Blog de recherche en cybersécurité',de:'Forschungsblog zur Cybersicherheit'},
    '#hero-title': {zh:'探索<span>安全边界</span>',fr:'Explorer les <span>frontières de confiance</span>',de:'Die <span>Sicherheitsgrenzen</span> erforschen'},
    '.hero-desc': {
      zh:'Linux 系统、AI 智能体安全、存储安全、eBPF 与科研实践笔记。',
      fr:'Systèmes Linux, sécurité des agents d’IA et du stockage, eBPF et notes de recherche pratiques.',
      de:'Linux-Systeme, KI-Agentensicherheit, Speichersicherheit, eBPF und praktische Forschungsnotizen.'
    },
    '#channel-heading': {zh:'研究专栏',fr:'Axes de recherche',de:'Forschungsschwerpunkte'},
    '#channels .section-heading p': {zh:'从不同角度探索更安全的计算世界。',fr:'Différentes perspectives pour une informatique plus sûre.',de:'Verschiedene Perspektiven für eine sicherere Computerwelt.'},
    '#channels .heading-link': {zh:'查看研究 →',fr:'Voir la recherche →',de:'Forschung ansehen →'},
    '.channel-card.green .channel-text small': {zh:'Linux 内核可观测性、eBPF 与安全机制。',fr:'Instrumentation du noyau, mécanismes de sécurité et observabilité.',de:'Kernel-Instrumentierung, Sicherheitsmechanismen und Beobachtbarkeit.'},
    '.channel-card.blue .channel-text small': {zh:'权限边界、安全自治与文件保护。',fr:'Frontières de privilèges, autonomie sûre et protection des fichiers.',de:'Berechtigungsgrenzen, sichere Autonomie und Dateischutz.'},
    '.channel-card:not(.green):not(.blue):not(.purple) .channel-text small': {zh:'文件系统、块 I/O 与数据完整性。',fr:'Systèmes de fichiers, E/S bloc et intégrité des données.',de:'Dateisysteme, Block-I/O und Datenintegrität.'},
    '.channel-card.purple .channel-text small': {zh:'实验记录、工具、论文与技术教程。',fr:'Expériences, outils, articles et guides techniques.',de:'Experimente, Werkzeuge, Fachartikel und technische Anleitungen.'},
    '#blog-ddl-heading': {zh:'安全会议<span>截稿雷达</span>',fr:'Radar des <span>échéances de sécurité</span>',de:'Radar für <span>Sicherheitskonferenzen</span>'},
    '.blog-deadlines-header p': {
      zh:'追踪即将到来的投稿截止日期，支持实时倒计时、时区切换和 CFP 来源区分。',
      fr:'Suivez les dates de soumission : comptes à rebours, fuseaux horaires et sources CFP vérifiées.',
      de:'Fristen im Blick: Live-Countdowns, Zeitzonen und überprüfbare CFP-Quellen.'
    },
    '.blog-deadlines-header > a': {zh:'进入完整会议雷达 ↗',fr:'Ouvrir le calendrier complet ↗',de:'Zum vollständigen Fristenradar ↗'},
    '.blog-ops-controls strong': {zh:'近期截稿 / 接下来 3 项',fr:'Prochaines échéances / 3 dates',de:'Nächste 3 Einreichungsfristen'},
    '#investigation-title': {zh:'当 AI 智能体失控：<br><span>谁来保护你的文件？</span>',fr:'Quand les agents d’IA dérapent :<br><span>qui protège vos fichiers ?</span>',de:'Wenn KI-Agenten außer Kontrolle geraten:<br><span>Wer schützt Ihre Dateien?</span>'},
    '.feature-identity > p': {
      zh:'通过实验研究高权限 AI 智能体面前主机侧数据保护的局限，追踪从智能体操作、Linux 安全控制到持久化存储的完整路径。',
      fr:'Une étude empirique des limites de la protection des données côté hôte lorsqu’un agent d’IA possède les privilèges root, depuis les contrôles Linux jusqu’au stockage persistant.',
      de:'Eine empirische Untersuchung der Grenzen hostseitigen Datenschutzes bei KI-Agenten mit Root-Rechten – von Linux-Sicherheitsmechanismen bis zum persistenten Speicher.'
    },
    '.feature-primary': {zh:'了解此项研究 ↗',fr:'Découvrir cette recherche ↗',de:'Forschung entdecken ↗'},
    '.feature-secondary': {zh:'学术论文 →',fr:'Publications →',de:'Publikationen →'},
    '.security-map figcaption': {
      zh:'<span class="caption-dot" aria-hidden="true"></span>概念性攻防路径图：展示研究威胁模型，并非实时攻击轨迹或保护效果保证。',
      fr:'<span class="caption-dot" aria-hidden="true"></span>Schéma conceptuel du modèle de menace, et non télémétrie en temps réel ni garantie de protection.',
      de:'<span class="caption-dot" aria-hidden="true"></span>Konzeptionelles Bedrohungsmodell; keine Live-Angriffsdaten und keine Garantie für Schutz.'
    },
    '#posts-heading': {zh:'最新文章',fr:'Derniers articles',de:'Neueste Beiträge'},
    '#posts .section-heading p': {zh:'研究实验、技术实践与深入分析。',fr:'Recherche, expérimentations et analyses techniques.',de:'Forschung, Experimente und technische Einblicke.'},
    '#posts .heading-link': {zh:'浏览研究 →',fr:'Voir les recherches →',de:'Forschung durchsuchen →'},
    '.no-posts': {
      zh:'第一批博客文章正在准备中。下面列出我计划撰写的研究主题。',
      fr:'Les premiers articles sont en préparation. Voici les sujets de recherche à venir.',
      de:'Die ersten Blogartikel sind in Vorbereitung. Hier sind geplante Forschungsthemen.'
    },
    '.no-posts ~ #searchable-posts article:nth-child(1) h3': {zh:'拥有 Root 权限的 AI 智能体真的能保护你的文件吗？',fr:'Un agent d’IA avec les privilèges root peut-il vraiment protéger vos fichiers ?',de:'Können KI-Agenten mit Root-Rechten Ihre Dateien wirklich schützen?'},
    '.no-posts ~ #searchable-posts article:nth-child(1) .post-content > p:not(.post-preview-note)': {zh:'研究具备高权限的 AI 智能体如何与文件及内核安全边界交互。',fr:'Étude des interactions entre les agents d’IA privilégiés et les frontières de sécurité des fichiers et du noyau.',de:'Wie privilegierte KI-Agenten mit Datei- und Kernel-Sicherheitsgrenzen interagieren.'},
    '.no-posts ~ #searchable-posts article:nth-child(2) h3': {zh:'Linux 块 I/O 跟踪：实践笔记',fr:'Traçage des E/S bloc sous Linux : notes pratiques',de:'Block-I/O-Tracing unter Linux: Praxisnotizen'},
    '.no-posts ~ #searchable-posts article:nth-child(2) .post-content > p:not(.post-preview-note)': {zh:'关于本地存储读写、可观测性及 Linux 跟踪数据采集的技术实践。',fr:'Guide technique des E/S locales, de l’observabilité et de la collecte de traces sous Linux.',de:'Technischer Leitfaden zu lokalen Speicherzugriffen, Beobachtbarkeit und Tracing unter Linux.'},
    '.no-posts ~ #searchable-posts article:nth-child(3) h3': {zh:'eBPF LSM 与 AppArmor：究竟发生了什么？',fr:'eBPF LSM et AppArmor : que se passe-t-il vraiment ?',de:'eBPF LSM und AppArmor: Was passiert tatsächlich?'},
    '.no-posts ~ #searchable-posts article:nth-child(3) .post-content > p:not(.post-preview-note)': {zh:'比较 Linux 内核安全控制机制在高权限工作负载下的行为。',fr:'Comparaison des mécanismes de sécurité du noyau sous des charges privilégiées.',de:'Vergleich des Verhaltens von Kernel-Sicherheitsmechanismen bei privilegierten Prozessen.'},
    '#no-search-results': {zh:'没有找到相关文章，请换个关键词。',fr:'Aucun article correspondant. Essayez un autre terme.',de:'Keine passenden Beiträge. Bitte anderen Suchbegriff verwenden.'},
    '.cyber-footer > span:first-child': {
      zh:'© 2026 Zedong Zhou · Linux、安全与开放科研',
      fr:'© 2026 Zedong Zhou · Linux, sécurité et recherche ouverte',
      de:'© 2026 Zedong Zhou · Linux, Sicherheit und offene Forschung'
    }
  };
  /* Translate remaining static blog cards and project-method summaries, while
     keeping official conference names, source CFP data and diagrams canonical. */
  Object.assign(blog,{
    '.channel-card.blue .channel-text strong':{zh:'AI 智能体安全',fr:'Sécurité des agents d’IA',de:'KI-Agentensicherheit'},
    '.channel-card:not(.green):not(.blue):not(.purple) .channel-text strong':{zh:'存储安全',fr:'Sécurité du stockage',de:'Speichersicherheit'},
    '.channel-card.purple .channel-text strong':{zh:'研究笔记',fr:'Notes de recherche',de:'Forschungsnotizen'},
    '.feature-overline':{zh:'● 重点研究 · 系统安全',fr:'● ÉTUDE À LA UNE · SÉCURITÉ DES SYSTÈMES',de:'● SCHWERPUNKTFORSCHUNG · SYSTEMSICHERHEIT'},
    '.feature-methods > div:nth-child(1) strong':{zh:'权限与智能体',fr:'Privilèges et agents',de:'Berechtigungen und Agenten'},
    '.feature-methods > div:nth-child(1) small':{zh:'当智能体具有 root 权限时，会发生什么？',fr:'Que se passe-t-il avec les privilèges root ?',de:'Was ändert sich bei Root-Rechten?'},
    '.feature-methods > div:nth-child(2) strong':{zh:'内核安全策略',fr:'Politiques du noyau',de:'Kernel-Richtlinien'},
    '.feature-methods > div:nth-child(2) small':{zh:'LSM、安全策略、AppArmor 和 eBPF 钩子。',fr:'Application des politiques LSM, AppArmor et hooks eBPF.',de:'LSM-Durchsetzung, AppArmor und eBPF-Hooks.'},
    '.feature-methods > div:nth-child(3) strong':{zh:'I/O 可观测性',fr:'Observabilité des E/S',de:'I/O-Beobachtbarkeit'},
    '.feature-methods > div:nth-child(3) small':{zh:'文件操作与块设备跟踪。',fr:'Opérations de fichiers et traçage des blocs.',de:'Dateizugriffe und Block-I/O-Traces.'},
    '.feature-methods > div:nth-child(4) strong':{zh:'信任边界',fr:'Frontières de confiance',de:'Vertrauensgrenzen'},
    '.feature-methods > div:nth-child(4) small':{zh:'将主机控制与数据完整性保护分离。',fr:'Séparer le contrôle de l’hôte de l’intégrité des données.',de:'Host-Steuerung von Datenintegrität trennen.'},
    '.blog-ddl-disclaimer':{
      zh:'CCF 会议等级参考 <a href="https://www.ccf.org.cn/Academic_Evaluation/NIS/" target="_blank" rel="noopener noreferrer">CCF 网络与信息安全目录 ↗</a>；它与截稿日期真实性验证是两回事。第三方社区数据仅供参考，请务必以官方 CFP 为准。完整页面包含 CCF A/B/C 筛选、研究方向分类、Timeline 时间轴和日历提醒。',
      fr:'Les catégories CCF proviennent du <a href="https://www.ccf.org.cn/Academic_Evaluation/NIS/" target="_blank" rel="noopener noreferrer">catalogue CCF ↗</a> et ne constituent pas une vérification des CFP. Les données communautaires restent provisoires : confirmez chaque date sur le site officiel. Le centre complet contient les filtres CCF, une chronologie et des rappels.',
      de:'Die CCF-Einstufungen stammen aus dem <a href="https://www.ccf.org.cn/Academic_Evaluation/NIS/" target="_blank" rel="noopener noreferrer">CCF-Katalog ↗</a> und bestätigen keine Einreichungsfrist. Angaben aus der Community sind vorläufig; prüfen Sie stets den offiziellen CFP. Die Vollansicht bietet CCF-Filter, Zeitachse und Kalenderexport.'
    }
  });
  const blogAttrs = {
    '#blog-search': {
      zh:{placeholder:'搜索文章…','aria-label':'搜索博客文章'},
      fr:{placeholder:'Rechercher des articles…','aria-label':'Rechercher des articles'},
      de:{placeholder:'Beiträge suchen…','aria-label':'Blogbeiträge suchen'}
    }
  };
  const sections = [
    {en:'About',id:'about'}, {en:'Research',id:'research'},{en:'Publications',id:'publications'},
    {en:'Blog',id:'blog'},{en:'Security Deadlines',id:'deadlines'},{en:'CV',id:'cv'}
  ];
  const routes={about:'/',research:'/research/',publications:'/publications/',blog:'/blog/',deadlines:'/security-deadlines/',cv:'/cv/'};
  function remember(node){if(!originals.has(node)) originals.set(node,node.innerHTML); return originals.get(node);}
  function applyOne(selector, data, lang){
    document.querySelectorAll(selector).forEach(node => {
      const en=remember(node);
      const translated=data[lang];
      node.innerHTML=(lang==='en'||typeof translated!=='string')?en:translated;
    });
  }
  function applyNav(lang){
    document.querySelectorAll('#site-nav .masthead__menu-item:not(.masthead__menu-item--lg):not(#theme-toggle) a[href], .cyber-navbar .nav-links a[href]').forEach(a=>{
      const target = new URL(a.href, location.href);
      const path = target.pathname;
      const route = target.hostname === 'blog.zhouzedong.top' && path === '/' ? 'blog' :
        target.hostname === 'zhouzedong.top' && path === '/' ? 'about' :
        (Object.keys(routes).find(key => routes[key] === path && key !== 'about') || (path === '/' ? 'about' : null));
      if(route&&Object.prototype.hasOwnProperty.call(nav[lang],route)){
        const en=remember(a);
        a.textContent=nav[lang][route];
        if(lang==='en')a.innerHTML=en;
      }
    });
  }
  function apply(lang){
    if(!supported.includes(lang))lang='en';
    document.documentElement.lang=lang==='zh'?'zh-CN':lang;
    document.querySelectorAll('[data-site-language]').forEach(select=>select.value=lang);
    applyNav(lang);
    const onHome=location.pathname==='/'||location.pathname==='/about/'||location.pathname==='/about.html';
    if(onHome)Object.entries(content).forEach(([selector,data])=>applyOne(selector,data,lang));
    if(document.body.classList.contains('cyber-site')){
      Object.entries(blog).forEach(([selector,data])=>applyOne(selector,data,lang));
      Object.entries(blogAttrs).forEach(([selector,data])=>document.querySelectorAll(selector).forEach(el=>{
        const base='en';
        if(!el.dataset.originalPlaceholder)el.dataset.originalPlaceholder=el.getAttribute('placeholder')||'';
        if(!el.dataset.originalAria)el.dataset.originalAria=el.getAttribute('aria-label')||'';
        Object.entries(data[lang]||{}).forEach(([key,value])=>el.setAttribute(key,value));
        if(lang==='en'){el.setAttribute('placeholder',el.dataset.originalPlaceholder);el.setAttribute('aria-label',el.dataset.originalAria);}
      }));
      const p=document.querySelectorAll('.post-preview-note');
      const val={en:'Upcoming research topic',zh:'待发布的研究主题',fr:'Sujet de recherche à venir',de:'Geplantes Forschungsthema'}[lang];p.forEach(el=>{remember(el);el.textContent=val;});
    }
    document.dispatchEvent(new CustomEvent('zedong:language-changed',{detail:{lang}}));
  }
  function savedLanguage(){
    const url = new URL(location.href);
    const requested=url.searchParams.get('lang');
    if(supported.includes(requested))return requested;
    try {const stored=localStorage.getItem('zz_site_lang');if(supported.includes(stored))return stored;}catch(_){}
    return 'en';
  }
  document.querySelectorAll('[data-site-language]').forEach(el=>el.addEventListener('change',()=>{
    const lang=supported.includes(el.value)?el.value:'en';
    try{localStorage.setItem('zz_site_lang',lang);}catch(_){}
    const url=new URL(location.href);
    if(lang==='en')url.searchParams.delete('lang');else url.searchParams.set('lang',lang);
    history.replaceState(null,'',url.pathname+url.search+url.hash);
    apply(lang);
  }));
  apply(savedLanguage());
})();
