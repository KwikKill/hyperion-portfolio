import { defineStore } from 'pinia';
import { ref } from 'vue';
import amphionImage from '@/assets/projects/amphion.webp';
import aptImage from '@/assets/games/a_plague_tale.webp';
import baldurImage from '@/assets/games/baldurs_gate_3.webp';
import clairobscureImage from '@/assets/games/clairobscure.webp';
import cp2077Image from '@/assets/games/cyberpunk_2077.webp';
import hollowknightImage from '@/assets/games/hollow_knight.webp';
import thewitcherImage from '@/assets/games/the_witcher_3.webp';
import exMachinaImage from '@/assets/movies/ex_machina.webp';
import gitsImage from '@/assets/movies/ghost_in_the_shell.webp';
import inceptionImage from '@/assets/movies/inception.webp';
import lcdlpImage from '@/assets/movies/la_cité_de_la_peur.webp';
import matrixImage from '@/assets/movies/matrix.webp';
import tenetImage from '@/assets/movies/tenet.webp';
import codepilotImage from '@/assets/projects/advent.webp';
import athena1 from '@/assets/projects/athena1.webp';
import athena2 from '@/assets/projects/athena2.webp';
import atlasImage from '@/assets/projects/atlas.webp';
import bombermanImage from '@/assets/projects/bomberman.webp';
import btcImage from '@/assets/projects/btc.webp';
import ceosImage from '@/assets/projects/ceos.webp';
import esport1 from '@/assets/projects/esportrecrutement1.webp';
import esport2 from '@/assets/projects/esportrecrutement2.webp';
import esport3 from '@/assets/projects/esportrecrutement3.webp';
import esport4 from '@/assets/projects/esportrecrutement4.webp';
import freelance1 from '@/assets/projects/freelance1.webp';
import freelance2 from '@/assets/projects/freelance2.webp';
import freelance3 from '@/assets/projects/freelance3.webp';
import freelance4 from '@/assets/projects/freelance4.webp';
import hephaistosImage from '@/assets/projects/hephaistos.webp';
import indexerImage from '@/assets/projects/indexer.webp';
import infographiqueImage from '@/assets/projects/infographique.webp';
import insalanImage from '@/assets/projects/insalan.webp';
import insaplace1 from '@/assets/projects/insaplace1.webp';
import insaplace2 from '@/assets/projects/insaplace2.webp';
import lightshieldImage from '@/assets/projects/lightshield.webp';
import metisImage from '@/assets/projects/metis.webp';
import mindustryImage from '@/assets/projects/mindustry.webp';
import minecraftImage from '@/assets/projects/minecraft.webp';
import mnemosyne1 from '@/assets/projects/mnemosyne1.webp';
import mnemosyne2 from '@/assets/projects/mnemosyne2.webp';
import monitImage from '@/assets/projects/monit.webp';
import portfolioImage from '@/assets/projects/portfolio.webp';
import polis1 from '@/assets/projects/polis1.webp';
import polis2 from '@/assets/projects/polis2.webp';
import pshImage from '@/assets/projects/psh.webp';
import rankupImage from '@/assets/projects/rankup.webp';
import rankupwebImage from '@/assets/projects/rankup-website.webp';
import revuesImage from '@/assets/projects/revues.webp';
import stackImage from '@/assets/projects/stack.webp';
import talosImage from '@/assets/projects/talos.webp';
import umamiImage from '@/assets/projects/umami.webp';
import vfsImage from '@/assets/projects/vfs.webp';
import type { Experience } from '@/models/experience';
import type { Formation } from '@/models/formation';
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
          en: 'RankUp LoL Discord Bot',
          fr: 'Bot Discord RankUp LoL',
        },
        description: {
          en: 'A Discord bot providing detailed League of Legends stats.\n- Rank tracking and server leaderboards\n- Match data fetched from the Riot Games API\n- Displayed in Discord with the Discord.js library',
          fr: 'Un bot Discord qui donne des statistiques détaillées sur League of Legends.\n- Suivi des rangs et classements des joueurs du serveur\n- Données de match récupérées via l\'API de Riot Games\n- Affichage dans Discord avec la bibliothèque Discord.js',
        },
        file: {
          en: 'rankup.js',
          fr: 'rankup.js',
        },
        date: '2019-2026',
        starred: true,
        category: 'personal',
        status: 'online',
        technologies: ['JavaScript', 'Discord.js', 'Docker', 'PostgreSQL', 'Git'],
        images: [rankupImage],
        note: {
          en: '600+ Users',
          fr: '600+ Utilisateurs',
        },
        link: 'https://rankup.somi.blaisot.org/',
        github: 'https://github.com/KwikKill/Kwik_bot',
        completed: true,
      },
      {
        name: {
          en: 'Polis',
          fr: 'Polis',
        },
        subtitle: {
          en: 'Generative GitHub City',
          fr: 'Ville Générative GitHub',
        },
        description: {
          en: 'Polis turns a GitHub account into a generative night city.\n- Every repository becomes a building: height maps to commit count, color to primary language, glow to stars\n- Cities can be published to a shared, persistent 3D planet, linked to each other by roads\n- Next.js, React Three Fiber, Prisma/PostgreSQL and GitHub OAuth via Auth.js',
          fr: 'Polis transforme un compte GitHub en ville générative nocturne.\n- Chaque dépôt devient un bâtiment : la hauteur suit le nombre de commits, la couleur le langage principal, la luminosité le nombre d\'étoiles\n- Les villes se publient sur une planète 3D partagée et persistante, reliées entre elles par des routes\n- Next.js, React Three Fiber, Prisma/PostgreSQL et authentification GitHub via Auth.js',
        },
        file: {
          en: 'polis.html',
          fr: 'polis.html',
        },
        date: '2026',
        starred: true,
        category: 'personal',
        status: 'online',
        technologies: ['Next.js', 'React', 'Three.js', 'HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'Prisma', 'PostgreSQL', 'Docker', 'Caddy', 'Git'],
        images: [
          polis1,
          polis2,
        ],
        link: 'https://polis.somi.blaisot.org/',
        github: 'https://github.com/KwikKill/polis',
        completed: true,
      },
      {
        name: {
          en: 'Mnemosyne',
          fr: 'Mnemosyne',
        },
        subtitle: {
          en: 'Neural Diagnostic Terminal',
          fr: 'Terminal de Diagnostic Neuronal',
        },
        description: {
          en: 'A hand-written multilayer perceptron, trained live in the browser and inspected through a Signalis-inspired terminal interface.\n- No ML library: forward pass, backpropagation and gradient descent written from scratch\n- Training runs in a Web Worker while a network diagram, decision-boundary heatmap and loss chart render live on canvas\n- Custom-painted datasets, learning-rate scheduling, synaptic pruning, classification metrics and scrubbable training replay',
          fr: 'Un perceptron multicouche codé à la main, entraîné en direct dans le navigateur et inspecté via une interface terminal inspirée de Signalis.\n- Aucune bibliothèque de ML : propagation avant, rétropropagation et descente de gradient écrites à la main\n- Entraînement dans un Web Worker, avec diagramme du réseau, carte de frontière de décision et courbe de perte en direct sur canvas\n- Jeux de données peints à la main, planification du taux d\'apprentissage, élagage synaptique, métriques de classification et relecture de l\'entraînement',
        },
        file: {
          en: 'mnemosyne.html',
          fr: 'mnemosyne.html',
        },
        date: '2026',
        starred: true,
        category: 'personal',
        status: 'online',
        technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Web Workers', 'Canvas API', 'Docker', 'Caddy', 'Git'],
        images: [
          mnemosyne1,
          mnemosyne2,
        ],
        link: 'https://mnemosyne.somi.blaisot.org/',
        github: 'https://github.com/KwikKill/mnemosyne',
        completed: true,
      },
      {
        name: {
          en: 'Umami (personal fork)',
          fr: 'Umami (fork personnel)',
        },
        description: {
          en: 'A personal fork of the open-source Umami analytics platform, running a self-hosted, privacy-first instance for all my websites.\n- Cross-site dashboard aggregating stats from every registered site\n- Accurate SPA bounce and session-duration tracking through a heartbeat ping\n- Chart annotations, scoped API keys and an MCP server exposing stats to LLM agents\n- Every push to master is tested, built and published automatically to GHCR',
          fr: 'Fork personnel d\'Umami, la plateforme d\'analytics open source, qui fait tourner une instance auto-hébergée et respectueuse de la vie privée pour tous mes sites.\n- Dashboard multi-sites qui agrège les statistiques de tous les sites enregistrés\n- Suivi précis des rebonds et durées de session sur les SPA grâce à un ping de heartbeat\n- Annotations sur les graphiques, clés API à portée limitée et serveur MCP qui expose les statistiques aux agents LLM\n- Chaque push sur master est testé, buildé et publié automatiquement sur GHCR',
        },
        file: {
          en: 'umami.html',
          fr: 'umami.html',
        },
        date: '2026',
        starred: true,
        category: 'personal',
        status: 'online',
        technologies: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'GitHub Actions', 'Git'],
        images: [umamiImage],
        note: {
          en: 'Used in Production',
          fr: 'Utilisé en Production',
        },
        github: 'https://github.com/KwikKill/umami',
        completed: true,
      },
      {
        name: {
          en: 'EsportRecrutement.fr',
          fr: 'EsportRecrutement.fr',
        },
        description: {
          en: 'An esports recruitment platform built full stack, as freelance work for a client.\n- Players create a profile in the directory, search for teams and apply for open positions\n- Announcements, blog, user chat and payment\n- Complete admin panel\n- Next.js with a PostgreSQL database',
          fr: 'Plateforme de recrutement e-sport développée en full stack, en freelance pour un client.\n- Les joueurs créent leur profil dans l\'annuaire, cherchent des équipes et postulent aux postes proposés\n- Système d\'annonces, blog, chat entre utilisateurs et paiement\n- Panel d\'administration complet\n- Next.js et base de données PostgreSQL',
        },
        file: {
          en: 'esportrecrutement.html',
          fr: 'esportrecrutement.html',
        },
        date: '2025-2026',
        starred: true,
        category: 'client',
        status: 'online',
        technologies: ['Next.js', 'React', 'HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'PostgreSQL', 'Docker', 'Caddy', 'Git'],
        images: [
          esport1,
          esport2,
          esport3,
          esport4,
        ],
        link: 'https://esportrecrutement.fr/',
        completed: true,
        note: {
          en: 'Freelance Project',
          fr: 'Projet Freelance',
        },
      },
      {
        name: {
          en: 'Amphion',
          fr: 'Amphion',
        },
        subtitle: {
          en: 'Music Sequencer',
          fr: 'Séquenceur Musical',
        },
        description: {
          en: 'A music sequencer to create your own music by arranging sounds on a timeline.\n- Designed around animations and a smooth user experience\n- Built with Next.js',
          fr: 'Un séquenceur musical pour composer sa propre musique en disposant des sons sur une timeline.\n- Pensé autour des animations et d\'une expérience utilisateur fluide\n- Construit avec Next.js',
        },
        file: {
          en: 'amphion.html',
          fr: 'amphion.html',
        },
        date: '2026',
        starred: true,
        category: 'personal',
        status: 'online',
        technologies: ['Next.js', 'React', 'HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'Docker', 'Caddy', 'Git'],
        images: [
          amphionImage,
        ],
        link: 'https://amphion.somi.blaisot.org/',
        github: 'https://github.com/KwikKill/amphion/',
        completed: true,
      },
      {
        name: {
          en: 'Athena',
          fr: 'Athena',
        },
        subtitle: {
          en: 'Dashboard Builder',
          fr: 'Constructeur de Dashboard',
        },
        description: {
          en: 'A dashboard builder to create your own custom dashboards from REST API data sources.\n- Inspired by Grafana, and by JQ for data transformations\n- Data storage and authentication handled by Supabase\n- Built with Next.js',
          fr: 'Un constructeur de dashboards pour créer ses propres tableaux de bord à partir de sources de données d\'API REST.\n- Inspiré de Grafana, et de JQ pour les transformations de données\n- Données et authentification gérées par Supabase\n- Construit avec Next.js',
        },
        file: {
          en: 'athena.html',
          fr: 'athena.html',
        },
        date: '2025',
        starred: true,
        category: 'personal',
        status: 'online',
        technologies: ['Next.js', 'React', 'HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'Supabase', 'Docker', 'Caddy', 'Git'],
        images: [
          athena1,
          athena2,
        ],
        link: 'https://athena.somi.blaisot.org/',
        completed: true,
      },
      {
        name: {
          en: 'Freelance Website',
          fr: 'Site freelancing',
        },
        description: {
          en: 'My freelance web developer showcase website.\n- Presents my services, skills and achievements\n- Built with Vue.js, with a PostgreSQL database',
          fr: 'Mon site vitrine de développeur web freelance.\n- Présente mes services, mes compétences et mes réalisations\n- Construit avec Vue.js, avec une base de données PostgreSQL',
        },
        file: {
          en: 'freelance.html',
          fr: 'freelance.html',
        },
        date: '2025',
        starred: false,
        category: 'personal',
        status: 'online',
        technologies: ['Vite', 'Vue.js', 'HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'Docker', 'Caddy', 'Git'],
        images: [
          freelance1,
          freelance2,
          freelance3,
          freelance4,
        ],
        link: 'https://freelance.somi.blaisot.org/',
        completed: true,
        note: {
          en: 'Freelance Website',
          fr: 'Site vitrine freelance',
        },
      },
      {
        name: {
          en: 'Metis',
          fr: 'Metis',
        },
        subtitle: {
          en: 'Job search Dashboard',
          fr: 'Dashboard de recherche d\'emploi',
        },
        description: {
          en: 'A job search dashboard to keep track of your applications.\n- Add, edit and delete applications\n- Filter them by status: applied, interview, etc.\n- Built with React, with data saved in the browser\'s local storage',
          fr: 'Un tableau de bord de recherche d\'emploi pour suivre ses candidatures.\n- Ajout, modification et suppression de candidatures\n- Filtre par statut : candidature envoyée, entretien, etc.\n- Construit avec React, données enregistrées dans le stockage local du navigateur',
        },
        file: {
          en: 'metis.html',
          fr: 'metis.html',
        },
        date: '2025',
        starred: false,
        category: 'personal',
        status: 'online',
        technologies: ['Next.js', 'React', 'HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'Docker', 'Git'],
        images: [metisImage],
        link: 'https://metis.somi.blaisot.org/',
        github: 'https://github.com/KwikKill/metis',
        completed: true,
      },
      {
        name: {
          en: 'Talos',
          fr: 'Talos',
        },
        subtitle: {
          en: 'Virtual OS',
          fr: 'OS Virtuel',
        },
        description: {
          en: 'A website simulating a virtual operating system, with a Windows 95 and Linux inspired interface.\n- Browse files and run applications\n- A purely demonstrative project, with no real functionality\n- Built with React',
          fr: 'Un site qui simule un système d\'exploitation virtuel, avec une interface inspirée de Windows 95 et de Linux.\n- Navigation dans les fichiers et lancement d\'applications\n- Projet purement démonstratif, sans fonctionnalité réelle\n- Construit avec React',
        },
        file: {
          en: 'talos.html',
          fr: 'talos.html',
        },
        date: '2025',
        starred: true,
        category: 'personal',
        status: 'online',
        technologies: ['Next.js', 'React', 'HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'Docker', 'Git'],
        images: [talosImage],
        link: 'https://talos.somi.blaisot.org/',
        github: 'https://github.com/KwikKill/talos',
        completed: true,
      },
      {
        name: {
          en: 'Hephaistos',
          fr: 'Hephaistos',
        },
        subtitle: {
          en: 'Website Builder',
          fr: 'Constructeur de site web',
        },
        description: {
          en: 'A website builder to easily create your own simple websites.\n- User-friendly interface to create and customize web pages\n- Built with React',
          fr: 'Un constructeur de sites web pour créer facilement ses propres sites simples.\n- Interface conviviale pour créer et personnaliser des pages web\n- Construit avec React',
        },
        file: {
          en: 'hephaistos.html',
          fr: 'hephaistos.html',
        },
        date: '2025',
        starred: true,
        category: 'personal',
        status: 'online',
        technologies: ['Next.js', 'React', 'HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'Docker', 'Git'],
        images: [hephaistosImage],
        link: 'https://hephaistos.somi.blaisot.org/',
        github: 'https://github.com/KwikKill/hephaistos',
        completed: true,
      },
      {
        name: {
          en: 'Break the code',
          fr: 'Break the code',
        },
        description: {
          en: 'Team participation in Sopra Steria\'s "Break the Code" algorithmic competition, open to computer science students from Rennes schools.\n- 6th out of 64 participants in the second year\n- 6th out of 69 in the third year\n- 4th out of 42 in the fourth year\n- 8th in the fifth and final year',
          fr: 'Participation en équipe au concours d\'algorithmique « Break the Code » de Sopra Steria, ouvert aux étudiants des écoles d\'informatique de Rennes.\n- 6e sur 64 participants dès la deuxième année\n- 6e sur 69 la troisième année\n- 4e sur 42 la quatrième année\n- 8e la cinquième et dernière année',
        },
        file: {
          en: 'breakthecode.html',
          fr: 'breakthecode.html',
        },
        date: '2021-2025',
        starred: true,
        category: 'competition',
        status: 'finished',
        technologies: ['Python', 'JavaScript'],
        images: [btcImage],
        note: {
          en: 'Competition',
          fr: 'Compétition',
        },
        link: 'https://www.linkedin.com/posts/m-paris_breakthecode-challenge-codage-activity-7272240941552340992-maS5',
        completed: false,
      },
      {
        name: {
          en: 'Atlas',
          fr: 'Atlas',
        },
        subtitle: {
          en: '3D World Map',
          fr: 'Carte du Monde 3D',
        },
        description: {
          en: 'An interactive 3D world map.\n- Globe rendered with Three.js: zoom in and out, click a country to see information about it\n- Data retrieved from the RestCountries and geojson.xyz REST APIs',
          fr: 'Une carte du monde interactive en 3D.\n- Globe affiché avec Three.js : zoom, dézoom et clic sur un pays pour afficher ses informations\n- Données récupérées via les API REST RestCountries et geojson.xyz',
        },
        file: {
          en: 'atlas.html',
          fr: 'atlas.html',
        },
        date: '2025',
        starred: false,
        category: 'personal',
        status: 'online',
        technologies: ['Next.js', 'React', 'Three.js', 'HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'Docker', 'Git'],
        images: [atlasImage],
        link: 'https://atlas.somi.blaisot.org/',
        github: 'https://github.com/KwikKill/Atlas',
        completed: false,
      },
      {
        name: {
          en: 'Ceos',
          fr: 'Ceos',
        },
        subtitle: {
          en: 'Todo App',
          fr: 'Todo App',
        },
        description: {
          en: 'A todo app, built as a personal project to learn React.\n- Create, edit and delete tasks\n- Filter tasks by status: completed or not\n- Built with React and Tailwind CSS',
          fr: 'Une application de gestion de tâches, réalisée comme projet personnel pour apprendre React.\n- Création, modification et suppression de tâches\n- Filtre par statut : terminées ou non terminées\n- Construite avec React et Tailwind CSS',
        },
        file: {
          en: 'ceos.html',
          fr: 'ceos.html',
        },
        date: '2025',
        starred: false,
        category: 'personal',
        status: 'online',
        technologies: ['Next.js', 'React', 'HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'Docker', 'Git'],
        images: [ceosImage],
        link: 'https://ceos.somi.blaisot.org/',
        github: 'https://github.com/KwikKill/ceos',
        completed: false,
      },
      {
        name: {
          en: 'Portfolio Website',
          fr: 'Site Portfolio',
        },
        description: {
          en: 'A responsive portfolio website built with Vue.js and Tailwind CSS, in two versions.\n- A classic version\n- A version closer to my graphic style and tastes',
          fr: 'Un site portfolio responsive, construit avec Vue.js et Tailwind CSS, en deux versions.\n- Une version classique\n- Une version plus proche de mon style graphique et de mes goûts',
        },
        file: {
          en: 'portfolio.html',
          fr: 'portfolio.html',
        },
        date: '2025',
        starred: true,
        category: 'personal',
        status: 'online',
        technologies: ['Vite', 'Vue.js', 'HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'Pinia', 'Docker', 'Git'],
        images: [portfolioImage],
        link: '#',
        github: 'https://github.com/KwikKill/hyperion-portfolio',
        completed: true,
      },
      {
        name: {
          en: 'Insalan.fr Website',
          fr: 'Site Insalan.fr',
        },
        description: {
          en: 'Rewrite of the INSALAN association\'s website, led as development manager.\n- Backend rewritten in Django and DjangoREST\n- Frontend rewritten in Vue.js and Tailwind\n- Hosted on an INSA Rennes VPS, with Nginx as a reverse proxy',
          fr: 'Refonte du site de l\'association INSALAN, menée en tant que responsable développement.\n- Backend réécrit en Django et DjangoREST\n- Frontend réécrit en Vue.js et Tailwind\n- Hébergement sur un VPS de l\'INSA Rennes, avec Nginx en reverse proxy',
        },
        file: {
          en: 'insalan.html',
          fr: 'insalan.html',
        },
        date: '2023-2025',
        starred: true,
        category: 'association',
        status: 'online',
        technologies: ['Vite', 'Vue.js', 'HTML', 'CSS', 'Tailwind CSS', 'Pinia', 'JavaScript', 'TypeScript', 'Django', 'DjangoREST', 'Docker', 'Nginx', 'PostgreSQL', 'Git'],
        images: [insalanImage],
        note: {
          en: 'Team Management',
          fr: 'Gestion d\'équipe',
        },
        link: 'https://insalan.fr',
        github: 'https://github.com/InsaLan/infra-insalan.fr',
        completed: true,
      },
      {
        name: {
          en: 'Insaplace',
          fr: 'Insaplace',
        },
        description: {
          en: 'A "pixel war" inspired by Reddit\'s r/place, made for INSA students, which brought together over 1,000 users in one week.\n- Each user colors one pixel every X minutes on a large shared canvas, to draw or write together\n- My role in this collaborative project: an achievements system and visual events\n- Supervising the site throughout the event',
          fr: 'Une « guerre de pixels » inspirée de r/place de Reddit, réalisée pour les étudiants de l\'INSA, qui a réuni plus de 1 000 utilisateurs en une semaine.\n- Chaque utilisateur colorie un pixel toutes les X minutes sur une grande toile partagée, pour dessiner ou écrire à plusieurs\n- Mon rôle dans ce projet collaboratif : système de succès et événements visuels\n- Supervision du site pendant toute la durée de l\'événement',
        },
        file: {
          en: 'insaplace.html',
          fr: 'insaplace.html',
        },
        date: '2025',
        starred: true,
        category: 'association',
        status: 'finished',
        technologies: ['Go', 'GoFiber', 'HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'Docker', 'Traefik', 'PostgreSQL', 'Kafka', 'Protobuf', 'Git'],
        images: [
          insaplace1,
          insaplace2,
        ],
        note: {
          en: 'Event Project',
          fr: 'Projet Événementiel',
        },
      },
      {
        name: {
          en: 'Insalan.fr Monitoring',
          fr: 'Métrologie Insalan.fr',
        },
        description: {
          en: 'A monitoring setup for the insalan.fr website.\n- Telegraf, InfluxDB and Grafana stack\n- Tracks traffic, response times and other metrics from Nginx logs',
          fr: 'Mise en place de la métrologie du site insalan.fr.\n- Stack Telegraf, InfluxDB et Grafana\n- Suivi du trafic, des temps de réponse et d\'autres métriques à partir des logs Nginx',
        },
        file: {
          en: 'insalan-monitoring.html',
          fr: 'insalan-monitoring.html',
        },
        date: '2025',
        starred: false,
        category: 'association',
        status: 'finished',
        technologies: ['Grafana', 'Telegraf', 'InfluxDB', 'Nginx', 'Docker', 'Git'],
        images: [monitImage],
        github: 'https://github.com/InsaLan/infra-insalan.fr/blob/main/docker-compose-analytics.yml',
        completed: false,
      },
      {
        name: {
          en: 'Infographique',
          fr: 'Infographique',
        },
        description: {
          en: 'A project for the computer graphics module at INSA Rennes, made in C++ with SFML.\n- Creating a video from a 3D model',
          fr: 'Projet du module d\'informatique graphique de l\'INSA Rennes, réalisé en C++ avec SFML.\n- Création d\'une vidéo à partir d\'une modélisation 3D',
        },
        file: {
          en: 'infographique.html',
          fr: 'infographique.html',
        },
        date: '2024',
        starred: false,
        category: 'school',
        status: 'finished',
        technologies: ['C++', 'SFML', 'Blender', 'Git'],
        images: [infographiqueImage],
        note: {
          en: 'School Assignment',
          fr: 'Projet Scolaire',
        },
        link: 'https://youtu.be/HfP1gKB0Cpg',
        github: 'https://github.com/KwikKill/infographique',
        completed: false,
      },
      {
        name: {
          en: 'Bomberman AI',
          fr: 'IA Bomberman',
        },
        description: {
          en: 'A Bomberman replica in C++ with SFML, and an AI that plays it, for the "AI for games" module at INSA Rennes.\n- AI based on the MCTS (Monte Carlo Tree Search) algorithm\n- UCB1 pruning to pick the best move each turn',
          fr: 'Une réplique de Bomberman en C++ avec SFML, et une IA qui y joue, pour le module « IA pour les jeux » de l\'INSA Rennes.\n- IA basée sur l\'algorithme MCTS (Monte Carlo Tree Search)\n- Élagage UCB1 pour choisir le meilleur coup à chaque tour',
        },
        file: {
          en: 'bomberman.py',
          fr: 'bomberman.py',
        },
        date: '2024',
        starred: false,
        category: 'school',
        status: 'finished',
        technologies: ['C++', 'SFML', 'Git'],
        images: [bombermanImage],
        note: {
          en: 'School Assignment',
          fr: 'Projet Scolaire',
        },
        github: 'https://github.com/KwikKill/Bomberman',
        completed: false,
      },
      {
        name: {
          en: 'Advent of Codpilote',
          fr: 'Advent of Codpilote',
        },
        description: {
          en: 'Solving Advent of Code puzzles with GitHub Copilot only.\n- Main rule: no code written by hand\n- Unfinished project',
          fr: 'Résoudre les problèmes de l\'Advent of Code uniquement avec GitHub Copilot.\n- Règle principale : interdiction d\'écrire du code soi-même\n- Projet non terminé',
        },
        file: {
          en: 'adventofcode.html',
          fr: 'adventofcode.html',
        },
        date: '2023-2024',
        starred: false,
        category: 'personal',
        status: 'unfinished',
        technologies: ['Python', 'JavaScript', 'TypeScript', 'Git'],
        images: [codepilotImage],
        github: 'https://github.com/KwikKill/advent-of-codpilote',
        completed: false,
      },
      {
        name: {
          en: 'Lightshield improvement',
          fr: 'Amélioration de Lightshield',
        },
        description: {
          en: 'Lightshield is a self-contained pipeline keeping a local mirror of the Riot Games API.\n- I cloned the project, fixed some bugs and improved it',
          fr: 'Lightshield est un pipeline autonome qui maintient un miroir local de l\'API Riot Games.\n- J\'ai cloné le projet, corrigé quelques bugs et l\'ai amélioré',
        },
        file: {
          en: 'lightshield.py',
          fr: 'lightshield.py',
        },
        date: '2024',
        starred: false,
        category: 'personal',
        status: 'finished',
        technologies: ['Python', 'JavaScript', 'Docker', 'Redis', 'PostgreSQL', 'Git'],
        images: [lightshieldImage],
        note: {
          en: 'Open Source Contribution',
          fr: 'Contribution Open Source',
        },
        github: 'https://github.com/KwikKill/Lightshield',
        completed: false,
      },
      {
        name: {
          en: 'Document indexer',
          fr: 'Indexeur de documents',
        },
        description: {
          en: 'A document indexer and search tool in Python, made for the TALEO (automatic processing of written and spoken language) module at INSA Rennes.\n- Builds an inverted index from a set of documents\n- Word search with results displayed as a list\n- Several algorithms implemented: tf-idf, BM25, Dirichlet…',
          fr: 'Un indexeur et un outil de recherche de documents en Python, réalisé pour le module TALEO (Traitement Automatique du Langage Écrit et Oral) de l\'INSA Rennes.\n- Création d\'un index inversé à partir d\'un ensemble de documents\n- Recherche de mots et affichage des résultats sous forme de liste\n- Plusieurs algorithmes implémentés : tf-idf, BM25, Dirichlet…',
        },
        file: {
          en: 'indexer.py',
          fr: 'indexer.py',
        },
        date: '2024',
        starred: false,
        category: 'school',
        status: 'finished',
        technologies: ['Python', 'Git'],
        images: [indexerImage],
        note: {
          en: 'School Assignment',
          fr: 'Projet Scolaire',
        },
        github: 'https://github.com/KwikKill/TALEO',
        completed: false,
      },
      {
        name: {
          en: 'Journals generation',
          fr: 'Génération de revues',
        },
        description: {
          en: 'A research project carried out during my studies at INSA Rennes.\n- Improving a Python pipeline that generates historical reviews of Ancien Régime soldiers',
          fr: 'Projet de recherche mené pendant mon cursus à l\'INSA Rennes.\n- Amélioration d\'un pipeline Python qui génère des revues historiques sur les soldats de l\'Ancien Régime',
        },
        file: {
          en: 'journals.py',
          fr: 'revues.py',
        },
        date: '2023-2024',
        starred: false,
        category: 'school',
        status: 'finished',
        technologies: ['Python', 'LaTeX'],
        images: [revuesImage],
        note: {
          en: 'Research Project',
          fr: 'Projet de Recherche',
        },
        link: 'https://www.irisa.fr/article/2023-09/la-creation-de-revues-numeriques-des-registres-des-soldats-de-lancien-regime-un',
        completed: false,
      },
      {
        name: {
          en: 'PSH website',
          fr: 'Site PSH',
        },
        description: {
          en: 'A static website for a humanities project at INSA Rennes, on the topic "What is the impact of digital technology on access to culture?".\n- The format was either a website or a PDF document: the choice was quickly made',
          fr: 'Un site statique pour un projet de sciences humaines à l\'INSA Rennes, sur le thème « Quel est l\'impact du numérique sur l\'accès à la culture ? ».\n- Le format était au choix entre un site internet et un document PDF : le choix a été vite fait',
        },
        file: {
          en: 'psh.html',
          fr: 'psh.html',
        },
        date: '2023',
        starred: false,
        category: 'school',
        status: 'online',
        technologies: ['Vite', 'Vue.js', 'HTML', 'CSS', 'Tailwind CSS', 'Docker', 'Git'],
        images: [pshImage],
        note: {
          en: 'School Assignment',
          fr: 'Projet Scolaire',
        },
        link: 'https://psh.blaisot.org/',
        completed: false,
      },
      {
        name: {
          en: 'RankUp website',
          fr: 'Site RankUp',
        },
        description: {
          en: 'The showcase website for my Discord bot RankUp.\n- Presents the bot and explains how to use it\n- Significant work on SEO and indexing',
          fr: 'Le site vitrine de mon bot Discord RankUp.\n- Présente le bot et explique comment l\'utiliser\n- travail important sur le SEO et le référencement',
        },
        file: {
          en: 'rankup-website.html',
          fr: 'rankup-website.html',
        },
        date: '2023',
        starred: false,
        category: 'personal',
        status: 'online',
        technologies: ['Nuxt', 'Vite', 'Vue.js', 'HTML', 'CSS', 'Tailwind CSS', 'Docker', 'Git'],
        images: [rankupwebImage],
        note: {
          en: 'Personal Project',
          fr: 'Projet Personnel',
        },
        link: 'https://rankup.somi.blaisot.org/',
        completed: true,
      },
      {
        name: {
          en: 'Stack Web',
          fr: 'Stack Web',
        },
        description: {
          en: 'The deployment stack hosting my dockerized websites, including this one.\n- Caddy server with automatic HTTPS and one dynamically discovered config fragment per site\n- Docker containers and their associated configurations',
          fr: 'La stack de déploiement qui héberge mes sites dockerisés, dont celui-ci.\n- Serveur Caddy avec HTTPS automatique et un fragment de configuration découvert dynamiquement par site\n- Conteneurs Docker et leurs configurations associées',
        },
        file: {
          en: 'stack.html',
          fr: 'stack.html',
        },
        date: '2023',
        starred: false,
        category: 'personal',
        status: 'online',
        technologies: ['Docker', 'Caddy', 'Shell Script', 'Git'],
        images: [stackImage],
        note: {
          en: 'Used in Production',
          fr: 'Utilisé en Production',
        },
        completed: false,
      },
      {
        name: {
          en: 'Virtual file system',
          fr: 'Système de fichiers virtuel',
        },
        description: {
          en: 'A virtual file system in Python, using a file as its disk.\n- Create, delete and move files and directories\n- Partition table\n- Choice of RAID type',
          fr: 'Un système de fichiers virtuel en Python, qui utilise un fichier comme disque.\n- Création, suppression et déplacement de fichiers et de répertoires\n- Table de partitionnement\n- Choix du type de RAID',
        },
        file: {
          en: 'virtualfs.py',
          fr: 'virtualfs.py',
        },
        date: '2020',
        starred: false,
        category: 'school',
        status: 'finished',
        technologies: ['Python', 'Git'],
        images: [vfsImage],
        note: {
          en: 'School Assignment',
          fr: 'Projet Scolaire',
        },
        github: 'https://github.com/KwikKill/Virtual-File-System',
        completed: false,
      },
      {
        name: {
          en: 'Minecraft server management',
          fr: "Gestion d'un serveur Minecraft",
        },
        description: {
          en: 'A plugin and a website for a Minecraft server.\n- The plugin generates random buildings in the server world and interacts with several APIs\n- The website was a static showcase',
          fr: 'Un plugin et un site internet pour un serveur Minecraft.\n- Le plugin génère des bâtiments aléatoires dans le monde du serveur et interagit avec plusieurs API\n- Le site était une vitrine statique',
        },
        file: {
          en: 'minecraft-plugin.java',
          fr: 'minecraft-plugin.java',
        },
        date: '2018-2020',
        starred: false,
        category: 'personal',
        status: 'finished',
        technologies: ['Java', 'HTML', 'CSS'],
        images: [minecraftImage],
        completed: false,
      },
      {
        name: {
          en: 'Mindustry modding',
          fr: 'Modding Mindustry',
        },
        description: {
          en: 'A modded version of Mindustry, a real-time strategy game, developed in Java.\n- Added new blocks and new resources\n- The game did not support modding yet, so the mod is a modified version of the game itself',
          fr: 'Une version moddée de Mindustry, un jeu de stratégie en temps réel, développée en Java.\n- Ajout de nouveaux blocs et de nouvelles ressources\n- Le jeu ne gérait pas encore les mods à l\'époque : il a fallu modifier le jeu lui-même',
        },
        file: {
          en: 'mindustry-mod.java',
          fr: 'mindustry-mod.java',
        },
        date: '2018',
        starred: false,
        category: 'personal',
        status: 'finished',
        technologies: ['Java', 'Git'],
        images: [mindustryImage],
        note: {
          en: 'Open Source Contribution',
          fr: 'Contribution Open Source',
        },
        github: 'https://github.com/KwikKill/Anuken-Mindustry',
        completed: false,
      },
    ] as Project[],
    experiences: [
      {
        title: {
          en: 'Software Engineer - Web Developer (Permanent Contract)',
          fr: 'Ingénieur Informatique - Développeur Web (CDI)',
        },
        company: 'Sopra Steria',
        location: {
          en: 'Rennes, France',
          fr: 'Rennes, France',
        },
        period: {
          en: 'September 2026 - Present',
          fr: 'Depuis Septembre 2026',
        },
        description: {
          fr: 'Refonte d\'une application web de gestion monétaire et de suivi de contrats pour un client au sein d\'une équipe agile. Cette refonte a été réalisée avec Angular et Spring Boot.',
          en: 'Redesign of a web application for monetary management and contract tracking for a client within an agile team. This redesign was carried out with Angular and Spring Boot.',
        },
        technologies: ['Angular', 'Spring Boot', 'HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'Oracle SQL', 'Tomcat', 'OpenAPI', 'OpenAPI Generator', 'Jira', 'GitLab', 'Figma'],
        achievements: {
          en: [
            'Redesign of a web application for monetary management and contract tracking',
            'Integration of accessibility and ergonomics criteria to improve user experience',
            'Collaboration with a team of developers, designers, and project managers',
          ],
          fr: [
            'Refonte d\'une application web de gestion monétaire et de suivi de contrats',
            'Intégration de critères d\'accessibilité et d\'ergonomie pour améliorer l\'expérience utilisateur',
            'Collaboration avec une équipe de développeurs, designers et chefs de projet',
          ],
        },
      },
      {
        title: {
          fr: 'Développeur Freelance',
          en: 'Freelance Developer',
        },
        company: 'Gabriel Blaisot',
        freelance: true,
        location: {
          en: 'Rennes, France',
          fr: 'Rennes, France',
        },
        period: {
          en: 'June 2025 - Present',
          fr: 'Depuis Juin 2025',
        },
        description: {
          fr: 'Développement de site internet en tant que développeur freelance en micro entreprise. Cette activité m\'a permis de gérer plusieurs facette de l\'entreprise : la recherche et la relation client, la gestion de projet et le développement web.',
          en: 'Development of websites as a freelance developer in a micro-enterprise. This activity allowed me to manage several aspects of the business: client research and relations, project management, and web development.',
        },
        technologies: ['Next.js', 'React', 'HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'PostgreSQL', 'Docker'],
        achievements: {
          en: [
            'Developed a community esports recruitment website from scratch',
          ],
          fr: [
            'Développement de A à Z d\'un site de recrutement esports communautaire',
          ],
        },
      },
      {
        title: {
          en: 'Web Development Intern (6 months)',
          fr: 'Stage de développement web (6 mois)',
        },
        company: 'Sopra Steria',
        location: {
          en: 'Rennes, France',
          fr: 'Rennes, France',
        },
        period: {
          en: 'February 2026 - August 2026',
          fr: 'Février 2026 - Août 2026',
        },
        description: {
          fr: 'Refonte d\'une application web de gestion monétaire et de suivi de contrats pour un client au sein d\'une équipe agile. Cette refonte a été réalisée avec Angular et Spring Boot.',
          en: 'Redesign of a web application for monetary management and contract tracking for a client within an agile team. This redesign was carried out with Angular and Spring Boot.',
        },
        technologies: ['Angular', 'Spring Boot', 'HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'TypeScript', 'Oracle SQL', 'Tomcat', 'OpenAPI', 'OpenAPI Generator', 'Jira', 'GitLab', 'Figma'],
        achievements: {
          en: [
            'Redesign of a web application for monetary management and contract tracking',
            'Integration of accessibility and ergonomics criteria to improve user experience',
            'Collaboration with a team of developers, designers, and project managers',
          ],
          fr: [
            'Refonte d\'une application web de gestion monétaire et de suivi de contrats',
            'Intégration de critères d\'accessibilité et d\'ergonomie pour améliorer l\'expérience utilisateur',
            'Collaboration avec une équipe de développeurs, designers et chefs de projet',
          ],
        },
        internship: true,
      },
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
          fr: "Intégration d'une étape de benchmark auto en utilisant un outil de l'entreprise dans un pipeline Jenkins et développement d'un plugin pour permettre la visualisation et d'interprétation des résultats.",
        },
        technologies: ['Jenkins', 'Java', 'Apache Groovy', 'HTML', 'CSS', 'JavaScript', 'Chart.js', 'Ansible', 'ESXI', 'Git'],
        achievements: {
          en: [
            'Add performance criteria for tests',
            'Quantification of regressions on new versions',
          ],
          fr: [
            'Ajout de critères de performance aux tests existants',
            'Quantification des régressions lors de nouvelles versions',
          ],
        },
        internship: true,
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
          en: 'Maintaining and improving a Web application (Flask) for park management for support teams.',
          fr: 'Maintien et amélioration d\'une application Web (Flask) de gestion de parc à destination des équipes support.',
        },
        technologies: ['Python', 'Flask', 'HTML', 'CSS', 'JavaScript', 'Git'],
        achievements: {
          en: [
          ],
          fr: [
          ],
        },
        internship: true,
      },
      {
        title: {
          en: 'Development Intern (6 weeks)',
          fr: 'Stage de développement (6 semaines)',
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
          en: "Hardware updates and encryption of company computers, optimization of the backup process by integrating the company's API to only back up new data, and technology updates (installation of a Hashicorp Vault and Consul cluster) in the back-office team of a cloud gaming startup.",
          fr: "Mises à jour hardware et chiffrement des ordinateurs de l'entreprise, optimisation du processus de backup en intégrant l'API de l'entreprise pour ne sauvegarder que les nouveautés et mise à jour de technologie (installation d'un cluster Hashicorp Vault et Consul) dans l'équipe back-office d'une startup de cloud gaming.",
        },
        technologies: ['Python', 'Jenkins', 'Go', 'AWS S3', 'Git'],
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
        internship: true,
      },
    ] as Experience[],
    formation: {
      school: 'INSA Rennes',
      technologies: [
        'Docker',
        'JavaScript',
        'CSS',
        'HTML',
        'TypeScript',
        'PostgreSQL',
        'Python',
        'Java',
        'C++',
        'Go',
        'LaTeX',
        'Grafana',
        'InfluxDB',
        'Shell Script',
        'Telegraf',
        'Git',
        'Angular',
        'OpenAPI',
        'Spring Boot',
        'Ansible',
        'ApacheCassandra',
        'C',
        'CMake',
        'GitLab',
        'Makefile',
        'MongoDB',
        'MySQL',
        'OCaml',
        'PyTorch',
        'R',
        'Scipy',
        'SQLite',
        'TensorFlow',
        'Prometheus',
        'Figma',
      ],
    } as Formation,
    skills: {
      en: [
        {
          name: 'Languages',
          short: 'Languages',
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
          short: 'Web',
          skills: [
            'Vue.js',
            'React',
            'Next.js',
            'Vite',
            'Nuxt',
            'Tailwind CSS',
            'Angular',
            'Spring Boot',
            'Django',
            'DjangoREST',
            'Express.js',
            'FastAPI',
            'Nginx',
            'Caddy',
            'Traefik',
            'Three.js',
            'GoFiber',
            'jQuery',
            'Bootstrap',
            'OpenAPI',
          ],
        },
        {
          name: 'Databases',
          short: 'Databases',
          skills: [
            'PostgreSQL',
            'MongoDB',
            'MySQL',
            'Supabase',
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
          short: 'CI/CD',
          skills: ['Jenkins', 'Apache Groovy', 'TravisCI', 'GitLab CI', 'GitHub Actions'],
        },
        {
          name: 'Tools',
          short: 'Tools',
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
          short: 'Design',
          skills: ['Gimp', 'Figma'],
        },
        {
          name: 'Data Science and Data Visualization',
          short: 'Data',
          skills: ['Scipy', 'TensorFlow', 'PyTorch', 'Chart.js'],
        },
        {
          name: 'Version Control',
          short: 'Versioning',
          skills: ['Git', 'Gitea', 'Bitbucket', 'GitHub', 'GitLab'],
        },
        {
          name: 'Cloud providers',
          short: 'Cloud',
          skills: ['Scaleway', 'OVH', 'Hetzner'],
        },
        {
          name: 'Other',
          short: 'Other',
          skills: ['Markdown', 'LaTeX', 'Typst'],
        },
      ],
      fr: [
        {
          name: 'Langages',
          short: 'Langages',
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
          short: 'Web',
          skills: [
            'Vue.js',
            'React',
            'Next.js',
            'Vite',
            'Nuxt',
            'Tailwind CSS',
            'Angular',
            'Spring Boot',
            'Django',
            'DjangoREST',
            'Express.js',
            'FastAPI',
            'Nginx',
            'Caddy',
            'Traefik',
            'Three.js',
            'GoFiber',
            'jQuery',
            'Bootstrap',
            'OpenAPI',
          ],
        },
        {
          name: 'Bases de Données',
          short: 'Données',
          skills: [
            'PostgreSQL',
            'MongoDB',
            'MySQL',
            'Supabase',
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
          short: 'CI/CD',
          skills: ['Jenkins', 'Apache Groovy', 'TravisCI', 'GitLab CI', 'GitHub Actions'],
        },
        {
          name: 'Outils',
          short: 'Outils',
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
          short: 'Design',
          skills: ['Gimp', 'Figma'],
        },
        {
          name: 'Science des Données et Visualisation',
          short: 'Data',
          skills: ['Scipy', 'TensorFlow', 'PyTorch', 'Chart.js'],
        },
        {
          name: 'Contrôle de Version',
          short: 'Versions',
          skills: ['Git', 'Gitea', 'Bitbucket', 'GitHub', 'GitLab'],
        },
        {
          name: 'Fournisseurs Cloud',
          short: 'Cloud',
          skills: ['Scaleway', 'OVH', 'Hetzner'],
        },
        {
          name: 'Autres',
          short: 'Autres',
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
          title: 'Clair Obscur: Expedition 33',
          year: '2025',
          image: clairobscureImage,
          description: 'a turn-based RPG set in a dark Belle Époque atmosphere, blending tactics and real-time reactions in an emotional narrative against the mysterious Peintresse.',
          whyILoveIt: 'Visually striking universe, playing on the contrast of light and darkness as well as emotions.',
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
          title: 'Clair Obscur: Expedition 33',
          year: '2025',
          image: clairobscureImage,
          description: 'un RPG tour par tour à l’ambiance Belle Époque sombre, mêlant tactique et reactions temps réel dans un récit émouvant contre la mystérieuse Peintresse.',
          whyILoveIt: 'Univers visuellement frappant, jouant sur le contraste lumière / obscurité autant que sur les émotions.',
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
      const lang = preferencesStore.lang;

      return state.projects.map((project) => ({
        ...project,
        localizedName: project.name[lang],
        localizedSubtitle: project.subtitle?.[lang],
        localizedTitle: project.subtitle ? `${project.name[lang]} - ${project.subtitle[lang]}` : project.name[lang],
        localizedDescription: project.description[lang],
        localizedNote: project.note ? project.note[lang] : undefined,
        localizedFile: project.file[lang],
      }));
    },
    getLocalizedExperiences: (state) => {
      const preferencesStore = usePreferencesStore();
      const lang = preferencesStore.lang;

      return state.experiences.map((experience) => ({
        ...experience,
        localizedTitle: experience.title[lang],
        localizedLocation: experience.location[lang],
        localizedPeriod: experience.period[lang],
        localizedDescription: experience.description[lang],
        localizedAchievements: experience.achievements[lang],
      }));
    },
    getLocalizedSkills: (state) => {
      const preferencesStore = usePreferencesStore();
      const lang = preferencesStore.lang;

      return state.skills[lang];
    },
    getLocalizedMovies: (state) => {
      const preferencesStore = usePreferencesStore();
      const lang = preferencesStore.lang;

      return state.movies[lang];
    },
    getLocalizedGames: (state) => {
      const preferencesStore = usePreferencesStore();
      const lang = preferencesStore.lang;

      return state.games[lang];
    },
  },
});
