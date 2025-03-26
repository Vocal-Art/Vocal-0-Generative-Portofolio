<template>
  <div>
    <div class="flex justify-center w-1/2 items-center m-auto">
      <button @click="openModal" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-blue-600 mb-4 w-full">
        Open Canvas 6
      </button>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
      <!-- Description of the modal -->
      <p v-if="!isDrawing" class="text-white text-2xl font-serif mb-4 absolute top-4 p-5 mx-auto text-center sm:text-left sm:justify-between sm:max-w-3xl sm:w-full bg-green-500 w-[450px] sm:w-[650px] p-5 mx-auto">
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
        <canvas ref="canvas" id="primeCanvas" class="w-full h-full" style="background: transparent; border: none;"></canvas>

        <!-- Bottom buttons -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button @click="clearCanvas" class="px-8 py-4 bg-yellow-500 text-white rounded-md hover:bg-red-600">
            Clear
          </button>
          <!-- Capture Button -->
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
      mouse: {
        x: null,
        y: null,
        radius: 30, // Mouse interaction area size
      },
      sprite: new Image(),
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
      this.isDrawing = false;
      this.sprite.src = 'planets2.png';
    },
    closeModal() {
      this.isModalOpen = false;
      this.cleanupCanvas();
    },
    startDrawing() {
      this.isDrawing = true;
      this.$nextTick(() => {
        this.setupCanvas();
      });
    },
    clearCanvas() {
      this.resetState();
      this.setupCanvas();
    },
    resetState() {
      this.particles = [];
      this.mouse.x = null;
      this.mouse.y = null;
    },
    setupCanvas() {
      this.$nextTick(() => {
        this.canvas = this.$refs.canvas;
        if (this.canvas) {
          this.ctx = this.canvas.getContext('2d');
          this.canvas.width = window.innerWidth;
          this.canvas.height = window.innerHeight;

          window.addEventListener('mousemove', this.handleMouseMove);
          window.addEventListener('touchstart', this.handleTouchStart);
          window.addEventListener('touchmove', this.handleTouchMove);
          window.addEventListener('touchend', this.handleTouchEnd);

          this.animate();
        }
      });
    },
    handleMouseMove(event) {
      this.mouse.x = event.x;
      this.mouse.y = event.y;

      if (this.isDrawing) {
        this.addParticle(event.x, event.y);

        // Enlarge particles near the cursor
        this.particles.forEach(particle => {
          let dx = particle.x - this.mouse.x;
          let dy = particle.y - this.mouse.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.mouse.radius) {
            particle.enlarge();
          }
        });
      }
    },
    handleTouchStart(event) {
      this.handleTouchMove(event);
    },
    handleTouchMove(event) {
      const touch = event.touches[0];
      this.mouse.x = touch.clientX;
      this.mouse.y = touch.clientY;

      if (this.isDrawing) {
        this.addParticle(this.mouse.x, this.mouse.y);

        this.particles.forEach(particle => {
          let dx = particle.x - this.mouse.x;
          let dy = particle.y - this.mouse.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.mouse.radius) {
            particle.enlarge();
          }
        });
      }
    },
    handleTouchEnd(event) {
      // Handle touch end if needed
    },
    addParticle(x, y) {
      let particle = new Particle(x, y, this.ctx, this.sprite);
      
      // Increase radius when created
      particle.radius *= 1.5;

      this.particles.push(particle);
    },
    animate() {
      if (this.isDrawing) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
          this.particles[i].draw();
        }

        this.particles = this.particles.filter(p => p.x > 0 && p.x < this.canvas.width && p.y > 0 && p.y < this.canvas.height);

        requestAnimationFrame(this.animate);
      }
    },
    cleanupCanvas() {
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('touchstart', this.handleTouchStart);
      window.removeEventListener('touchmove', this.handleTouchMove);
      window.removeEventListener('touchend', this.handleTouchEnd);
    },

    // New method for capturing the screenshot
    captureScreenshot() {
      const canvas = this.$refs.canvas;
      const imageUrl = canvas.toDataURL('image/png');  // Capture the image as PNG

      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'screenshot.png';  // Name of the downloaded file
      link.click();  // Trigger the download
    },
  },
  mounted() {
    this.sprite.onload = () => {
      this.setupCanvas();
    };
    this.sprite.onerror = (error) => {
      console.error('Error loading image:', error);
    };
  },
};

// Particle class
class Particle {
  constructor(x, y, ctx, sprite) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 20 + 10; // Base radius
    this.ctx = ctx;
    this.sprite = sprite;
    this.color = 'hsl(' + Math.random() * 360 + ', 100%, 50%)';
    this.size = 250;
    this.frameX = Math.floor(Math.random() * 4);
    this.frameY = Math.floor(Math.random() * 4);
  }

  // Function to enlarge the planet size when interacted with
  enlarge() {
    this.radius *= 1.1;
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
