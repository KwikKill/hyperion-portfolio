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
        date: {
          en: "Mar 30 2025",
          fr: "30 Mar 2025",
        },
        starred: true,
        technologies: ["Vue.js", "Tailwind CSS", "Pinia"],
        image: "/src/assets/projects/portfolio.webp",
        link: "#",
        github: "https://github.com/kwikkill/portfolio",
      },
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

