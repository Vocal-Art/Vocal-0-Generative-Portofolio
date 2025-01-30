import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";
import AboutView from "./views/AboutView.vue";
import Gallery from "./components/Gallery.vue";
import Links from "./components/Links.vue";
import Faq from "./components/Faq.vue";
import Test from "./components/Test.vue";

//  createApp(App).mount('#app')

const app = createApp(App);
const router = createRouter({
  history: createWebHistory(),
  // (import.meta.env.Base_URL),
  routes: [
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
  ],
});

app.use(router);
app.mount("#app");

export default router;
