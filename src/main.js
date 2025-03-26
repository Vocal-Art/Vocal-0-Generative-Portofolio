
//! Réservez main.js à la configuration principale de Vue.js

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Importer le routeur
import "./style.css"; // Importer les styles globaux

// Créer l'application Vue
const app = createApp(App);

// Utiliser le routeur
app.use(router);

// Monter l'application sur l'élément HTML avec l'id "app"
app.mount("#app");


