<template>
  <div>
    <!-- Button to open modal -->
    <div class="flex justify-center w-1/2 items-center m-auto">
      <button @click="openModal" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-blue-600 mb-4 w-full">
        Open Canvas 3
      </button>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50 overflow-hidden max-h-screen">
      <!-- Description -->
      <p v-if="!isDrawing" class="text-white text-1xl font-serif mb-4 absolute top-4 p-5 mx-auto text-center sm:text-left sm:justify-between sm:max-w-3xl sm:w-full bg-green-500 w-[350px]">
        This canvas displays a dynamic animation effect with particles that follow the position of the mouse or touch points placed over the screen surface.<br>
        The position, size, and number of particles change randomly over time.
      </p> 

      <!-- Start Drawing Button -->
      <button v-if="!isDrawing" @click="startDrawing" class="px-8 py-4 bg-green-500 text-white rounded-md hover:bg-blue-600 absolute bottom-4 left-1/2 transform -translate-x-1/2">
        Start Drawing
      </button> 

      <!-- Drawing Canvas and Controls -->
      <div v-if="isDrawing" class="relative w-full h-full">
        <canvas ref="canvas" id="canvas" class="w-full h-full"></canvas>

        <!-- Controls -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button @click="clearCanvas" class="px-8 py-4 bg-yellow-500 text-white rounded-md hover:bg-red-600">
            Clear
          </button>

          <button @click="captureScreenshot" class="px-8 py-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Capture 
          </button>

          <button @click="closeModal" class="px-8 py-4 bg-red-500 text-white rounded-md hover:bg-red-600">
            Close
          </button>
        </div>
      </div>
    </div>  
  </div>
</template>

<script>
export default {
  data() {
    return {
      isModalOpen: false,  
      isDrawing: false,    
      particleArray: [],   
      mouse: { x: null, y: null }, 
      maxSize: 40,
      minSize: 0,
      mouseRadius: 60
    };
  },

  methods: {
    openModal() {
      this.isModalOpen = true;
      document.body.style.overflow = 'hidden'; // Disable page scrolling
    },

    closeModal() {
      this.isModalOpen = false;
      this.isDrawing = false;
      this.cleanupCanvas();
      document.body.style.overflow = ''; // Restore scrolling
    },

    startDrawing() {
      this.isDrawing = true;
      this.$nextTick(() => {
        this.setupCanvas();
      });
    },

    clearCanvas() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.particleArray = [];
      this.setupCanvas();
    },

    captureScreenshot() {
      const canvas = this.$refs.canvas;
      const dataURL = canvas.toDataURL("image/png");

      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'screenshot.png';
      link.click();
    },

    setupCanvas() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');
      ctx.canvas.width = window.innerWidth;
      ctx.canvas.height = window.innerHeight;

      let particleArray = [];
      const colours = ['white'];

      const maxSize = this.maxSize;
      const minSize = this.minSize;
      const mouseRadius = this.mouseRadius;

      let mouse = { x: null, y: null };

      function Particle(x, y, directionX, directionY, size, colour) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.colour = colour;
      }

      Particle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.stroke();
      };

      Particle.prototype.update = function() {
        if (this.x + this.size * 2 > canvas.width || this.x - this.size * 2 < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y + this.size * 2 > canvas.height || this.y - this.size * 2 < 0) {
          this.directionY = -this.directionY;
        }
        this.x += this.directionX;
        this.y += this.directionY;

        if (
          mouse.x - this.x < mouseRadius &&
          mouse.x - this.x > -mouseRadius &&
          mouse.y - this.y < mouseRadius &&
          mouse.y - this.y > -mouseRadius
        ) {
          if (this.size < maxSize) {
            this.size += 10;
          }
        } else if (this.size > minSize) {
          this.size -= 0.01;
        }
        if (this.size < 0) {
          this.size = 0;
        }
        this.draw();
      };

      const initParticles = () => {
        particleArray = [];
        for (let i = 0; i < 1000; i++) {
          let size = 0;
          let x = Math.random() * (innerWidth - size * 2) - size * 2;
          let y = Math.random() * (innerHeight - size * 2) - size * 2;
          let directionX = Math.random() * 0.2 - 0.1;
          let directionY = Math.random() * 0.2 - 0.1;
          let colour = colours[Math.floor(Math.random() * colours.length)];
          particleArray.push(new Particle(x, y, directionX, directionY, size, colour));
        }
      };

      const animate = () => {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particleArray.length; i++) {
          particleArray[i].update();
        }
      };

      initParticles();
      animate();

      window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
      });

      window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        initParticles();
      });
    },

    cleanupCanvas() {
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('resize', this.handleResize);
    }
  }
};
</script>

<style scoped>
canvas {
  max-width: 100vw;
  max-height: 100vh;
  display: block;
}
</style>
