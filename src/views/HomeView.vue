<template>
    <div class="text-2xl text-white min-h-screen flex flex-col items-center justify-center space-y-6">
      <div class="text-center">
        <p class="text-xl sm:text-xl md:text-2xl lg:text-3xl  mt-4 font-bold">GENERATIVE<br>ART<br>GENERATIVE<br>STRUCTURES</p>
        <div class="flex justify-center ">
          <img src="../assets/images/generative_art2.png" alt="" class="cursor-pointer transform transition-transform duration-700" @click="rotateImage">
        </div>
            <p class="text-[18px] sm:text-xl md:text-2xl lg:text-3xl  mt-4 font-bold">GENERATIVE ART, A GEOMETRIC HANDY REALITY</p>
        <p class="mt-2 text-[18px]">AN ALGORITHMIC GENERATION PROCESS OF</p>
        <p class="mt-2 text-[18px]">NEW SHAPES, COLORS, & PATTERNS!</p>
      </div>
      
      <p class="mt-4 text-[18px]">I'm Vocal 0 😁</p>
      <p class="mt-2 text-[18px]">&copy; copyright</p>
    </div>
  </template>
  
  
  <script>
  export default {
    data() {
      return {
        rotated: false
      };
    },
    methods: {
      rotateImage(event) {
        this.rotated = !this.rotated;
        event.target.style.transform = this.rotated ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    }
  };
  </script>




