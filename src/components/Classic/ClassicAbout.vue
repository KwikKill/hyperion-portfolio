<template>
  <section id="about" class="py-20 bg-white dark:bg-gray-800">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">
        {{ isEnglish ? 'About Me' : 'À Propos de Moi' }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-1 gap-10 mb-16">
        <div class="bg-gray-50 dark:bg-gray-700 p-8 rounded-lg shadow-md">
          <h3 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            {{ isEnglish ? 'Who I Am' : 'Qui Je Suis' }}
          </h3>
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            <template v-if="isEnglish">
              I'm a computer science student from France, passionate about web development and software engineering. I
              love creating innovative solutions to complex problems and continuously learning new technologies.
            </template>
            <template v-else>
              Etudiant en Informatique à l'INSA de Rennes passionné par le développement web et l'ingénierie logicielle.
              J'apprécie la technologie et apprendre de nouvelles choses.
            </template>
          </p>
          <p class="text-gray-700 dark:text-gray-300">
            <template v-if="isEnglish">
              When I'm not coding, you can find me exploring new technologies, or expanding my knowledge in various
              computer science domains.
              <br />
              Apart from these subjects, I enjoy video games, films and books (mainly science fiction), board games,
              role-playing games and Greek mythology.
              <br />
              I also played table tennis in a club for 5 years.
            </template>
            <template v-else>
              Quand je ne code pas, vous pouvez me trouver en train d'explorer de nouvelles technologies, ou d'élargir
              mes connaissances dans divers domaines de l'informatique.
              <br />
              En dehors de ces sujets, j'apprécie les jeux vidéos, les films et les livres (principalement la science
              fiction), les jeux de société, les jeux de rôles et la mythologie Grecque.
              <br />
              J'ai également fait 5 ans de tennis de table en club.
            </template>
          </p>
        </div>

        <div class="bg-gray-50 dark:bg-gray-700 p-8 rounded-lg shadow-md">
          <h3 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            {{ isEnglish ? 'Skills & Technologies' : 'Compétences & Technologies' }}
          </h3>

          <div class="space-y-6">
            <div v-for="(category, index) in skills" :key="index">
              <h4
                class="font-medium text-lg mb-3 text-blue-600 dark:text-blue-400 border-b border-gray-200 dark:border-gray-700 pb-1">
                {{ category.name }}
              </h4>
              <div class="flex flex-wrap gap-2 mb-4">
                <span v-for="(skill, skillIndex) in category.skills" :key="skillIndex"
                  class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Associations Section -->
      <div class="mt-12 bg-gray-50 dark:bg-gray-700 p-8 rounded-lg shadow-md">
        <h3 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-white text-center">
          {{ isEnglish ? 'Associations & Involvement' : 'Associations & Engagement' }}
        </h3>

        <p class="text-gray-700 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
          <template v-if="isEnglish">
            Being actively involved in associations has been a significant part of my life. I have been an active member
            of several student and technology - focused organizations.These experiences have allowed me to develop
            skills in project management, teamwork, and event organization.
          </template>
          <template v-else>
            Lassociatif étant une part importante de ma vie, j'ai été membre actif de plusieurs associations étudiantes
            et technologiques.Ces expériences m'ont permis de développer des compétences en gestion de projet, en
            travail d'équipe et en organisation d'événements.
          </template>
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(role, index) in associationRoles" :key="index"
            class="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow">
            <div class="font-medium text-blue-600 dark:text-blue-400">{{ role.title }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ role.period }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { usePreferencesStore } from '../../stores/preferences'
import { useProjectsStore } from '../../stores/projects'

const preferencesStore = usePreferencesStore()
const projectsStore = useProjectsStore()

const isEnglish = computed(() => preferencesStore.isEnglish)
const skills = computed(() => projectsStore.getLocalizedSkills)

const associationRoles = computed(() => {
  if (isEnglish.value) {
    return [
      { title: 'Development Manager INSALAN', period: '2023-2025' },
      { title: 'Volunteer Secur\'INSA', period: '2023-2024' },
      { title: 'Treasurer Night Fury', period: '2023-2024' },
      { title: 'Development Manager Night Fury', period: '2022-2023' },
      { title: 'E-sport LoL Manager Night Fury', period: '2021-2022' },
      { title: 'Volunteer FOG', period: '2021' }
    ]
  } else {
    return [
      { title: 'Responsable Développement INSALAN', period: '2023-2025' },
      { title: 'Bénévole Secur\'INSA', period: '2023-2024' },
      { title: 'Trésorier Night Fury', period: '2023-2024' },
      { title: 'Responsable Développement Night Fury', period: '2022-2023' },
      { title: 'Responsable E-sport LoL Night Fury', period: '2021-2022' },
      { title: 'Bénévole FOG', period: '2021' }
    ]
  }
})
</script>
