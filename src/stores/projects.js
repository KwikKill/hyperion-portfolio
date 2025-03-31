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
          en: "portfolio.vue",
          fr: "portfolio.vue",
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
        technologies: ["Vue.js", "Tailwind CSS", "Pinia", "Django", "DjangoREST", "Docker", "Nginx"],
        image: "/src/assets/projects/insalan.webp",
        link: "https://insalan.fr",
        github: "https://github.com/InsaLan/infra-insalan.fr",
      },
      {
        id: 3,
        name: {
          en: "Insalan.fr Monitoring",
          fr: "Surveillance Insalan.fr",
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

