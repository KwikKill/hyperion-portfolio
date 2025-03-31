import { defineStore } from "pinia"
import { usePreferencesStore } from "./preferences"

export const useProjectsStore = defineStore("projects", {
  state: () => ({
    projects: [
      {
        id: 1,
        name: {
          en: "Portfolio Website",
          fr: "Site Portfolio",
        },
        description: {
          en: "A responsive portfolio website built with Vue.js and Tailwind CSS. This site was developed in two versions: a classic version and a version that aligns more with my graphic style and tastes.",
          fr: "Un site portfolio responsive construit avec Vue.js et Tailwind CSS. Ce site a été développé en deux versions : une version classique et une version collant plus à mon style graphique et à mes goûts.",
        },
        file: {
          en: "portfolio.html",
          fr: "portfolio.html",
        },
        date: "2025",
        starred: true,
        technologies: ["Vue.js", "Tailwind CSS", "Pinia", "docker"],
        image: "/src/assets/projects/portfolio.webp",
        link: "#",
        github: "https://github.com/KwikKill/hyperion-portfolio",
      },
      {
        id: 2,
        name: {
          en: "Insalan.fr Website",
          fr: "Site Insalan",
        },
        description: {
          en: "Improvement of the Insalan association's website as development manager. Under my leadership, the association's website was rewritten in Django and DjangoREST for the backend, and Vue.js and tailwind for the frontend. The site is hosted on a VPS at INSA Rennes and uses Nginx as a reverse proxy.",
          fr: "Amélioration du site de l'association Insalan en tant que responsable développement. Sous mon mandat de responsable, le site de l'association a été réécrit en Django et DjangoREST pour le backend, et Vue.js et tailwind pour le frontend. Le site est hébergé sur un VPS de l'INSA Rennes et utilise Nginx comme reverse proxy.",
        },
        file: {
          en: "insalan.html",
          fr: "insalan.html",
        },
        date: "2023-2025",
        starred: true,
        technologies: ["Vue.js", "Tailwind CSS", "Pinia", "Django", "DjangoREST", "Docker", "Nginx", "Postgres"],
        image: "/src/assets/projects/insalan.webp",
        link: "https://insalan.fr",
        github: "https://github.com/InsaLan/infra-insalan.fr",
      },
      {
        id: 3,
        name: {
          en: "Insalan.fr Monitoring",
          fr: "Métrologie Insalan.fr",
        },
        description: {
          en: "Setting up a metrology ecosystem for the insalan.fr site. The system is based on Telegraf, InfluxDB, and Grafana and allows monitoring of site traffic, response times, and other metrics from NGINX logs.",
          fr: "Mise en place d'un écosystème de métrologie pour le site insalan.fr. Le système est basé sur Telegraf, InfluxDB et Grafana et permet de surveiller le trafic du site, les temps de réponse et d'autres métriques à partir des logs NGINX",
        },
        file: {
          en: "insalan-monitoring.html",
          fr: "insalan-monitoring.html",
        },
        date: "2025",
        starred: false,
        technologies: ["Grafana", "Telegraf", "InfluxDB", "Nginx", "Docker"],
        image: "/src/assets/projects/monit.webp",
        github: "https://github.com/InsaLan/infra-insalan.fr/blob/main/docker-compose-analytics.yml",
      },
      {
        id:4,
        name: {
          en: "Infographique",
          fr: "Infographique",
        },
        description: {
          en: "Infographique is a project from the graphic computing module at INSA Rennes. The project consisted of creating a 2D video using SFML. For this project, we used C++ and SFML.",
          fr: "Infographique est un projet du module informatique graphique de l'INSA Rennes. Le projet consistait à créer une vidéo en 2D en utilisant SFML. Pour ce projet, nous avons utilisé C++ et SFML.",
        },
        file: {
          en: "infographique.html",
          fr: "infographique.html",
        },
        date: "2024",
        starred: false,
        technologies: ["C++", "SFML", "Blender"],
        image: "/src/assets/projects/infographique.webp",
        link: "https://youtu.be/HfP1gKB0Cpg",
        github: "https://github.com/KwikKill/infographique"
      },
      {
        id:5,
        name: {
          en: "Bomberman AI",
          fr: "IA Bomberman",
        },
        description: {
          en: "Replication of a Bomberman game in C++ using SFML and creation of an AI to play the game. This project is part of the \"AI for games\" module at INSA Rennes. The AI is based on the MCTS (Monte Carlo Tree Search) algorithm and uses UCB1 pruning to choose the best move at each turn.",
          fr: "Réplication d'un jeu de bomberman en C++ avec SFML et création d'une IA pour jouer au jeu. Ce projet s'inscrit dans le cadre du module \"IA pour les jeux\" de l'INSA Rennes. L'IA est basée sur l'algorithme de MCTS (Monte Carlo Tree Search) et utilise l'élagage UCB1 pour choisir le meilleur coup à chaque tour.",
        },
        file: {
          en: "bomberman.py",
          fr: "bomberman.py",
        },
        date: "2024",
        starred: false,
        technologies: ["C++", "SFML"],
        image: "/src/assets/projects/bomberman.webp",
        github: "https://github.com/KwikKill/Bomberman",
      },
      {
        id:6,
        name: {
          en: "Lightshield improvement",
          fr: "Amélioration de Lightshield",
        },
        description: {
          en: "Lightshield is a Self-Contained Pipeline to keep a local mirror of the RiotGames API. I've cloned the project, fixed some bugs, and improved it.",
          fr: "Lightshield est un pipeline autonome pour garder un miroir local de l'API RiotGames. J'ai cloné le projet, résolu quelques bugs et l'ai amélioré."
        },
        file: {
          en: "lightshield.py",
          fr: "lightshield.py",
        },
        date: "2024",
        starred: false,
        technologies: ["Python", "JavaScript", "Docker", "Redis", "Postgres"],
        image: "/src/assets/projects/lightshield.webp",
        github: "https://github.com/KwikKill/Lightshield",
      },
      {
        id:7,
        name: {
          en: "RankUp LoL Discord Bot",
          fr: "Bot Discord RankUp LoL",
        },
        description: {
          en: "A Discord bot providing detailed League of Legends stats, rank tracking, and server leaderboards. This bot uses the RiotGames API to fetch League of Legends match data and display it on Discord using Discord.js.",
          fr: "Un bot Discord offrant des statistiques détaillées sur League of Legends, suivi des rangs et classements de serveur. Ce bot utilise l'API de RiotGames pour récupérer les données de match League of Legends et les afficher sur Discord en utilisant Discord.js.",
        },
        file: {
          en: "rankup.js",
          fr: "rankup.js",
        },
        date: "2019-2025",
        starred: true,
        technologies: ["Python", "Discord.js", "Docker", "Postgres"],
        image: "/src/assets/projects/rankup.webp",
        link: "https://rankup.somi.blaisot.org/",
        github: "https://github.com/KwikKill/Kwik_bot",
      },
      {
        id: 8,
        name: {
          en: "Virtual file system",
          fr: "Système de fichiers virtuel",
        },
        description: {
          en: "A virtual file system that allows creating, deleting, and moving virtual files and directories. It is implemented in Python and uses a file as disk to store data. The file system includes a partition table, and it is possible to choose the type of RAID to use.",
          fr: "Un système de fichiers virtuel qui permet de créer, supprimer et déplacer des fichiers et des répertoires virtuels. Il est implémenté en Python et utilise un fichier comme disque pour stocker les données. Le système de fichiers inclut une table de partitionnement et il est possible de choisir le type de RAID à utiliser."
        },
        file: {
          en: "virtualfs.py",
          fr: "virtualfs.py",
        },
        date: "2020",
        starred: false,
        technologies: ["Python"],
        image: "/src/assets/projects/vfs.webp",
        github: "https://github.com/KwikKill/Virtual-File-System"
      },
      {
        id: 9,
        name: {
          en: "Mindustry modding",
          fr: "Modding Mindustry",
        },
        description: {
          en: "Creation of a modded version of Mindustry, a real-time strategy game. This mod added new blocks and new resources. This mod is a modified version of the game because modding support was not yet implemented in the game at this time. The mod was developed in Java.",
          fr: "Création d'une version moddée de Mindustry, un jeu de stratégie en temps réel. Ce mod rajoutait de nouveau blocs et de nouvelles ressources. Ce mod est une version modifiée du jeu car le support du modding n'était pas encore implémenté dans le jeu à ce moment là. Le mod a été développé en Java.",
        },
        file: {
          en: "mindustry-mod.java",
          fr: "mindustry-mod.java",
        },
        date: "2018",
        starred: false,
        technologies: ["Java"],
        image: "/src/assets/projects/mindustry.webp",
        github: "https://github.com/KwikKill/Anuken-Mindustry",
      }
    ],
    skills: {
      en: [
        {
          name: 'Languages',
          skills: ['Shell Script', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'Go', 'R', 'OCaml']
        },
        {
          name: 'Web Development',
          skills: ['Angular', 'Django', 'DjangoREST', 'Vue.js', 'Express.js', 'FastAPI', 'Vite', 'TailwindCSS', 'jQuery', 'Bootstrap', 'Swagger', 'Nginx']
        },
        {
          name: 'Databases',
          skills: ['Postgres', 'MongoDB', 'MySQL', 'Redis', 'SQLite', 'MariaDB', 'ApacheCassandra', 'InfluxDB', 'YAML', 'JSON', 'XML']
        },
        {
          name: 'CI/CD',
          skills: ['Jenkins', 'Apache Groovy', 'TravisCI', 'GitLab CI', 'GitHub Actions']
        },
        {
          name: 'Tools',
          skills: ['GithubPages', 'Makefile', 'CMake', 'NPM', 'Poetry', 'Apache Maven', 'Wireguard', 'Postman', 'Ansible', 'Prometheus', 'Telegraf', 'Grafana', 'Docker', 'ESLint', 'Prettier', 'Pylint']
        },
        {
          name: 'Design',
          skills: ['Gimp', 'Figma']
        },
        {
          name: 'Data Science and Data Visualization',
          skills: ['Scipy', 'TensorFlow', 'PyTorch', 'Chart.js']
        },
        {
          name: 'Version Control',
          skills: ['Git', 'Gitea', 'Bitbucket', 'GitHub', 'GitLab']
        },
        {
          name: 'Cloud providers',
          skills: ['Scaleway', 'OVH', 'Hetzner']
        },
        {
          name: 'Other',
          skills: ['Markdown', 'LaTeX']
        }
      ],
      fr: [
        {
          name: 'Langages',
          skills: ['Shell Script', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'Go', 'R', 'OCaml']
        },
        {
          name: 'Développement Web',
          skills: ['Angular', 'Django', 'DjangoREST', 'Vue.js', 'Express.js', 'FastAPI', 'Vite', 'TailwindCSS', 'jQuery', 'Bootstrap', 'Swagger', 'Nginx']
        },
        {
          name: 'Bases de Données',
          skills: ['Postgres', 'MongoDB', 'MySQL', 'Redis', 'SQLite', 'MariaDB', 'ApacheCassandra', 'InfluxDB', 'YAML', 'JSON', 'XML']
        },
        {
          name: 'CI/CD',
          skills: ['Jenkins', 'Apache Groovy', 'TravisCI', 'GitLab CI', 'GitHub Actions']
        },
        {
          name: 'Outils',
          skills: ['GithubPages', 'Makefile', 'CMake', 'NPM', 'Poetry', 'Apache Maven', 'Wireguard', 'Postman', 'Ansible', 'Prometheus', 'Telegraf', 'Grafana', 'Docker', 'ESLint', 'Prettier', 'Pylint']
        },
        {
          name: 'Design',
          skills: ['Gimp', 'Figma']
        },
        {
          name: 'Science des Données et Visualisation',
          skills: ['Scipy', 'TensorFlow', 'PyTorch', 'Chart.js']
        },
        {
          name: 'Contrôle de Version',
          skills: ['Git', 'Gitea', 'Bitbucket', 'GitHub', 'GitLab']
        },
        {
          name: 'Fournisseurs Cloud',
          skills: ['Scaleway', 'OVH', 'Hetzner']
        },
        {
          name: 'Autres',
          skills: ['Markdown', 'LaTeX']
        }
      ]
    }
  }),

  getters: {
    getLocalizedProjects: (state) => {
      const preferencesStore = usePreferencesStore()
      const lang = preferencesStore.language

      return state.projects.map((project) => ({
        ...project,
        localizedName: project.name[lang],
        localizedDescription: project.description[lang],
      }))
    },
    getLocalizedSkills: (state) => {
      const preferencesStore = usePreferencesStore()
      const lang = preferencesStore.language

      return state.skills[lang]
    },
  },
})

