<template>
  <section id="about" class="py-20 bg-white dark:bg-gray-800">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">
        {{ isEnglish ? 'About Me' : 'À Propos de Moi' }}
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h3 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            {{ isEnglish ? 'Who I Am' : 'Qui Je Suis' }}
          </h3>
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            {{ isEnglish 
              ? 'I\'m a computer science student from France, passionate about web development and software engineering. I love creating innovative solutions to complex problems and continuously learning new technologies.' 
              : 'Je suis un étudiant en informatique français, passionné par le développement web et l\'ingénierie logicielle. J\'aime créer des solutions innovantes à des problèmes complexes et apprendre continuellement de nouvelles technologies.' 
            }}
          </p>
          <p class="text-gray-700 dark:text-gray-300">
            {{ isEnglish 
              ? 'When I\'m not coding, you can find me exploring new technologies, contributing to open-source projects, or expanding my knowledge in various computer science domains.' 
              : 'Quand je ne code pas, vous pouvez me trouver en train d\'explorer de nouvelles technologies, de contribuer à des projets open-source, ou d\'élargir mes connaissances dans divers domaines de l\'informatique.' 
            }}
          </p>
        </div>
        
        <div>
          <h3 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            {{ isEnglish ? 'Skills & Technologies' : 'Compétences & Technologies' }}
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="(category, index) in skillCategories" :key="index">
              <h4 class="font-medium text-lg mb-2 text-blue-600 dark:text-blue-400">{{ category.name }}</h4>
              <ul class="space-y-1">
                <li 
                  v-for="(skill, skillIndex) in category.skills" 
                  :key="skillIndex"
                  class="flex items-center text-gray-700 dark:text-gray-300"
                >
                  <span class="mr-2">•</span>
                  {{ skill }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { usePreferencesStore } from '../stores/preferences'

const preferencesStore = usePreferencesStore()
const isEnglish = computed(() => preferencesStore.isEnglish)

const skillCategories = computed(() => {
  if (preferencesStore.isEnglish) {
    return [
      {
        name: 'Frontend',
        skills: ['HTML/CSS', 'JavaScript', 'Vue.js', 'React', 'Tailwind CSS']
      },
      {
        name: 'Backend',
        skills: ['Node.js', 'Express', 'Python', 'Java', 'SQL/NoSQL']
      },
      {
        name: 'Tools',
        skills: ['Git', 'Docker', 'VS Code', 'Figma', 'Webpack']
      },
      {
        name: 'Other',
        skills: ['Responsive Design', 'RESTful APIs', 'Testing', 'CI/CD', 'Agile']
      }
    ]
  } else {
    return [
      {
        name: 'Frontend',
        skills: ['HTML/CSS', 'JavaScript', 'Vue.js', 'React', 'Tailwind CSS']
      },
      {
        name: 'Backend',
        skills: ['Node.js', 'Express', 'Python', 'Java', 'SQL/NoSQL']
      },
      {
        name: 'Outils',
        skills: ['Git', 'Docker', 'VS Code', 'Figma', 'Webpack']
      },
      {
        name: 'Autres',
        skills: ['Design Responsive', 'APIs RESTful', 'Tests', 'CI/CD', 'Agile']
      }
    ]
  }
})
</script>

