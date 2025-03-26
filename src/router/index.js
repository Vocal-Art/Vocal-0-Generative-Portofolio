//! router/index.js  cherche les données

import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import Gallery from "../views/Gallery.vue";
import Links from "../views/Links.vue";
import Faq from "../views/Faq.vue";
import Test from "../views/Test.vue";


// Configuration des routes
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/gallery",
    name: "gallery",
    component: Gallery,
  },
  {
    path: "/links",
    name: "links",
    component: Links,
  },
  {
    path: "/faq",
    name: "faq",
    component: Faq,
  },
  {
    path: "/test",
    name: "test",
    component: Test,
  },

  
];

// Création du routeur
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;






