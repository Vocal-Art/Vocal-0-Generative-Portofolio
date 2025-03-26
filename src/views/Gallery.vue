<template>

      <diV >
        <h1 class="text-2xl md:text-4xl font-bold text-white text-center">Click on the images below </h1>
      </diV>
        <div class="container">
          
          <div class="grid-gallery">
            <img 
              v-for="(picture, index) in pictures" 
              :key="index" 
              :src="getImageUrl(picture.src)"
              :alt="picture.alt" 
              class="grid-gallery-picture"
              @click="openGallery(index)"
            />
          </div>
      
          <!-- Modal Gallery -->
          <div v-if="isGalleryOpen" class="gallery show">
            <div class="nav prev" @click="prevImage">&lt;</div>
            <div class="actual">
              <div class="title">{{ pictures[currentIndex].alt }}</div>
              <img class="gallery-image" :src="getImageUrl(pictures[currentIndex].src)" :alt="pictures[currentIndex].alt" />
              <div class="close" @click="closeGallery">X</div>
            </div>
            <div class="nav next" @click="nextImage">&gt;</div>
          </div>
        </div>
    
      </template>
      
      <script setup>
      import { ref } from "vue";
      
      const pictures = ref([
      { src: "polygone_bleu.png", alt: "Rotated Polygone Magic" },
      { src: "fleur.PNG", alt: "Green Fleur" },
        { src: "speciale.jpg", alt: "My Special" },
        { src: "hsl_glitch.PNG", alt: "HSL Glitch" },
    
        { src: "frank_lab.png", alt: "Star Frank Lab Brush" },
        { src: "infinite.png", alt: "Red Spirale " },
        { src: "lines.jpg", alt: "Generative Lines" },
        { src: "grid.jpg", alt: "Generative Grid" },
       
        { src: "toshiya_marukubo_crystal.png", alt: "Toshiya Marukubo Crystal" },
        { src: "bruh_star.PNG", alt: "MultiPoint  Frank Lab Brush" },
        { src: "grid2.jpg", alt: "Generative Grid" },
  
      
        { src: "mandela.png", alt: "Mandela Trip" },
        { src: "particule_orange.png", alt: "Orange Flower " },
  
        { src: "generative_art.png", alt: "Frank Lab Brush" },
       
        { src: "spirale_transparente.png", alt: "Ulman Spirale Prime Numbers" },
        { src: "flacon_neige.png", alt: "Snow Flacon" },
        { src: "pythagore.png", alt: "Pythagorus" },
        { src: "hsl_phyllotaxis.png", alt: "HSL Phillotaxis" },
     
     
  
      ]);
      
      const getImageUrl = (path) => new URL(`../assets/images/${path}`, import.meta.url).href;
      
      const isGalleryOpen = ref(false);
      const currentIndex = ref(0);
      
      const openGallery = (index) => {
        currentIndex.value = index;
        isGalleryOpen.value = true;
      };
      
      const closeGallery = () => {
        isGalleryOpen.value = false;
      };
      
      const prevImage = () => {
        currentIndex.value = currentIndex.value > 0 ? currentIndex.value - 1 : pictures.value.length - 1;
      };
      
      const nextImage = () => {
        currentIndex.value = currentIndex.value < pictures.value.length - 1 ? currentIndex.value + 1 : 0;
      };
      </script>
      
      <style scoped>
     * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  
  body {
    position: relative;
    font-family: Arial, sans-serif;
    background: rgb(10, 10, 10);
    overflow-x: hidden; /* Prevent horizontal scroll */
  }
  
  .container {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    overflow: hidden; /* Prevent both vertical and horizontal scrolling */
    position: relative; /* Ensures modal elements are placed correctly */
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
  }
  
  .grid-gallery {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3 columns for large screens */
    grid-auto-rows: auto; /* Ensure rows expand properly */
    gap: 1rem;
    width: 100%;
    max-width: 1200px;
    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
    margin: 0 auto; /* Center grid-gallery horizontally */
    
  }
  
  .grid-gallery-picture {
    width: 100%;
    height: 80%;
    max-width: 100%;
    max-height: 100vh;
    cursor: pointer;
    object-fit: cover;
    aspect-ratio: 1 / 2;
    transition: transform 0.25s, box-shadow 0.25s;
    box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.6);
    object-fit: contain;
    background: rgb(0, 0, 0);
  }
  
  .grid-gallery-picture:hover {
    transform: scale(1.2);
    box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.5);
  }
  
  /* Hide gallery grid when modal is open */
  .gallery.show ~ .container .grid-gallery {
    opacity: 0;
    visibility: hidden;
  }
  
  .gallery {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0);
    display: none;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 20px;
    z-index: 1000;
  }
  
  .gallery.show {
    display: flex;
  }
  
  /* Ensure modal image always fits the screen */
  .gallery-image {
    width: auto;
    height: auto;
    max-width: 90vw;
    max-height: 85vh;
    object-fit: contain;
    transition: transform 0.3s ease-in-out;
  }
  
  .nav {
    font-size: 3.5rem;
    color: white;
    background: rgba(139, 139, 139, 0.5);
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 10%;
    position: absolute;
  }
  
  .prev {
    left: 10px;
  }
  
  .next {
    right: 10px;
  }
  
  .title {
    font-size: 1.8rem;
    margin-bottom: 15px;
  }
  
  .actual {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    color: white;
  }
  
  .close {
    position: absolute;
    right: 5%;
    top: 1rem;
    font-size: 2.5rem;
    color: white;
    cursor: pointer;
  }
  
  h1{
    margin-top: 30px;
  }
  
  /* 🔹 Responsive Design */
  @media (max-width: 1024px) {
    .grid-gallery {
      grid-template-columns: repeat(2, 1fr); /* 2 columns for tablets */
    }
  }
  
  @media (max-width: 768px) {
    .grid-gallery {
      grid-template-columns: repeat(2, 1fr); /* Ensures all images are visible */
    }
  }
  
  @media (max-width: 480px) {
    .container {
      height: auto; /* Allow full page scrolling */
      min-height: auto;
      padding-bottom: 20px; /* Prevent images from being cut off */
    }
  
    .grid-gallery {
      grid-template-columns: repeat(1, 1fr); /* Single column for mobile */
    }
  
    .nav {
      font-size: 1rem;
      width: 20px;
      height: 20px;
    }
  }
  
      </style>
      