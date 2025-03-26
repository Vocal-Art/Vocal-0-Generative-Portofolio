<template>
  <div>
    <!-- First Modal with Description -->
    <div class="flex justify-center w-1/2 items-center m-auto">
      <button @click="openDescriptionModal" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-blue-600 mb-4 w-full">
        Open Canvas 7
      </button>
    </div>

    <!-- Description Modal -->
    <div v-if="isDescriptionModalOpen" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
      <!-- Description -->
      <p v-if="!isGenerating && !generationCompleted" class="text-white text-2xl font-serif mb-4 absolute top-4 p-5 mx-auto text-center sm:text-left sm:justify-between sm:max-w-3xl sm:w-full bg-green-500 w-[450px] sm:w-[650px] p-5 mx-auto">
        This tool generates a dynamic grid of random shapes (squares or lines) that can be interacted with, by zooming through it.<br>
        This tool was inspired by myself.
      </p>

      <!-- Continue Button -->
      <button @click="openModal" class="px-8 py-4 bg-green-500 text-white rounded-md hover:bg-blue-600 absolute bottom-4 left-1/2 transform -translate-x-1/2">
        Continue to Canvas
      </button>
    </div>

    <!-- Canvas Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
      <!-- Canvas and Controls -->
     
      <!-- <div class="controls absolute bottom-4 left-5 flex flex-col items-start gap-4 z-10">
        <label class="text-white">Shape Size</label>
        <input type="range" v-model="shapeSize" min="10" max="150" class="slider w-40" />
        <span class="text-white">{{ shapeSize }}</span>
      </div> -->
<!-- Canvas Element -->
<canvas ref="canvas" id="myCanvas" class="w-full h-full" style="background: transparent;"></canvas>
      <!-- Toggle Shapes Button -->
      
    
      
      <button @click="toggleShapes" class="toggle-shapes-button absolute mt-4 top-0 left-1/2 transform -translate-x-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-blue-600 z-10">
        Toggle Shapes
      </button>

      <div class="flex flex-row ">
        <div class="controls absolute bottom-4 left-5 flex flex-col items-start gap-4 z-10">
        <label class="text-white">Shape Size</label>
        <input type="range" v-model="shapeSize" min="10" max="150" class="slider w-40" />
        <span class="text-white">{{ shapeSize }}</span>
      </div>

      <!-- Capture Screenshot Button -->
      <button @click="captureScreenshot" class="mt-197 ml-10 px-8 py-5 bg-blue-500 text-white rounded-md hover:bg-blue-600 lg:mt-290 ">Capture</button>

      <!-- Close Button -->
      <button @click="closeModal" class="px-8 py-5 bg-red-800 text-white rounded-md hover:bg-red-600 absolute bottom-10 right-4">
        Close
      </button>

    </div>

    </div>
  </div>
</template>       

<script>
export default {
  name: "Test_7",
  data() {
    return {
      isDescriptionModalOpen: false, // Controls the first modal (description)
      isModalOpen: false, // Controls the second modal (canvas with controls)
      isSquare: true,
      shapeSize: 50, // Initial shape size
      canvas: null,
      ctx: null,
      particles: [],
    };
  },
  methods: {
    // Opens the first modal (description modal)
    openDescriptionModal() {
      this.isDescriptionModalOpen = true;
    },
    // Closes the first modal (description modal)
    closeDescriptionModal() {
      this.isDescriptionModalOpen = false;
    },
    // Opens the second modal (canvas with controls)
    openModal() {
      this.isModalOpen = true;
      this.setupCanvas();
      this.closeDescriptionModal(); // Close description modal when continuing
    },
    // Closes the second modal (canvas with controls)
    closeModal() {
      this.isModalOpen = false;
      this.cleanupCanvas();
    },
    // Toggles between square and line shapes
    toggleShapes() {
      this.isSquare = !this.isSquare;
      this.draw();
    },
    // Sets up the canvas and event listeners
    setupCanvas() {
      this.$nextTick(() => {
        this.canvas = this.$refs.canvas;
        if (this.canvas) {
          this.ctx = this.canvas.getContext("2d");
          this.resizeCanvas();
          window.addEventListener("resize", this.resizeCanvas);
          this.draw();
        }
      });
    },
    // Resizes the canvas when the window is resized
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.draw();
    },
    // Draws shapes (squares or lines) on the canvas
    draw() {
      const width = this.canvas.width;
      const height = this.canvas.height;
      this.ctx.fillStyle = "rgb(10, 10, 10)"; // Background color
      this.ctx.fillRect(0, 0, width, height);

      const numCols = Math.ceil(width / this.shapeSize);
      const numRows = Math.ceil(height / this.shapeSize);

      for (let i = 0; i < numCols; i++) {
        for (let j = 0; j < numRows; j++) {
          let posX = i * this.shapeSize;
          let posY = j * this.shapeSize;
          if (posX >= width || posY >= height) continue;

          if (this.isSquare) {
            this.ctx.fillStyle = this.randomHSL(); // Use random HSL for square
            this.ctx.fillRect(posX, posY, this.shapeSize, this.shapeSize);
          } else {
            let lineLength = this.shapeSize / 2;
            this.drawLine(posX + this.shapeSize / 2, posY + this.shapeSize / 2, lineLength);
          }
        }
      }
    },

    // Draws a line on the canvas
    drawLine(x, y, length) {
      const angle = Math.random() * 2 * Math.PI;
      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;

      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(endX, endY);
      this.ctx.strokeStyle = this.randomHSL(); // Use random HSL for lines
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    },

    // Function to generate random HSL color
    randomHSL() {
      const h = Math.random() * 360; // Random hue (0-360)
      const s = Math.random() * 30 + 70; // Random saturation (70-100)
      const l = Math.random() * 20 + 40; // Random lightness (40-60)
      return `hsl(${h}, ${s}%, ${l}%)`; // Return HSL string
    },

    // Capture the canvas content as a PNG and trigger a download
    captureScreenshot() {
      const canvas = this.$refs.canvas;
      const imageUrl = canvas.toDataURL('image/png');  // Capture the image as PNG

      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'canvas-screenshot.png';  // Name of the downloaded file
      link.click();  // Trigger the download
    },

    // Clean up event listeners when modal is closed
    cleanupCanvas() {
      window.removeEventListener("resize", this.resizeCanvas);
    },
  },
  watch: {
    // Watch for changes in shapeSize and redraw the canvas
    shapeSize() {
      this.draw(); // Redraw the canvas when shapeSize changes
    },
  },
  mounted() {
    this.setupCanvas();
  },
};
</script>

<style scoped>
.controls {
  z-index: 10;
}

.slider {
  margin: 10px 0;
  width: 150px;
}

button {
  z-index: 10;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
}

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


</style>
