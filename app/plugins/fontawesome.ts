import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBars, faArrowUpRightFromSquare, faBell, faBullseye, faChartColumn, faCirclePlus, faCodeCommit, faFile, faFileAlt, faGear, faLeftLong, faLineChart, faMessage, faMoneyCheckDollar, faPencil, faRightLong, faShieldAlt, faThumbsDown, faThumbsUp, faTrophy, faUser, faWarning, faXmark } from '@fortawesome/free-solid-svg-icons'

library.add(
  faShieldAlt,
  faCirclePlus,
  faMessage,
  faPencil,
  faFileAlt,
  faWarning,
  faFile,
  faBullseye,
  faThumbsUp,
  faThumbsDown,
  faBell,
  faMoneyCheckDollar,
  faGear,
  faLeftLong,
  faCodeCommit,
  faRightLong,
  faArrowUpRightFromSquare,
  faTrophy,
  faBars,
  faUser,
  faChartColumn,
  faLineChart,
  faXmark,
)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('fa-awesome-icon', FontAwesomeIcon)
})
