<template>
  <header class="bg-gradient-to-r from-green-800 via-gray-500 to-yellow-300 shadow-md h-[80px] px-5 lg:px-24">
    <nav class="flex items-center justify-between w-full pt-5">
      <h1 class="text-2xl text-white font-extrabold">Generative Art</h1>
      
      <div class="lg:hidden">
        <button @click="toggleMenu" class="text-white text-3xl ">☰</button>
      </div>

      <!-- Desktop Links -->
      <div class="hidden lg:flex items-center space-x-5">
        <router-link to="/" class="text-white hover:text-slate-700 cursor-pointer text-xl font-medium">Home</router-link>
        <router-link to="/about" class="text-white hover:text-slate-700 cursor-pointer text-xl font-medium">About</router-link>
        <router-link to="/gallery" class="text-white hover:text-slate-700 cursor-pointer text-xl font-medium">Gallery</router-link>
        <router-link to="/links" class="text-white hover:text-slate-700 cursor-pointer text-xl font-medium">Links</router-link>
        <router-link to="/faq" class="text-white hover:text-slate-700 cursor-pointer text-xl font-medium">Faq</router-link>
        <router-link to="/test" class="text-white hover:text-slate-700 cursor-pointer text-xl font-medium">Test Generative Brushes</router-link>
      </div>

      <!-- Mobile Menu -->
      <div :class="{'hidden': !menuOpen, 'flex': menuOpen}" class="absolute top-20 left-0 w-full bg-green-800 flex-col items-center space-y-5 py-5 lg:hidden z-10">
        <router-link to="/" class="text-white hover:text-slate-700 cursor-pointer text-xl font-medium" @click="closeMenu">Home</router-link>
        <router-link to="/about" class="text-white hover:text-slate-700 cursor-pointer text-xl font-medium" @click="closeMenu">About</router-link>
        <router-link to="/gallery" class="text-white hover:text-slate-700 cursor-pointer text-xl font-medium" @click="closeMenu">Gallery</router-link>
        <router-link to="/links" class="text-white hover:text-slate-700 cursor-pointer text-xl font-medium" @click="closeMenu">Links</router-link>
        <router-link to="/faq" class="text-white hover:text-slate-700 cursor-pointer text-xl font-medium" @click="closeMenu">Faq</router-link>
        <router-link to="/test" class="text-white hover:text-slate-700 cursor-pointer text-xl font-medium" @click="closeMenu">Explore Generative Art</router-link>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  data() {
    return {
      menuOpen: false
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    // Close the menu when a link is clicked
    closeMenu() {
      this.menuOpen = false;
    }
  }
};
</script>
