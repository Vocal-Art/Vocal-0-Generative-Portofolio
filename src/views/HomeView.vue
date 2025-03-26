<template>
  <div class="text-2xl text-white min-h-screen flex flex-col items-center justify-start relative px-4 pt-2">
    <!-- Transition for Title and Canvas -->
    <transition name="fade">
      <div v-if="!isSplashFinished" class="w-full text-center p-5 max-w-4xl">
        <!-- Title -->
        <p class="text-2xl md:text-4xl lg:text-5xl font-bold animate-title text-white-600 xyz ">GENERATIVE ART<br>WITH VOCAL 0</p>
        <!-- Canvas for Phyllotaxis Animation -->
        <canvas id="canvas1" class="sm:mt-[-70px] lg:mt-[40px]"></canvas>

        <!-- Counter during splash screen -->
        <div v-if="counter > 0" class="counter-wrapper mt-20">
          <div class="counter-text text-4xl md:text-5xl lg:text-6xl font-extrabold animate-text text-white  py-4 px-6 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300">
            Patience... {{ counter }} seconds
          </div>
        </div>
      </div>
    </transition>

    <!-- Navbar (Hidden during splash screen)  CELE NE FONCTIONNE PAS ENCORE-->
    <div v-show="isNavbarVisible" class="Navbar.vue">
      <!-- Navbar content goes here -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSplashFinished: false,
      isNavbarVisible: false,
      counter: 6,  // Set the countdown time in seconds
    };
  },
  mounted() {
    this.initializeCanvas();
    window.addEventListener("resize", this.resizeCanvas);
    this.startCounter(); // Start the countdown when the component mounts
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resizeCanvas);
  },
  methods: {
    initializeCanvas() {
      const canvas = document.getElementById("canvas1");
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resizeCanvas();

      let number = 0;
      let isMobile = window.innerWidth < 768; // Check if mobile
      let scale = isMobile ? 5 : 9; // Reduce scale for small screens
      let circleSize = isMobile ? 6 : 10; // Reduce circle size for small screens
      ctx.globalCompositeOperation = "destination-over";

      const drawFlower = () => {
        if (number > 600) {
          this.onSplashFinished();
          return;
        }

        let angle = number * 3.7;
        let radius = scale * Math.sqrt(number);
        let positionX = radius * Math.sin(angle) + canvas.width / 2;
        let positionY = radius * Math.cos(angle) + canvas.height / 2;

        ctx.fillStyle = `hsl(${number % 360}, 100%, 50%)`;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(positionX, positionY, circleSize, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        number++;
        requestAnimationFrame(drawFlower);
      };

      drawFlower();
    },
    resizeCanvas() {
      const canvas = document.getElementById("canvas1");
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.initializeCanvas(); // Reinitialize animation on resize
      }
    },
    onSplashFinished() {
      // Set splash to finish and show navbar
      this.isSplashFinished = true;
      this.isNavbarVisible = true;

      // Wait for transition to end before redirecting
      setTimeout(() => {
        this.$router.push("/test");
      }, 1000); // Ensure transition has completed (1 second delay)
    },
    startCounter() {
      const interval = setInterval(() => {
        if (this.counter > 0) {
          this.counter--;
        } else {
          clearInterval(interval);
          this.onSplashFinished();  // Transition after counter reaches 0
        }
      }, 1000);
    }
  },
};
</script>

<style scoped>
/* Title Animation */
@keyframes titleFadeIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-title {
  animation: titleFadeIn 1s ease-out;
}

/* Fade Transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease-in-out;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

/* Canvas Styling */
#canvas1 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(10, 10, 10);
  z-index: -1;
}

/* Allow Scrolling */
html, body {
  overflow: auto;
  margin: 0;
  padding: 0;
  height: 100%;
}

.counter-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Vertically center content */


}

/* .counter-text {
  font-family: 'Roboto', sans-serif;
  color: #fff; 
  text-align: center;
  background-color: rgba(216, 216, 216, 0.6); 
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 16px;
  max-width: 80%;
  width: fit-content;
  transition: all 0.3s ease-in-out;
} */

.counter-text:hover {
  background-color: rgba(0, 0, 0, 0.8);
  transform: translateY(-4px); /* Slight lift on hover */
}

.counter-text span {
  font-size: 2rem;
  font-weight: bold;
  color: #e74c3c; /* Accent color */
}

.counter-wrapper {
  animation: fadeIn 1.5s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
