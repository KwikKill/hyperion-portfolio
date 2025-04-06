import { defineStore } from 'pinia';
import { ref } from 'vue';
import aptImage from '@/assets/games/a_plague_tale.webp';
import baldurImage from '@/assets/games/baldurs_gate_3.webp';
import cp2077Image from '@/assets/games/cyberpunk_2077.webp';
import hollowknightImage from '@/assets/games/hollow_knight.webp';
import lmfImage from '@/assets/games/little_miss_fortune.webp';
import thewitcherImage from '@/assets/games/the_witcher_3.webp';
import exMachinaImage from '@/assets/movies/ex_machina.webp';
import gitsImage from '@/assets/movies/ghost_in_the_shell.webp';
import inceptionImage from '@/assets/movies/inception.webp';
import lcdlpImage from '@/assets/movies/la_cité_de_la_peur.webp';
import matrixImage from '@/assets/movies/matrix.webp';
import tenetImage from '@/assets/movies/tenet.webp';
import codepilotImage from '@/assets/projects/advent.webp';
import bombermanImage from '@/assets/projects/bomberman.webp';
import btcImage from '@/assets/projects/btc.webp';
import indexerImage from '@/assets/projects/indexer.webp';
import infographiqueImage from '@/assets/projects/infographique.webp';
import insalanImage from '@/assets/projects/insalan.webp';
import lightshieldImage from '@/assets/projects/lightshield.webp';
import mindustryImage from '@/assets/projects/mindustry.webp';
import minecraftImage from '@/assets/projects/minecraft.webp';
import monitImage from '@/assets/projects/monit.webp';
import portfolioImage from '@/assets/projects/portfolio.webp';
import pshImage from '@/assets/projects/psh.webp';
import rankupImage from '@/assets/projects/rankup.webp';
import rankupwebImage from '@/assets/projects/rankup-website.webp';
import revuesImage from '@/assets/projects/revues.webp';
import stackImage from '@/assets/projects/stack.webp';
import vfsImage from '@/assets/projects/vfs.webp';
import type { Experience } from '@/models/experience';
import type { Games } from '@/models/game';
import type { Movies } from '@/models/movie';
import type { localizedProject, Project } from '@/models/project';
import type { Skills } from '@/models/skill';

