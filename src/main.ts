import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowLeft,
  faArrowsRotate, faBolt, faChevronDown, faChevronUp,
  faCircle, faCircleCheck, faCirclePlus, faClock,
  faCrown,
  faDownload, faEye, faEyeSlash,
  faFile, faHammer, faMagnifyingGlass, faPencil, faTrashCan, faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import axios from 'axios';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';

import App from './App.vue';

import './style.css';

/* add icons to the library */
library.add(
  faCirclePlus,
  faPencil,
  faWarning,
  faFile,
  faArrowsRotate,
  faCircleCheck,
  faCircle,
  faClock,
  faEye,
  faEyeSlash,
  faChevronDown,
  faChevronUp,
  faDownload,
  faMagnifyingGlass,
  faTrashCan,
  faBolt,
  faArrowLeft,
  faHammer,
  faCrown,
);

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

createApp(App)
  .component('fa-awesome-icon', FontAwesomeIcon)
  .use(pinia)
  .mount('#app');
