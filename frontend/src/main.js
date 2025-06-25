import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios';

axios.defaults.baseURL = '/';

// Font Awesome Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Bootstrap 5 (no Vue wrappers)
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// icons
import { 
    faUser, 
    faHome, 
    faBars,
    faRightFromBracket,
    faListUl,
    faPeopleGroup,
    faPerson,
    faAnglesLeft,
    faAnglesRight,
    faHeart,
    faPlay,
    faPause,
    faCircleUser,
    faChevronDown
} from '@fortawesome/free-solid-svg-icons';

import { 
    faVuejs 
} from '@fortawesome/free-brands-svg-icons';

library.add(
    faUser, 
    faHome, 
    faBars, 
    faVuejs,
    faRightFromBracket,
    faListUl,
    faPeopleGroup,
    faPerson,
    faAnglesLeft,
    faAnglesRight,
    faHeart,
    faPlay,
    faPause,
    faCircleUser,
    faChevronDown
);

const app = createApp(App)

app.use(router)
app.component('fa', FontAwesomeIcon);

app.mount('#app')
