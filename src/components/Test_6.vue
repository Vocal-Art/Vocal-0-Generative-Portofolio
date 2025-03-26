<template>
  <div>
    <div class="flex justify-center w-1/2 items-center m-auto">
      <button @click="openModal" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-blue-600 mb-4 w-full">
        Open Canvas 6
      </button>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50 overflow-hidden">
      <!-- Description of the modal -->
      <p v-if="!isDrawing" class="text-white text-1xl font-serif mb-4 absolute top-4 p-5 mx-auto text-center sm:text-left sm:justify-between sm:max-w-3xl sm:w-full bg-green-500 w-[350px] ">
        This tool uses a sprite image to create particles (planets) that are placed at the mouse or touch position,
        and as you move the mouse or touch, the planets follow the cursor, creating a dynamic effect.<br>
        The tool was inspired by Frank Laboratory.
      </p>

      <!-- Start Drawing Button -->
      <button v-if="!isDrawing" @click="startDrawing" class="px-8 py-4 bg-green-500 text-white rounded-md hover:bg-blue-600 absolute bottom-4 left-1/2 transform -translate-x-1/2">
        Start Drawing
      </button>

      <!-- Canvas -->
      <div v-if="isDrawing" class="relative w-full h-full">
        <canvas ref="canvas" id="primeCanvas" class="w-full h-full"></canvas>

        <!-- Bottom buttons -->
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
  name: 'Test_6',
  data() {
    return {
      isModalOpen: false,
      isDrawing: false,
      canvas: null,
      ctx: null,
      particles: [],
      mouse: { x: null, y: null, radius: 30 },
      sprite: new Image(),
    };
  },
  methods: {
  // Ouvre le modal
  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden'; // Désactive le défilement
    this.sprite.src = 'planets2.png';
  },
  
  // Ferme le modal
  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = ''; // Restaure le défilement
    this.cleanupCanvas();
  },
  
  // Commence le dessin
  startDrawing() {
    this.isDrawing = true;
    this.$nextTick(() => {
      this.setupCanvas();
    });
  },
  
  // Efface le canvas
  clearCanvas() {
    this.resetState();
    this.setupCanvas();
  },
  
  // Réinitialise l'état
  resetState() {
    this.particles = [];
    this.mouse.x = null;
    this.mouse.y = null;
  },
  
  // Configure le canvas
  setupCanvas() {
    this.$nextTick(() => {
      this.canvas = this.$refs.canvas;
      if (this.canvas) {
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('touchstart', this.handleTouchMove);
        window.addEventListener('touchmove', this.handleTouchMove);
        window.addEventListener('touchend', this.handleTouchEnd);

        this.animate();
      }
    });
  },

  // Gère le mouvement de la souris
  handleMouseMove(event) {
    this.mouse.x = event.x;
    this.mouse.y = event.y;
    if (this.isDrawing) {
      this.addParticle(event.x, event.y, true);  // true indique qu'on clique
    }
  },
  
  // Gère le mouvement tactile
  handleTouchMove(event) {
    event.preventDefault(); // Empêche le défilement lors du déplacement tactile
    const touch = event.touches[0];
    this.mouse.x = touch.clientX;
    this.mouse.y = touch.clientY;
    if (this.isDrawing) {
      this.addParticle(this.mouse.x, this.mouse.y, true);  // true pour indiquer interaction tactile
    }
  },
  
  handleTouchEnd(event) {},
  
  // Ajoute une particule (planète)
  addParticle(x, y, isInteracting = false) {
    let particle = new Particle(x, y, this.ctx, this.sprite);
    
    // Si une interaction (clic ou touché) se produit, augmente la taille de la planète
    if (isInteracting) {
      particle.radius *= 5;  // Double la taille de la planète
    }

    this.particles.push(particle);
  },

  // Animation des particules
  animate() {
    if (this.isDrawing) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.forEach((p) => p.draw());
      requestAnimationFrame(this.animate);
    }
  },

  // Nettoie les écouteurs d'événements
  cleanupCanvas() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('touchstart', this.handleTouchMove);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
  },

  // Capture une capture d'écran
  captureScreenshot() {
    const canvas = this.$refs.canvas;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'screenshot.png';
    link.click();
  },
},

mounted() {
  this.sprite.onload = () => this.setupCanvas();
},

};

// Particle class
class Particle {
  constructor(x, y, ctx, sprite) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 20 + 10;
    this.ctx = ctx;
    this.sprite = sprite;
    this.size = 250;
    this.frameX = Math.floor(Math.random() * 4);
    this.frameY = Math.floor(Math.random() * 4);
  }
  draw() {
    if (this.sprite.complete) {
      this.ctx.drawImage(
        this.sprite,
        this.size * this.frameX,
        this.size * this.frameY,
        this.size,
        this.size,
        this.x - this.radius / 2,
        this.y - this.radius / 2,
        this.radius,
        this.radius
      );
    }
  }
}
</script>

<style scoped>
canvas {
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
}

button {
  z-index: 10;
}
</style>