import { usePreferencesStore } from './preferences';

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [
      {
        name: {
          en: 'Portfolio Website',
          fr: 'Site Portfolio',
        },
        description: {
          en: 'A responsive portfolio website built with Vue.js and Tailwind CSS. This site was developed in two versions: a classic version and a version that aligns more with my graphic style and tastes.',
          fr: 'Un site portfolio responsive construit avec Vue.js et Tailwind CSS. Ce site a été développé en deux versions : une version classique et une version collant plus à mon style graphique et à mes goûts.',
        },
        file: {
          en: 'portfolio.html',
          fr: 'portfolio.html',
        },
        date: '2025',
        starred: true,
        technologies: ['Vue.js', 'HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'Pinia', 'Docker', 'PostgreSQL'],
        images: [portfolioImage],
        link: '#',
        github: 'https://github.com/KwikKill/hyperion-portfolio',
      },
      {
        name: {
          en: 'Insalan.fr Website',
          fr: 'Site Insalan.fr',
        },
        description: {
          en: "Improvement of the Insalan association's website as development manager. Under my leadership, the association's website was rewritten in Django and DjangoREST for the backend, and Vue.js and tailwind for the frontend. The site is hosted on a VPS at INSA Rennes and uses Nginx as a reverse proxy.",
          fr: "Amélioration du site de l'association Insalan en tant que responsable développement. Sous mon mandat de responsable, le site de l'association a été réécrit en Django et DjangoREST pour le backend, et Vue.js et tailwind pour le frontend. Le site est hébergé sur un VPS de l'INSA Rennes et utilise Nginx comme reverse proxy.",
        },
        file: {
          en: 'insalan.html',
          fr: 'insalan.html',
        },
        date: '2023-2025',
        starred: true,
        technologies: ['Vue.js', 'HTML', 'CSS', 'Tailwind CSS', 'Pinia', 'JavaScript', 'TypeScript', 'Django', 'DjangoREST', 'Docker', 'Nginx', 'Postgres'],
        images: [insalanImage],
        link: 'https://insalan.fr',
        github: 'https://github.com/InsaLan/infra-insalan.fr',
      },
      {
        name: {
          en: 'Insalan.fr Monitoring',
          fr: 'Métrologie Insalan.fr',
        },
        description: {
          en: 'Setting up a metrology ecosystem for the insalan.fr site. The system is based on Telegraf, InfluxDB, and Grafana and allows monitoring of site traffic, response times, and other metrics from NGINX logs.',
          fr: "Mise en place d'un écosystème de métrologie pour le site insalan.fr. Le système est basé sur Telegraf, InfluxDB et Grafana et permet de surveiller le trafic du site, les temps de réponse et d'autres métriques à partir des logs NGINX",
        },
        file: {
          en: 'insalan-monitoring.html',
          fr: 'insalan-monitoring.html',
        },
        date: '2025',
        starred: false,
        technologies: ['Grafana', 'Telegraf', 'InfluxDB', 'Nginx', 'Docker'],
        images: [monitImage],
        github: 'https://github.com/InsaLan/infra-insalan.fr/blob/main/docker-compose-analytics.yml',
      },
      {
        name: {
          en: 'Break the code',
          fr: 'Break the code',
        },
        description: {
          en: 'Participation in the "Break the code" algorithmic competition organized by Sopra Steria. By improving each year, my teammates and I managed to reach the top 6 in the second year and the top 4 in the third and fourth years out of more than 40 teams. The competition is open to all students from computer science schools in Rennes.',
          fr: "Participation au concours d'algorythmie \"Break the code\" organisée par Sopra Steria. En m'améliorant chaque année, nous avons réussi avec mes coéquipiés à nous hisser au top 6 dès la deuxième année et au top 4 la troisième et quatrième année sur plus de 40 équipes. Le concours est ouvert à tous les étudiants des écoles d'informatique de Rennes.",
        },
        file: {
          en: 'breakthecode.html',
          fr: 'breakthecode.html',
        },
        date: '2021-2024',
        starred: true,
        technologies: ['Python', 'JavaScript'],
        images: [btcImage],
        link: 'https://www.linkedin.com/posts/m-paris_breakthecode-challenge-codage-activity-7272240941552340992-maS5',
      },
      {
        name: {
          en: 'Infographique',
          fr: 'Infographique',
        },
        description: {
          en: 'Infographique is a project from the graphic computing module at INSA Rennes. The project consisted of creating a 2D video using SFML. For this project, we used C++ and SFML.',
          fr: "Infographique est un projet du module informatique graphique de l'INSA Rennes. Le projet consistait à créer une vidéo en 2D en utilisant SFML. Pour ce projet, nous avons utilisé C++ et SFML.",
        },
        file: {
          en: 'infographique.html',
          fr: 'infographique.html',
        },
        date: '2024',
        starred: false,
        technologies: ['C++', 'SFML', 'Blender'],
        images: [infographiqueImage],
        link: 'https://youtu.be/HfP1gKB0Cpg',
        github: 'https://github.com/KwikKill/infographique',
      },
      {
        name: {
          en: 'Bomberman AI',
          fr: 'IA Bomberman',
        },
        description: {
          en: 'Replication of a Bomberman game in C++ using SFML and creation of an AI to play the game. This project is part of the "AI for games" module at INSA Rennes. The AI is based on the MCTS (Monte Carlo Tree Search) algorithm and uses UCB1 pruning to choose the best move at each turn.',
          fr: "Réplication d'un jeu de bomberman en C++ avec SFML et création d'une IA pour jouer au jeu. Ce projet s'inscrit dans le cadre du module \"IA pour les jeux\" de l'INSA Rennes. L'IA est basée sur l'algorithme de MCTS (Monte Carlo Tree Search) et utilise l'élagage UCB1 pour choisir le meilleur coup à chaque tour.",
        },
        file: {
          en: 'bomberman.py',
          fr: 'bomberman.py',
        },
        date: '2024',
        starred: false,
        technologies: ['C++', 'SFML'],
        images: [bombermanImage],
        github: 'https://github.com/KwikKill/Bomberman',
      },
      {
        name: {
          en: 'Advent of Codpilote',
          fr: 'Advent of Codpilote',
        },
        description: {
          en: 'This project is not finished. The aim was to solve the algorythmic problems of the advent of code only with Github copilot. The main rule was: no code writen by yourself.',
          fr: "Ce projet n'est pas finis. L'objectif était de résoudre les problème d'algorythmie de l'advent of code uniquement avec Github copilot. Pour cela, la règle principale était la suivante : interdiction d'écrire du code soit même.",
        },
        file: {
          en: 'adventofcode.html',
          fr: 'adventofcode.html',
        },
        date: '2023-2024',
        starred: false,
        technologies: ['Python', 'JavaScript', 'TypeScript'],
        images: [codepilotImage],
        github: 'https://github.com/KwikKill/advent-of-codpilote',
      },
      {
        name: {
          en: 'Lightshield improvement',
          fr: 'Amélioration de Lightshield',
        },
        description: {
          en: "Lightshield is a Self-Contained Pipeline to keep a local mirror of the RiotGames API. I've cloned the project, fixed some bugs, and improved it.",
          fr: "Lightshield est un pipeline autonome pour garder un miroir local de l'API RiotGames. J'ai cloné le projet, résolu quelques bugs et l'ai amélioré.",
        },
        file: {
          en: 'lightshield.py',
          fr: 'lightshield.py',
        },
        date: '2024',
        starred: false,
        technologies: ['Python', 'JavaScript', 'Docker', 'Redis', 'Postgres'],
        images: [lightshieldImage],
        github: 'https://github.com/KwikKill/Lightshield',
      },
      {
        name: {
          en: 'Document indexer',
          fr: 'Indexeur de documents',
        },
        description: {
          en: 'This project was carried out as part of the TALEO (automatic processing of written and oral language) module of my studies at INSA Rennes. The objective was to create a document indexer in Python and a documents search tool. The indexer creates an inverted index from a set of documents. It is then possible to search for words in the documents and display the results as a list. Several algorithms have been implemented (tf.id, bm25, dirichlet,...).',
          fr: "Ce projet a été réalisé dans le cadre du module TALEO (traitement automatique du langage écrit et oral) de mon cursus à l'INSA Rennes. L'objectif était de créer un indexeur de documents en python ainsi qu'un outil de recherche de documents. L'indexeur permet de créer un index inversé à partir d'un ensemble de documents. Il est ensuite possible de rechercher des mots dans les documents et d'afficher les rsultats sous forme de liste. Plusieurs algorythmes ont été implémentés (tf.id, bm25, dirichlet,...).",
        },
        file: {
          en: 'indexer.py',
          fr: 'indexer.py',
        },
        date: '2024',
        starred: false,
        technologies: ['Python'],
        images: [indexerImage],
        github: 'https://github.com/KwikKill/TALEO',
      },
      {
        name: {
          en: 'Journals generation',
          fr: 'Génération de revues',
        },
        description: {
          en: 'This research project was carried out as part of my studies at INSA Rennes. The objective was to improve a python pipeline for generating historical reviews on soldiers from the old regime.',
          fr: "Ce projet inscrit dans la recherche a été réalisé dans le cadre de mon cursus à l'INSA Rennes. L'objectif était l'amélioration d'un pipeline python de génération de revues historique sur les soldats de l'ancien régime.",
        },
        file: {
          en: 'journals.py',
          fr: 'revues.py',
        },
        date: '2023-2024',
        starred: false,
        technologies: ['Python', 'LaTeX'],
        images: [revuesImage],
        link: 'https://www.irisa.fr/article/2023-09/la-creation-de-revues-numeriques-des-registres-des-soldats-de-lancien-regime-un',
      },
      {
        name: {
          en: 'PSH website',
          fr: 'Site PSH',
        },
        description: {
          en: 'Creation of a website for a humanities project related to INSA Rennes. This static site was created to illustrate our topic "What is the impact of digital technology on access to culture?" The support was between a website and a PDF document, the choice was quickly made.',
          fr: "Création d'un site internet pour un projet de science humaines lié à l'INSA Rennes. Ce site statique a été créé pour illuster notre sujet \" Quel est l'impact du numérique sur l'accès à la culture ? \". Le support était entre un site internet et un document PDF, le choix a été vite fait.",
        },
        file: {
          en: 'psh.html',
          fr: 'psh.html',
        },
        date: '2023',
        starred: false,
        technologies: ['Vue.js', 'HTML', 'CSS', 'Tailwind CSS', 'Docker'],
        images: [pshImage],
        link: 'https://psh.blaisot.org/',
      },
      {
        name: {
          en: 'RankUp website',
          fr: 'Site RankUp',
        },
        description: {
          en: 'Creation of a website for my discord bot RankUp. This showcase site allows to present the bot and give information about its use. (Anecdote: the site was entirely made in 3h)',
          fr: "Création d'un site internet pour mon bot discord RankUp. Ce site vitrine permet de présenter le bot et de donner des informations sur son utilisation. (Annecdote: le site a entierement été fait en 3h)",
        },
        file: {
          en: 'rankup-website.html',
          fr: 'rankup-website.html',
        },
        date: '2023',
        starred: false,
        technologies: ['Vue.js', 'HTML', 'CSS', 'Tailwind CSS', 'Docker'],
        images: [rankupwebImage],
        link: 'https://rankup.somi.blaisot.org/',
      },
      {
        name: {
          en: 'Stack Web',
          fr: 'Stack Web',
        },
        description: {
          en: 'Setting up a deployment stack for dockerized sites. This environment contains a nginx server, docker containers and their associated configurations, enabling me to easily host my sites (like this one).',
          fr: "Mise en place d'une stack de déploiement pour sites dockerisés. Cet environnement contient un serveur nginx, des containers dockers et leurs configurations associées et me permet de facilement héberger mes sites (comme celui là).",
        },
        file: {
          en: 'stack.html',
          fr: 'stack.html',
        },
        date: '2023',
        starred: false,
        technologies: ['Docker', 'Nginx', 'Shell'],
        images: [stackImage],
      },
      {
        name: {
          en: 'RankUp LoL Discord Bot',
          fr: 'Bot Discord RankUp LoL',
        },
        description: {
          en: 'A Discord bot providing detailed League of Legends stats, rank tracking, and server leaderboards. This bot uses the RiotGames API to fetch League of Legends match data and display it on Discord using Discord.js.',
          fr: "Un bot Discord offrant des statistiques détaillées sur League of Legends, suivi des rangs et classements de serveur. Ce bot utilise l'API de RiotGames pour récupérer les données de match League of Legends et les afficher sur Discord en utilisant Discord.js.",
        },
        file: {
          en: 'rankup.js',
          fr: 'rankup.js',
        },
        date: '2019-2025',
        starred: true,
        technologies: ['JavaScript', 'Discord.js', 'Docker', 'Postgres'],
        images: [rankupImage],
        link: 'https://rankup.somi.blaisot.org/',
        github: 'https://github.com/KwikKill/Kwik_bot',
      },
      {
        name: {
          en: 'Virtual file system',
          fr: 'Système de fichiers virtuel',
        },
        description: {
          en: 'A virtual file system that allows creating, deleting, and moving virtual files and directories. It is implemented in Python and uses a file as disk to store data. The file system includes a partition table, and it is possible to choose the type of RAID to use.',
          fr: 'Un système de fichiers virtuel qui permet de créer, supprimer et déplacer des fichiers et des répertoires virtuels. Il est implémenté en Python et utilise un fichier comme disque pour stocker les données. Le système de fichiers inclut une table de partitionnement et il est possible de choisir le type de RAID à utiliser.',
        },
        file: {
          en: 'virtualfs.py',
          fr: 'virtualfs.py',
        },
        date: '2020',
        starred: false,
        technologies: ['Python'],
        images: [vfsImage],
        github: 'https://github.com/KwikKill/Virtual-File-System',
      },
      {
        name: {
          en: 'Minecraft server management',
          fr: "Gestion d'un serveur Minecraft",
        },
        description: {
          en: 'Development of a Minecraft plugin and a website for a Minecraft server. The plugin allows generating random buildings in the server world and interacting with several APIs. The website was a static showcase site.',
          fr: "Développement d'un plugin minecraft ainsi qu'un site internet pour un serveur Minecraft. Le plugin permet de générer des batiments aléatoires dans le monde du serveur ainsi qu'interragir avec plusieurs API. Le site internet était un site statique vitrine.",
        },
        file: {
          en: 'minecraft-plugin.java',
          fr: 'minecraft-plugin.java',
        },
        date: '2018-2020',
        starred: false,
        technologies: ['Java', 'HTML', 'CSS'],
        images: [minecraftImage],
      },
      {
        name: {
          en: 'Mindustry modding',
          fr: 'Modding Mindustry',
        },
        description: {
          en: 'Creation of a modded version of Mindustry, a real-time strategy game. This mod added new blocks and new resources. This mod is a modified version of the game because modding support was not yet implemented in the game at this time. The mod was developed in Java.',
          fr: "Création d'une version moddée de Mindustry, un jeu de stratégie en temps réel. Ce mod rajoutait de nouveau blocs et de nouvelles ressources. Ce mod est une version modifiée du jeu car le support du modding n'était pas encore implémenté dans le jeu à ce moment là. Le mod a été développé en Java.",
        },
        file: {
          en: 'mindustry-mod.java',
          fr: 'mindustry-mod.java',
        },
        date: '2018',
        starred: false,
        technologies: ['Java'],
        images: [mindustryImage],
        github: 'https://github.com/KwikKill/Anuken-Mindustry',
      },
    ] as Project[],
    experiences: [
      {
        title: {
          en: 'Development Intern (12 weeks)',
          fr: 'Stage de développement (12 semaines)',
        },
        company: 'Broadpeak',
        location: {
          en: 'Rennes, France',
          fr: 'Rennes, France',
        },
        period: {
          en: 'June 2024 - August 2024',
          fr: 'Juin 2024 - Août 2024',
        },
        description: {
          en: 'Integration of an auto benchmark step using a company tool in a Jenkins pipeline and development of a plugin to allow visualization and interpretation of results.',
          fr: "Intégration d’une étape de benchmark auto en utilisant un outil de l'entreprise dans un pipeline Jenkins et développement d’un plugin pour permettre la visualisation et d’interprétation des résultats.",
        },
        technologies: ['Jenkins', 'Java', 'Groovy', 'HTML', 'CSS', 'Javascript', 'Chart.js', 'Ansible', 'ESXI', 'Git'],
        achievements: {
          en: [
            'Add performance criteria for tests',
            'Quantification of regressions on new versions',
          ],
          fr: [
            'Ajout de critères de performance pour les tests',
            'Quantification des régressions lors de nouvelles versions',
          ],
        },
      },
      {
        title: {
          en: 'Development Intern (4 weeks)',
          fr: 'Stage de développement (4 semaines)',
        },
        company: 'CozyCloud',
        location: {
          en: 'Rennes, France',
          fr: 'Rennes, France',
        },
        period: {
          en: 'June 2023 - July 2023',
          fr: 'Juin 2023 - Juillet 2023',
        },
        description: {
          en: 'Maintaining and improving a web application (Flask) for park management for support teams.',
          fr: 'Maintient et Amélioration d’une application web (Flask) de gestion de parc à destination des équipes supports.',
        },
        technologies: ['Python', 'Flask', 'HTML', 'CSS', 'JavaScript', 'Git'],
        achievements: {
          en: [
          ],
          fr: [
          ],
        },
      },
      {
        title: {
          en: 'Development Intern (6 weeks)',
          fr: 'Stage de dévelopement (6 semaines)',
        },
        company: 'Blacknut',
        location: {
          en: 'Rennes, France',
          fr: 'Rennes, France',
        },
        period: {
          en: 'June 2022 - July 2022',
          fr: 'Juin 2022 - Juillet 2022',
        },
        description: {
          en: "Hardware updates and encryption of company computers, optimization of the backup process by integrating the company's API to only back up new data, and technology updates in the back-office team of a cloud gaming startup.",
          fr: "Mises à jour hardware et chiffrement des ordinateurs de l'entreprise, optimisation du processus de backup en intégrant l'api de l'entreprise pour ne sauvegarder que les nouveautées et mise à jour de technologie dans l'équipe back-office d'une startup de cloud gaming.",
        },
        technologies: ['Python', 'Jenkins', 'Golang', 'AWS S3', 'Git'],
        achievements: {
          en: [
            'Disk encryption for data security',
            'Integration of company API for backup optimization',
            'Translation of Jenkins jobs into JenkinsFiles',
          ],
          fr: [
            'Chiffrement de disques pour la sécurité des données',
            "Intégration de l'API de l'entreprise pour l'optimisation des sauvegardes",
            'Traduction de job Jenkins en JenkinsFiles',
          ],
        },
      },
    ] as Experience[],
    skills: {
      en: [
        {
          name: 'Languages',
          skills: [
            'Shell Script',
            'HTML',
            'CSS',
            'JavaScript',
            'TypeScript',
            'Python',
            'Java',
            'C',
            'C++',
            'Go',
            'R',
            'OCaml',
          ],
        },
        {
          name: 'Web Development',
          skills: [
            'Angular',
            'Django',
            'DjangoREST',
            'Vue.js',
            'Express.js',
            'FastAPI',
            'Vite',
            'TailwindCSS',
            'jQuery',
            'Bootstrap',
            'Swagger',
            'Nginx',
          ],
        },
        {
          name: 'Databases',
          skills: [
            'Postgres',
            'MongoDB',
            'MySQL',
            'Redis',
            'SQLite',
            'MariaDB',
            'ApacheCassandra',
            'InfluxDB',
            'YAML',
            'JSON',
            'XML',
          ],
        },
        {
          name: 'CI/CD',
          skills: ['Jenkins', 'Apache Groovy', 'TravisCI', 'GitLab CI', 'GitHub Actions'],
        },
        {
          name: 'Tools',
          skills: [
            'GithubPages',
            'Makefile',
            'CMake',
            'NPM',
            'Poetry',
            'Apache Maven',
            'Wireguard',
            'Postman',
            'Ansible',
            'Prometheus',
            'Telegraf',
            'Grafana',
            'Docker',
            'ESLint',
            'Prettier',
            'Pylint',
          ],
        },
        {
          name: 'Design',
          skills: ['Gimp', 'Figma'],
        },
        {
          name: 'Data Science and Data Visualization',
          skills: ['Scipy', 'TensorFlow', 'PyTorch', 'Chart.js'],
        },
        {
          name: 'Version Control',
          skills: ['Git', 'Gitea', 'Bitbucket', 'GitHub', 'GitLab'],
        },
        {
          name: 'Cloud providers',
          skills: ['Scaleway', 'OVH', 'Hetzner'],
        },
        {
          name: 'Other',
          skills: ['Markdown', 'LaTeX', 'Typst'],
        },
      ],
      fr: [
        {
          name: 'Langages',
          skills: [
            'Shell Script',
            'HTML',
            'CSS',
            'JavaScript',
            'TypeScript',
            'Python',
            'Java',
            'C',
            'C++',
            'Go',
            'R',
            'OCaml',
          ],
        },
        {
          name: 'Développement Web',
          skills: [
            'Angular',
            'Django',
            'DjangoREST',
            'Vue.js',
            'Express.js',
            'FastAPI',
            'Vite',
            'TailwindCSS',
            'jQuery',
            'Bootstrap',
            'Swagger',
            'Nginx',
          ],
        },
        {
          name: 'Bases de Données',
          skills: [
            'Postgres',
            'MongoDB',
            'MySQL',
            'Redis',
            'SQLite',
            'MariaDB',
            'ApacheCassandra',
            'InfluxDB',
            'YAML',
            'JSON',
            'XML',
          ],
        },
        {
          name: 'CI/CD',
          skills: ['Jenkins', 'Apache Groovy', 'TravisCI', 'GitLab CI', 'GitHub Actions'],
        },
        {
          name: 'Outils',
          skills: [
            'GithubPages',
            'Makefile',
            'CMake',
            'NPM',
            'Poetry',
            'Apache Maven',
            'Wireguard',
            'Postman',
            'Ansible',
            'Prometheus',
            'Telegraf',
            'Grafana',
            'Docker',
            'ESLint',
            'Prettier',
            'Pylint',
          ],
        },
        {
          name: 'Design',
          skills: ['Gimp', 'Figma'],
        },
        {
          name: 'Science des Données et Visualisation',
          skills: ['Scipy', 'TensorFlow', 'PyTorch', 'Chart.js'],
        },
        {
          name: 'Contrôle de Version',
          skills: ['Git', 'Gitea', 'Bitbucket', 'GitHub', 'GitLab'],
        },
        {
          name: 'Fournisseurs Cloud',
          skills: ['Scaleway', 'OVH', 'Hetzner'],
        },
        {
          name: 'Autres',
          skills: ['Markdown', 'LaTeX', 'Typst'],
        },
      ],
    } as Skills,
    movies: {
      en: [
        {
          title: 'Matrix',
          year: '1999',
          genre: 'Science-Fiction/Action',
          image: matrixImage,
          description:
            'A hacker learns about the true nature of his reality and his role in the war against its controllers.',
          whyILoveIt: 'Revolutionary visual effects and a mind-bending story.',
        },
        {
          title: 'Ghost in the Shell',
          year: '1995',
          genre: 'Anime/Science-Fiction',
          image: gitsImage,
          description: 'A cyborg policewoman and her partner hunt a mysterious hacker called the Puppet Master.',
          whyILoveIt: 'Pioneering cyberpunk animation with deep philosophical questions.',
        },
        {
          title: 'Inception',
          year: '2010',
          genre: 'Science-Fiction/Action',
          image: inceptionImage,
          description:
            'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
          whyILoveIt: 'Complex narrative layers and mind-bending concepts.',
        },
        {
          title: 'Ex Machina',
          year: '2014',
          genre: 'Science-Fiction/Drama',
          image: exMachinaImage,
          description:
            'A programmer is selected to participate in a groundbreaking experiment in synthetic intelligence by evaluating the human qualities of a highly advanced humanoid A.I.',
          whyILoveIt: 'Exploring the limits of AI and human emotions.',
        },
        {
          title: 'Tenet',
          year: '2020',
          genre: 'Science-Fiction/Action',
          image: tenetImage,
          description:
            'Armed with only one word, "Tenet," and fighting for the survival of the world, a protagonist journeys through the twilight world of international espionage on a mission that will unfold in something beyond real time.',
          whyILoveIt: 'A complex narrative about time and perception.',
        },
        {
          title: 'La cité de la peur',
          year: '1994',
          genre: 'Comedy',
          image: lcdlpImage,
          description: 'A French comedy film that parodies horror and suspense films.',
          whyILoveIt: 'A classic of French humor with references to pop culture.',
        },
      ],
      fr: [
        {
          title: 'Matrix',
          year: '1999',
          genre: 'Science-Fiction/Action',
          image: matrixImage,
          description:
            "Un pirate informatique découvre, par l'intermédiaire de mystérieux rebelles, la véritable nature de sa réalité et son rôle dans la guerre contre ses contrôleurs.",
          whyILoveIt: "Effets visuels révolutionnaires et une histoire qui défie l'esprit.",
        },
        {
          title: 'Ghost in the Shell',
          year: '1995',
          genre: 'Anime/Science-Fiction',
          image: gitsImage,
          description: 'Une policière cyborg et son partenaire traquent un mystérieux hacker appelé le Puppet Master.',
          whyILoveIt: 'Animation cyberpunk pionnière avec des questions philosophiques profondes.',
        },
        {
          title: 'Inception',
          year: '2010',
          genre: 'Science-Fiction/Action',
          image: inceptionImage,
          description:
            "Un voleur qui dérobe des secrets d'entreprises grâce à une technologie de partage de rêves se voit confier la tâche inverse : implanter une idée dans l'esprit d'un P.D.G.",
          whyILoveIt: "Couches narratives complexes et concepts qui défient l'esprit.",
        },
        {
          title: 'Ex Machina',
          year: '2014',
          genre: 'Science-Fiction/Drama',
          image: exMachinaImage,
          description:
            "Un programmeur est sélectionné pour participer à une expérience révolutionnaire dans le domaine de l'intelligence artificielle en évaluant les capacités et la conscience d'un robot humanoïde.",
          whyILoveIt: "Explorer les limites de l'IA et des émotions humaines.",
        },
        {
          title: 'Tenet',
          year: '2020',
          genre: 'Science-Fiction/Action',
          image: tenetImage,
          description:
            "Muni d'un seul mot, \"Tenet,\" et décidé à se battre pour sauver le monde, un homme sillonne l'univers crépusculaire de l'espionnage international.",
          whyILoveIt: 'Un récit complexe sur le temps et la perception.',
        },
        {
          title: 'La cité de la peur',
          year: '1994',
          genre: 'Comédie',
          image: lcdlpImage,
          description: "Un film comique français qui parodie les films d'horreur et de suspense.",
          whyILoveIt: "Un classique de l'humour français avec des références à la culture pop.",
        },
      ],
    } as Movies,
    games: {
      en: [
        {
          title: 'Cyberpunk 2077',
          year: '2020',
          image: cp2077Image,
          description:
            'An open-world action-adventure game set in Night City, a metropolis obsessed with power, glamour, and body modification.',
          whyILoveIt: 'Immersive cyberpunk world with incredible attention to detail.',
        },
        {
          title: 'The Witcher 3: Wild Hunt',
          year: '2015',
          image: thewitcherImage,
          description:
            'An open-world RPG focused on storytelling, set in a visually stunning fantasy universe filled with meaningful choices and impactful consequences.',
          whyILoveIt: 'Rich storytelling and beautifully designed world.',
        },
        {
          title: 'A plague tale: Innocence/Requiem',
          year: '2019/2022',
          image: aptImage,
          description: 'An action-adventure narrative game following two children in a plague-ridden medieval France.',
          whyILoveIt: 'Emotive story and immersive atmosphere.',
        },
        {
          title: "Baldur's Gate 3",
          year: '2023',
          image: baldurImage,
          description:
            'A turn-based RPG based on the Dungeons & Dragons universe, offering freedom of exploration and choice.',
          whyILoveIt: 'Extremely immersive with meaningful choices and a rich world.',
        },
        {
          title: 'Little Miss Fortune',
          year: '2019',
          image: lmfImage,
          description: 'A narrative adventure game where you follow a little girl as she tries to find a treasure.',
          whyILoveIt: 'Disturbing story and unique aesthetic.',
        },
        {
          title: 'Hollow Knight',
          year: '2017',
          image: hollowknightImage,
          description: 'A challenging 2D action-adventure game set in a vast interconnected world.',
          whyILoveIt: 'Atmospheric world-building and precise, responsive controls.',
        },
      ],
      fr: [
        {
          title: 'Cyberpunk 2077',
          year: '2020',
          image: cp2077Image,
          description:
            "Un jeu d'action-aventure en monde ouvert situé à Night City, une mégalopole obsédée par le pouvoir, le glamour et la modification corporelle.",
          whyILoveIt: 'Monde cyberpunk immersif avec une attention incroyable aux détails.',
        },
        {
          title: 'The Witcher 3: Wild Hunt',
          year: '2015',
          image: thewitcherImage,
          description:
            "Un RPG en monde ouvert axé sur l'histoire, situé dans un univers fantastique visuellement époustouflant, rempli de choix significatifs et de conséquences impactantes.",
          whyILoveIt: 'Narration riche et monde magnifiquement conçu.',
        },
        {
          title: 'A plague tale: Innocence/Requiem',
          year: '2019/2022',
          image: aptImage,
          description:
            "Un jeu d'action-aventure narratif qui suit deux enfants dans une France médiévale ravagée par la peste.",
          whyILoveIt: "L'histoire émotive et l'atmosphère immersive.",
        },
        {
          title: "Baldur's Gate 3",
          year: '2023',
          image: baldurImage,
          description:
            "Un RPG au tour par tour basé sur l'univers de Donjons et Dragons, offrant une liberté d'exploration et de choix.",
          whyILoveIt: 'Extrêmement immersif avec des choix significatifs et un monde riche.',
        },
        {
          title: 'Little Miss Fortune',
          year: '2019',
          image: lmfImage,
          description: "Un jeu d'aventure narratif où vous suivez une petite fille qui cherche à trouver un trésor.",
          whyILoveIt: "L'histoire dérangeante et l'esthétique unique.",
        },
        {
          title: 'Hollow Knight',
          year: '2017',
          image: hollowknightImage,
          description: "Un jeu d'action-aventure 2D exigeant situé dans un monde vaste et interconnecté.",
          whyILoveIt: 'Construction atmosphérique du monde et contrôles précis et réactifs.',
        },
      ],
    } as Games,
    selectedProject: ref<localizedProject | null>(null),
  }),

  getters: {
    getLocalizedProjects: (state) => {
      const preferencesStore = usePreferencesStore();
      const lang = preferencesStore.language;

      return state.projects.map((project) => ({
        ...project,
        localizedName: project.name[lang ?? 'en'],
        localizedDescription: project.description[lang ?? 'en'],
      }));
    },
    getLocalizedExperiences: (state) => {
      const preferencesStore = usePreferencesStore();
      const lang = preferencesStore.language;

      return state.experiences.map((experience) => ({
        ...experience,
        localizedTitle: experience.title[lang ?? 'en'],
        localizedLocation: experience.location[lang ?? 'en'],
        localizedPeriod: experience.period[lang ?? 'en'],
        localizedDescription: experience.description[lang ?? 'en'],
        localizedAchievements: experience.achievements[lang ?? 'en'],
      }));
    },
    getLocalizedSkills: (state) => {
      const preferencesStore = usePreferencesStore();
      const lang = preferencesStore.language;

      return state.skills[lang ?? 'en'];
    },
    getLocalizedMovies: (state) => {
      const preferencesStore = usePreferencesStore();
      const lang = preferencesStore.language;

      return state.movies[lang ?? 'en'];
    },
    getLocalizedGames: (state) => {
      const preferencesStore = usePreferencesStore();
      const lang = preferencesStore.language;

      return state.games[lang ?? 'en'];
    },
  },
});
