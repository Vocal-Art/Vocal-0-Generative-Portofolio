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
        Touch points placing them over the screen surface or follow the position of the mouse. <br> This canvas displays a dynamic animation effect with particles .<br>
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
      touch: { x: null, y: null },
      maxSize: 60,
      minSize: 5,
      touchRadius: 80
    };
  },

  methods: {
    openModal() {
      this.isModalOpen = true;
      document.body.style.overflow = 'hidden';
    },

    closeModal() {
      this.isModalOpen = false;
      this.isDrawing = false;
      this.cleanupCanvas();
      document.body.style.overflow = '';
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // Effacer tout le contenu du canvas
  
  // Vider le tableau de particules
  this.particleArray = [];
  
  // Réinitialiser l'animation et recréer les particules
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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      let particleArray = this.particleArray;
      const colors = ['white', 'blue', 'red', 'yellow'];
      
      function Particle(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      Particle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      };

      Particle.prototype.update = function() {
        this.x += this.directionX;
        this.y += this.directionY;
        if (this.size < 60) this.size += 0.2;
        this.draw();
      };

      const createParticles = (x, y) => {
        for (let i = 0; i < 5; i++) {
          let size = Math.random() * 10 + 10;
          let directionX = (Math.random() - 0.5) * 2;
          let directionY = (Math.random() - 0.5) * 2;
          let color = colors[Math.floor(Math.random() * colors.length)];
          particleArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
      };

      const animate = () => {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particleArray.forEach((particle) => {
          particle.update();
        });
      };

      animate();
      
      canvas.addEventListener('mousemove', (e) => {
        createParticles(e.x, e.y);
      });
      
      canvas.addEventListener('touchstart', (e) => {
        let touch = e.touches[0];
        createParticles(touch.clientX, touch.clientY);
      });
      
      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        let touch = e.touches[0];
        createParticles(touch.clientX, touch.clientY);
      });
    },

    cleanupCanvas() {
      const canvas = this.$refs.canvas;
      canvas.removeEventListener('mousemove', this.createParticles);
      canvas.removeEventListener('touchstart', this.createParticles);
      canvas.removeEventListener('touchmove', this.createParticles);
    }
  }
};
</script>
