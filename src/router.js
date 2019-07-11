import VueRouter from 'vue-router';
import Search from './components/Search';
import AboutUs from './components/AboutUs';
import Missing from './components/Missing';

const routes = [
  { path: '/', component: Search },
  { path: '/about', component: AboutUs },
  { path: '*', component: Missing },
];

export default new VueRouter({routes});