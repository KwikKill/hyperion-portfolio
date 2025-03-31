<template>
  <section id="interests" class="cyberpunk-terminal py-20 relative min-h-screen">
    <!-- Unique background for this section -->
    <div class="absolute inset-0 z-0">
      <!-- Holographic grid background -->
      <div class="holographic-bg h-full"></div>
      <!-- Overlay with gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-yellow-900/30 via-black/60 to-orange-800/20"></div>
      <!-- Animated scan lines -->
      <div class="absolute inset-0 scanlines opacity-20"></div>
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <!-- Section header -->
      <div class="cyberpunk-terminal border-2 border-theme-foreground/70 rounded-md bg-black/80 p-2 mb-4 flex justify-between items-center rounded-md">
        <div class="text-theme-foreground font-mono uppercase tracking-wider">
          {{
            isEnglish
            ? 'HYPERION v1.0 - USER INTERESTS'
            : 'HYPERION v1.0 - INTÉRÊTS UTILISATEUR'
          }}
        </div>
        <div class="flex space-x-2">
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
        </div>
      </div>

      <!-- Content container -->
      <div class="cyberpunk-terminal border-2 border-yellow-500/70 rounded-md bg-black/80">
        <!-- Terminal header -->
        <div class="terminal-header flex justify-between items-center p-2 border-b border-yellow-500/30">
          <div class="text-yellow-400 font-mono uppercase tracking-wider">
            {{ isEnglish ? 'PERSONAL DATABASE // CLASSIFIED' : 'BASE DE DONNÉES PERSONNELLE // CLASSIFIÉ' }}
          </div>
          <div class="flex space-x-2">
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
          </div>
        </div>

        <div
          class="p-6"
        >
          <!-- Categories tabs -->
          <div class="flex mb-8 border-b border-yellow-500/30">
            <button @click="activeCategory = 'movies'"
              class="px-4 py-2 font-mono text-sm uppercase transition-colors duration-200 relative"
              :class="activeCategory === 'movies' ? 'text-yellow-300' : 'text-gray-500 hover:text-yellow-400'">
              <span>{{ isEnglish ? 'Movies' : 'Films' }}</span>
              <span v-if="activeCategory === 'movies'" class="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500"></span>
            </button>
            <button @click="activeCategory = 'games'"
              class="px-4 py-2 font-mono text-sm uppercase transition-colors duration-200 relative"
              :class="activeCategory === 'games' ? 'text-yellow-300' : 'text-gray-500 hover:text-yellow-400'">
              <span>{{ isEnglish ? 'Video Games' : 'Jeux Vidéo' }}</span>
              <span v-if="activeCategory === 'games'" class="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500"></span>
            </button>
          </div>

          <!-- Movies content -->
          <div v-if="activeCategory === 'movies'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="(movie, index) in movies"
              :key="index"
              class="media-card group"
                @click="activeCard = activeCard === index ? null : index"
              :class="activeCard === index ? 'active' : ''"
            >
              <div class="media-card-inner">
                <div class="media-card-front">
                  <img :src="movie.image" :alt="movie.title" class="w-full h-48 object-cover rounded-t-md" />
                  <div class="p-4 bg-black/80 rounded-b-md border-t border-yellow-500/50">
                    <h3 class="text-lg font-bold text-yellow-300">{{ movie.title }}</h3>
                    <p class="text-xs text-gray-400">{{ movie.year }} • {{ movie.genre }}</p>
                  </div>
                </div>
                <div class="media-card-back p-4 bg-black/90 text-white">
                  <h3 class="text-lg font-bold text-yellow-300 mb-2">{{ movie.title }}</h3>
                  <p class="text-sm">{{ movie.description }}</p>
                  <div class="mt-2 text-xs text-yellow-300">
                    {{ isEnglish ? 'Why I love it:' : 'Pourquoi je l\'aime:' }} {{ movie.whyILoveIt }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Games content -->
          <div v-if="activeCategory === 'games'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(game, index) in games" :key="index" class="media-card group">
              <div class="media-card-inner">
                <div class="media-card-front">
                  <img :src="game.image" :alt="game.title" class="w-full h-48 object-cover rounded-t-md" />
                  <div class="p-4 bg-black/80 rounded-b-md border-t border-yellow-500/50">
                    <h3 class="text-lg font-bold text-yellow-300">{{ game.title }}</h3>
                    <p class="text-xs text-gray-400">{{ game.year }}</p>
                  </div>
                </div>
                <div class="media-card-back p-4 bg-black/90 text-white">
                  <h3 class="text-lg font-bold text-yellow-300 mb-2">{{ game.title }}</h3>
                  <p class="text-sm">{{ game.description }}</p>
                  <div class="mt-2 text-xs text-yellow-300">
                    {{ isEnglish ? 'Why I love it:' : 'Pourquoi je l\'aime:' }} {{ game.whyILoveIt }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Terminal footer -->
          <div class="mt-8 pt-4 border-t border-yellow-500/30 text-center">
            <p class="text-yellow-400 font-mono text-sm">
              {{ isEnglish
                ? 'These works are part of my inspirations and passions. They reflect my love for science fiction, art, and immersive storytelling.'
                : 'Ces oeuvres font partie de mes inspirations et de mes passions. Elles reflètent mon amour pour la science-fiction, l\'art et la narration immersive.'
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePreferencesStore } from '../stores/preferences'

const preferencesStore = usePreferencesStore()
const isEnglish = computed(() => preferencesStore.isEnglish)

const activeCategory = ref('movies')

const activeCard = ref(null)

const movies = computed(() => {
  if (isEnglish.value) {
    return [
    {
        title: "Matrix",
        year: "1999",
        genre: "Science-Fiction/Action",
        image: "/src/assets/movies/matrix.webp",
        description: "A hacker learns about the true nature of his reality and his role in the war against its controllers.",
        whyILoveIt: "Revolutionary visual effects and a mind-bending story."
      },
      {
        title: "Ghost in the Shell",
        year: "1995",
        genre: "Anime/Science-Fiction",
        image: "/src/assets/movies/ghost_in_the_shell.webp",
        description: "A cyborg policewoman and her partner hunt a mysterious hacker called the Puppet Master.",
        whyILoveIt: "Pioneering cyberpunk animation with deep philosophical questions."
      },
      {
        title: "Inception",
        year: "2010",
        genre: "Science-Fiction/Action",
        image: "/src/assets/movies/inception.webp",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
        whyILoveIt: "Complex narrative layers and mind-bending concepts."
      },
      {
        title: "Ex Machina",
        year: "2014",
        genre: "Science-Fiction/Drama",
        image: "/src/assets/movies/ex_machina.webp",
        description: "A programmer is selected to participate in a groundbreaking experiment in synthetic intelligence by evaluating the human qualities of a highly advanced humanoid A.I.",
        whyILoveIt: "Exploring the limits of AI and human emotions."
      },
      {
        title: "Tenet",
        year: "2020",
        genre: "Science-Fiction/Action",
        image: "/src/assets/movies/tenet.webp",
        description: "Armed with only one word, \"Tenet,\" and fighting for the survival of the world, a protagonist journeys through the twilight world of international espionage on a mission that will unfold in something beyond real time.",
        whyILoveIt: "A complex narrative about time and perception."
      },
      {
        title: "La cité de la peur",
        year: "1994",
        genre: "Comedy",
        image: "/src/assets/movies/la_cité_de_la_peur.webp",
        description: "A French comedy film that parodies horror and suspense films.",
        whyILoveIt: "A classic of French humor with references to pop culture."
      }
    ]
  } else {
    return [
      {
        title: "Matrix",
        year: "1999",
        genre: "Science-Fiction/Action",
        image: "/src/assets/movies/matrix.webp",
        description: "Un pirate informatique découvre, par l'intermédiaire de mystérieux rebelles, la véritable nature de sa réalité et son rôle dans la guerre contre ses contrôleurs.",
        whyILoveIt: "Effets visuels révolutionnaires et une histoire qui défie l'esprit."
      },
      {
        title: "Ghost in the Shell",
        year: "1995",
        genre: "Anime/Science-Fiction",
        image: "/src/assets/movies/ghost_in_the_shell.webp",
        description: "Une policière cyborg et son partenaire traquent un mystérieux hacker appelé le Puppet Master.",
        whyILoveIt: "Animation cyberpunk pionnière avec des questions philosophiques profondes."
      },
      {
        title: "Inception",
        year: "2010",
        genre: "Science-Fiction/Action",
        image: "/src/assets/movies/inception.webp",
        description: "Un voleur qui dérobe des secrets d'entreprises grâce à une technologie de partage de rêves se voit confier la tâche inverse : implanter une idée dans l'esprit d'un P.D.G.",
        whyILoveIt: "Couches narratives complexes et concepts qui défient l'esprit."
      },
      {
        title: "Ex Machina",
        year: "2014",
        genre: "Science-Fiction/Drama",
        image: "/src/assets/movies/ex_machina.webp",
        description: "Un programmeur est sélectionné pour participer à une expérience révolutionnaire dans le domaine de l'intelligence artificielle en évaluant les capacités et la conscience d'un robot humanoïde.",
        whyILoveIt: "Explorer les limites de l'IA et des émotions humaines."
      },
      {
        title: "Tenet",
        year: "2020",
        genre: "Science-Fiction/Action",
        image: "/src/assets/movies/tenet.webp",
        description: "Muni d'un seul mot, \"Tenet,\" et décidé à se battre pour sauver le monde, un homme sillonne l'univers crépusculaire de l'espionnage international.",
        whyILoveIt: "Un récit complexe sur le temps et la perception."
      },
      {
        title: "La cité de la peur",
        year: "1994",
        genre: "Comédie",
        image: "/src/assets/movies/la_cité_de_la_peur.webp",
        description: "Un film comique français qui parodie les films d'horreur et de suspense.",
        whyILoveIt: "Un classique de l'humour français avec des références à la culture pop."
      }
    ]
  }
})

const games = computed(() => {
  if (isEnglish.value) {
    return [
    {
        title: "Cyberpunk 2077",
        year: "2020",
        image: "/src/assets/games/cyberpunk_2077.webp",
        description: "An open-world action-adventure game set in Night City, a metropolis obsessed with power, glamour, and body modification.",
        whyILoveIt: "Immersive cyberpunk world with incredible attention to detail."
      },
      {
        title: "The Witcher 3: Wild Hunt",
        year: "2015",
        image: "/src/assets/games/the_witcher_3.webp",
        description: "An open-world RPG focused on storytelling, set in a visually stunning fantasy universe filled with meaningful choices and impactful consequences.",
        whyILoveIt: "Rich storytelling and beautifully designed world."
      },
      {
        title: "A plague tale: Innocence/Requiem",
        year: "2019/2022",
        image: "/src/assets/games/a_plague_tale.webp",
        description: "An action-adventure narrative game following two children in a plague-ridden medieval France.",
        whyILoveIt: "Emotive story and immersive atmosphere."
      },
      {
        title: "Baldur's Gate 3",
        year: "2023",
        image: "/src/assets/games/baldurs_gate_3.webp",
        description: "A turn-based RPG based on the Dungeons & Dragons universe, offering freedom of exploration and choice.",
        whyILoveIt: "Extremely immersive with meaningful choices and a rich world."
      },
      {
        title: "Little Miss Fortune",
        year: "2019",
        image: "/src/assets/games/little_miss_fortune.webp",
        description: "A narrative adventure game where you follow a little girl as she tries to find a treasure.",
        whyILoveIt: "Disturbing story and unique aesthetic."
      },
      {
        title: "Hollow Knight",
        year: "2017",
        image: "/src/assets/games/hollow_knight.webp",
        description: "A challenging 2D action-adventure game set in a vast interconnected world.",
        whyILoveIt: "Atmospheric world-building and precise, responsive controls."
      }
    ]
  } else {
    return [
      {
        title: "Cyberpunk 2077",
        year: "2020",
        image: "/src/assets/games/cyberpunk_2077.webp",
        description: "Un jeu d'action-aventure en monde ouvert situé à Night City, une mégalopole obsédée par le pouvoir, le glamour et la modification corporelle.",
        whyILoveIt: "Monde cyberpunk immersif avec une attention incroyable aux détails."
      },
      {
        title: "The Witcher 3: Wild Hunt",
        year: "2015",
        image: "/src/assets/games/the_witcher_3.webp",
        description: "Un RPG en monde ouvert axé sur l'histoire, situé dans un univers fantastique visuellement époustouflant, rempli de choix significatifs et de conséquences impactantes.",
        whyILoveIt: "Narration riche et monde magnifiquement conçu."
      },
      {
        title: "A plague tale: Innocence/Requiem",
        year: "2019/2022",
        image: "/src/assets/games/a_plague_tale.webp",
        description: "Un jeu d'action-aventure narratif qui suit deux enfants dans une France médiévale ravagée par la peste.",
        whyILoveIt: "L'histoire émotive et l'atmosphère immersive."
      },
      {
        title: "Baldur's Gate 3",
        year: "2023",
        image: "/src/assets/games/baldurs_gate_3.webp",
        description: "Un RPG au tour par tour basé sur l'univers de Donjons et Dragons, offrant une liberté d'exploration et de choix.",
        whyILoveIt: "Extrêmement immersif avec des choix significatifs et un monde riche."
      },
      {
        title: "Little Miss Fortune",
        year: "2019",
        image: "/src/assets/games/little_miss_fortune.webp",
        description: "Un jeu d'aventure narratif où vous suivez une petite fille qui cherche à trouver un trésor.",
        whyILoveIt: "L'histoire dérangeante et l'esthétique unique."
      },
      {
        title: "Hollow Knight",
        year: "2017",
        image: "/src/assets/games/hollow_knight.webp",
        description: "Un jeu d'action-aventure 2D exigeant situé dans un monde vaste et interconnecté.",
        whyILoveIt: "Construction atmosphérique du monde et contrôles précis et réactifs."
      }
    ]
  }
})
</script>

<style scoped>
.holographic-bg {
  background-color: #1d1d0c;
  background-image:
    linear-gradient(0deg, rgba(179, 255, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(183, 255, 0, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  position: relative;
  overflow: hidden;
}

.holographic-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 30% 40%, rgba(255, 251, 0, 0.4) 0%, transparent 40%),
    radial-gradient(circle at 70% 60%, rgba(229, 255, 0, 0.4) 0%, transparent 40%);
  pointer-events: none;
}

.scanlines {
  background: linear-gradient(to bottom,
      transparent 50%,
      rgba(255, 242, 0, 0.1) 50%);
  background-size: 100% 4px;
  pointer-events: none;
}

.media-card {
  perspective: 1000px;
  height: 280px;
}

.media-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.media-card.active .media-card-inner {
  transform: rotateY(180deg);
}

.media-card:hover .media-card-inner {
  transform: rotateY(180deg);
}

.media-card-front,
.media-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 0.375rem;
  box-shadow: 0 0 15px rgba(255, 230, 0, 0.3);
}

.media-card-back {
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
