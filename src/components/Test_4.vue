<template>
  <div>
    <div class="flex justify-center w-1/2 items-center m-auto">
      <button @click="openModal" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-blue-600 mb-4 w-full ">
        Open Canvas 4
      </button>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
      
      <!-- Description  -->
      <p v-if="!isGenerating && !generationCompleted" class="text-white text-2xl font-serif mb-4 absolute top-4 p-5 mx-auto text-center sm:text-left sm:justify-between sm:max-w-3xl sm:w-full bg-green-500 w-[450px] sm:w-[650px] p-5 mx-auto">
        You will see a HSL tree appearing on the screen.<br>
        The tree generation uses randomness to create different shapes every time, simulating how a real tree grows.<br>
        It randomly adjusts the angles and lengths of branches, making each tree look unique.<br>
        The color of the leaves change randomly as well.<br>
        This tool was inspired by Ira Greenberg.   
      </p>

      <!-- Start Button -->
      <button v-if="!isGenerating && !generationCompleted" @click="startGeneration" class="px-8 py-4 bg-green-500 text-white rounded-md hover:bg-blue-600 absolute bottom-4 left-1/2 transform -translate-x-1/2">
        Start Generation
      </button>

      <!-- Canvas -->
      <div class="relative w-full h-full">
        <canvas ref="canvas" id="canvas4" class="w-full h-full" style="background: transparent; border: none;"></canvas>

        <!-- Bottom button to clear canvas, capture image, and close modal (only appear after generation starts) -->
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
      isModalOpen: false,  // To control modal visibility
      isGenerating: false, // To control if the generation is in progress
      generationCompleted: false,  // Flag to track if generation is done
      counter: 0,
      counter2: 0,
      xg: 58,
      yg: 46,
      trunkSegments: 7,   // Fixed trunk segments
      nodeLimit: 20000,
      pts: new Array(20000),
      branchLimit: 620,
      trunkLength: 200,   // Fixed trunk length
      lean2: new Array(8).fill(0), // Trunk lean
      trunkRadius: 26,    // Fixed trunk radius
      canvas: null,
      ctx: null,
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
        this.setupCanvas();  // Start the tree generation
        this.generationCompleted = true;  // Mark the generation as completed
      }
    },
    resetState() {
      // Reset the state of the generation to allow a fresh start
      this.isGenerating = false;
      this.generationCompleted = false;
      this.counter = 0;
      this.counter2 = 0;
      this.xg = 58;
      this.yg = 46;
      this.trunkLength = 200;
      this.trunkRadius = 26;
      this.lean2 = new Array(8).fill(0);
      this.pts = new Array(20000);
      this.canvas = null;
      this.ctx = null;
    },
    setupCanvas() {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext("2d");
      this.resizeCanvas();
      this.setupTree();
    },
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.setupTree();
    },
    setupTree() {
  this.counter = 0;
  this.counter2 = 0;
  
  // Clear canvas to keep it transparent
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear canvas, making it transparent
  
  this.ctx.strokeStyle = "rgb(10, 0, 100)";
  this.trunkLength = 200;  // Fixed trunk length
  this.trunkRadius = 26;   // Fixed trunk radius
  this.trunk();
}
,
    trunk() {
      let startingY = this.canvas.height - this.trunkLength;
      let startX = this.canvas.width / 2;
  
      for (let i = 0; i < this.trunkSegments; i++) {
        let lean = this.myRand(22);
        this.ctx.lineWidth = this.trunkRadius + 12; // Fixed trunk radius
        let currentY = startingY - (this.trunkLength / this.trunkSegments) * i;
        this.drawLine(startX + this.lean2[i], currentY, startX + lean, currentY - (this.trunkLength / this.trunkSegments));
        this.lean2[i + 1] = lean;
      }
      this.pts[0] = { x: startX + this.lean2[this.trunkSegments], y: startingY - this.trunkLength };
      if (this.isGenerating) {
        this.branch(this.pts);
      }
    },
    branch(pts) {
      let stemCount = 2;
      if (this.counter2 < this.branchLimit) {
        this.ctx.lineWidth = this.trunkRadius;
        let color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.ctx.strokeStyle = color;
  
        if (this.counter2 < 200) {
          this.yg -= Math.random() * 0.354;
          this.xg -= Math.random() * 0.625;
        } else {
          stemCount = 2 + Math.floor(Math.random() * 15);
          this.yg -= this.myRand(0.65);
          this.xg += Math.random() * 1.5;
        }
  
        for (let j = 0; j < stemCount; j++) {
          let xx = this.myRand(30);
          let yy = this.myRand(40);
          this.orgLine(pts[this.counter2].x, pts[this.counter2].y, pts[this.counter2].x + this.xg + xx, pts[this.counter2].y - this.yg + yy);
          this.pts[this.counter + 1] = { x: pts[this.counter2].x + this.xg + xx, y: pts[this.counter2].y - this.yg + yy };
          this.xg *= -1;
          this.counter++;
        }
        this.counter2++;
        if (this.isGenerating) {
          requestAnimationFrame(() => this.branch(pts));
        }
      }
    },
    orgLine(x1, y1, x2, y2) {
      let sections = 8;
      let xd = x2 - x1;
      let yd = y2 - y1;
      let twist2 = new Array(sections + 1).fill(0);
      for (let i = 0; i < sections; i++) {
        let twist = this.myRand(5);
        this.drawLine(x1 + (xd / sections) * i + twist2[i], y1 + (yd / sections) * i, x1 + (xd / sections) * (i + 1) + twist, y1 + (yd / sections) * (i + 1));
        twist2[i + 1] = twist;
      }
    },
    drawLine(x1, y1, x2, y2) {
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    },
    myRand(val) {
      return Math.random() * val + Math.random() * -val;
    },
    cleanupCanvas() {
      // Cleanup and remove event listeners
      window.removeEventListener("resize", this.resizeCanvas);
    },
    captureCanvas() {
      const dataURL = this.canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'tree_image.png'; // Set the download file name
      link.click(); // Trigger the download
    },
    clearCanvas() {
      // Clear the canvas and restart tree generation
      this.setupCanvas();
    }
  },
  mounted() {
    window.addEventListener("resize", this.resizeCanvas);
  }
};
</script>


<style scoped>
/* Styles du modal et des boutons */


canvas {
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
}

/* Adjust button positioning and styling */
button {
  z-index: 10;
}
</style>
