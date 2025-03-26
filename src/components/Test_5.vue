<template>
  <div>
    <div class="flex justify-center w-1/2 items-center m-auto">
      <button @click="openModal" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-blue-600 mb-4 w-full">
        Open Canvas 5
      </button>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
      
      <!-- Description -->
      <p v-if="!isGenerating && !generationCompleted" class="text-white text-2xl font-serif mb-4 absolute top-4 p-5 mx-auto text-center sm:text-left sm:justify-between sm:max-w-3xl sm:w-full bg-green-500 w-[450px] sm:w-[650px] p-5 mx-auto">
        So, let's see how primes appear in a spiral shape.<br>
        A prime spiral starts in the middle of a grid and moves in a spiral pattern (right, up, left, down).<br>
        Prime numbers are 2, 3, 5, 7, etc.<br>
        The algorithm checks if the number is prime.<br>
        If it is, a red spot is drawn at that position.<br>
        The spiral keeps growing over time, and the prime numbers spots form a unique pattern along their way.<br>
        This tool was inspired by Daniel Shiffman.
      </p>

      <!-- Start Button -->
      <button v-if="!isGenerating && !generationCompleted" @click="startGeneration" class="px-8 py-4 bg-green-500 text-white rounded-md hover:bg-blue-600 absolute bottom-4 left-1/2 transform -translate-x-1/2">
        Start Generation
      </button>

      <!-- Canvas -->
      <div class="relative w-full h-full">
        <canvas ref="canvas" id="primeCanvas" class="w-full h-full" style="background: transparent; border: none;"></canvas>

        <!-- Bottom buttons to clear, capture, and close modal (appear after generation starts) -->
        <div v-if="isGenerating" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          
          <!-- Clear Button -->
          <button @click="clearCanvas" class="px-8 py-4 bg-yellow-500 text-white rounded-md hover:bg-red-600">
            Clear
          </button>

          <!-- Capture Button -->
          <button @click="captureCanvas" class="px-8 py-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Capture
          </button>

          <!-- Close Button -->
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
      isModalOpen: false,  // Controls modal visibility
      isGenerating: false, // Controls whether generation is in progress
      generationCompleted: false,  // Flag to track if generation is done
      canvas: null,
      ctx: null,
      step: 1,
      px: 0,
      py: 0,
      x: 0,
      y: 0,
      stepSize: 5,
      numSteps: 1,
      state: 0,
      turnCounter: 1,
      totalSteps: 0,
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
      this.resetState();  // Reset state when opening the modal
    },
    closeModal() {
      this.isModalOpen = false;
      this.cleanupCanvas();
    },
    startGeneration() {
      if (!this.generationCompleted) {
        this.isGenerating = true;
        this.setupCanvas();  // Start the prime spiral generation
        this.generationCompleted = true;  // Mark the generation as completed
      }
    },
    resetState() {
      // Reset the state of the generation to allow a fresh start
      this.isGenerating = false;
      this.generationCompleted = false;
      this.step = 1;
      this.numSteps = 1;
      this.state = 0;
      this.turnCounter = 1;
      this.totalSteps = 0;
      this.x = 0;
      this.y = 0;
      this.px = 0;
      this.py = 0;
      this.canvas = null;
      this.ctx = null;
    },
    setupCanvas() {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext('2d');
      this.resizeCanvas();
      this.setupDrawing();
    },
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },
    setupDrawing() {
  const cols = this.canvas.width / this.stepSize;
  const rows = this.canvas.height / this.stepSize;
  this.totalSteps = cols * rows;

  this.x = this.canvas.width / 2;
  this.y = this.canvas.height / 2;
  this.px = this.x;
  this.py = this.y;

  // Make sure the canvas is clear, without filling it with black
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear canvas (transparent background)
  
  this.draw();
}
,
    isPrime(value) {
      if (value === 1) return false;
      for (let i = 2; i <= Math.sqrt(value); i++) {
        if (value % i === 0) return false;
      }
      return true;
    },
    draw() {
      if (this.step > this.totalSteps) return; // Stop drawing when finished

      this.ctx.fillStyle = 'red'; // Set drawing color to red
      this.ctx.strokeStyle = 'red'; // Set line color to red

      // Draw a circle for prime numbers
      if (this.isPrime(this.step)) {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.stepSize * 0.25, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Draw line from previous point
      this.ctx.beginPath();
      this.ctx.moveTo(this.px, this.py);
      this.ctx.lineTo(this.x, this.y);
      this.ctx.stroke();

      // Update previous point
      this.px = this.x;
      this.py = this.y;

      // Change direction based on state
      switch (this.state) {
        case 0: this.x += this.stepSize; break; // Right
        case 1: this.y -= this.stepSize; break; // Up
        case 2: this.x -= this.stepSize; break; // Left
        case 3: this.y += this.stepSize; break; // Down
      }

      // Rotate after completing a segment
      if (this.step % this.numSteps === 0) {
        this.state = (this.state + 1) % 4;
        this.turnCounter++;
        if (this.turnCounter % 2 === 0) {
          this.numSteps++;
        }
      }

      this.step++;
      setTimeout(() => requestAnimationFrame(this.draw), 1); // Ultra-fast frame rate
    },
    cleanupCanvas() {
      window.removeEventListener("resize", this.resizeCanvas);
    },
    captureCanvas() {
      const dataURL = this.canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'prime_spiral_image.png'; // Set the download file name
      link.click(); // Trigger the download
    },
    clearCanvas() {
      // Clear the canvas and restart the prime spiral generation
      this.setupCanvas();
    }
  },
  mounted() {
    window.addEventListener("resize", this.resizeCanvas);
  }
};
</script>

  
  <style scoped>
  /* Styles for modal and buttons */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
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
  