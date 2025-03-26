<template>
  <div>
    <!-- Button to open the modal -->
    <div class="flex justify-center w-1/2 items-center m-auto">
      <button @click="openModal" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-blue-600 mb-4 w-full">
        Open Canvas 2
      </button>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
      
      <p v-if="!isDrawing" class="text-white text-1xl font-serif mb-4 absolute top-4 p-5 mx-auto text-center sm:text-left sm:justify-between sm:max-w-3xl sm:w-full bg-green-500 w-[350px]  ">
        The effect of the tool creates dynamic, rotating, multi-point star-like shapes that appear wherever the user moves the mouse or touches the screen.<br>
        As the user interacts, the shapes are drawn in layers, with each new shape slightly rotating, creating a fluid, spiraling, and overlapping visual noisy effect.<br>
       
       <br>
        This tool, is inspired by a digital artist Frank Laboratory.
      </p>

      <!-- Start Drawing Button -->
      <button v-if="!isDrawing" @click="startDrawing" class="px-8 py-4 bg-green-500 text-white rounded-md hover:bg-blue-600 absolute bottom-4 left-1/2 transform -translate-x-1/2">
        Start Drawing
      </button>

      <!-- Canvas and Buttons to Clear, Capture, or Close -->
      <div v-if="isDrawing" class="relative w-full h-full">
        <canvas id="canvas1" class="w-full h-full" style="background: transparent; border: none;"></canvas>

        <!-- Bottom buttons to clear canvas, capture image, or close modal -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button @click="clearCanvas" class="px-8 py-4 bg-yellow-500 text-white rounded-md hover:bg-red-600">
            Clear
          </button>

          <!-- Capture button to download canvas as PNG -->
          <button @click="captureCanvas" class="px-8 py-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
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
      isModalOpen: false,  // To control modal visibility
      isDrawing: false,    // To control if the drawing has started
      hue: 0,              // Color manipulation variable
      handleDrawing: null, // Reference for drawing function
    };
  },

  methods: {
    // Open the modal to start drawing
    openModal() {
      this.isModalOpen = true;
    },

    // Close the modal and clean up
    closeModal() {
      this.isModalOpen = false;
      this.isDrawing = false;
      this.cleanupCanvas();  // Clean up canvas event listeners
    },

    // Start the drawing process
    startDrawing() {
      this.isDrawing = true;
      this.$nextTick(() => {
        this.setupCanvas();  // Set up the canvas after the modal is visible
      });
    },

    // Clear the canvas
    clearCanvas() {
      const canvas = document.getElementById('canvas1');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
    },

    // Capture the canvas image and trigger the download
    captureCanvas() {
      const canvas = document.getElementById('canvas1');
      if (!canvas) {
        console.error("Canvas element not found!");
        return;
      }

      // Create a Data URL of the canvas content
      const dataURL = canvas.toDataURL("image/png");

      // Create an anchor element to trigger download
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'canvas_image.png'; // File name for the download
      link.click(); // Simulate a click to start the download
    },

    // Set up the canvas and event listeners
    setupCanvas() {
      const canvas = document.getElementById('canvas1');
      if (!canvas) {
        console.error("Canvas element not found!");
        return;
      }

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;  // Set canvas width to window width
      canvas.height = window.innerHeight; // Set canvas height to window height

      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.shadowOffsetX = 8;
      ctx.shadowOffsetY = 8;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'black';
      ctx.globalCompositeOperation = 'difference';

      let drawing = false;
      let angle = 0;

      // Function to draw the full multi-point star inside the canvas
      function drawShape(x, y, radius, inset, n) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.save();
        ctx.translate(x, y);  // Set the center point of rotation
        ctx.moveTo(0, 0 - radius);
        for (let i = 0; i < n; i++) {  // Draw the full star shape
          ctx.rotate(Math.PI / n);
          ctx.lineTo(0, 0 - (radius * inset));
          ctx.rotate(Math.PI / n);
          ctx.lineTo(0, 0 - radius);
        }
        ctx.restore();
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      }

      // Mouse event listeners
      let lastDrawTime = 0;
      const drawInterval = 50; // milliseconds between draws

      function onMouseMove(e) {
        if (drawing) {
          const now = Date.now();
          if (now - lastDrawTime > drawInterval) {
            lastDrawTime = now;
            // Ensure the shapes stay inside the canvas bounds
            const x = Math.max(0, Math.min(e.x, canvas.width));
            const y = Math.max(0, Math.min(e.y, canvas.height));
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);

            // Draw full multi-point star inside the canvas
            drawShape(0, 0, 100, 0.5, 20);  // Larger radius to keep star intact
            angle += 0.05; // Slow down the angle increase
            ctx.restore();
          }
        }
      }

      function onMouseDown() {
        drawing = true;
      }

      function onMouseUp() {
        drawing = false;
      }

      // Touch event listeners
      function onTouchMove(e) {
        e.preventDefault();  // Prevent default scroll behavior
        if (drawing) {
          const touch = e.touches[0];
          const x = touch.clientX;
          const y = touch.clientY;

          const now = Date.now();
          if (now - lastDrawTime > drawInterval) {
            lastDrawTime = now;
            // Ensure the shapes stay inside the canvas bounds
            const canvasX = Math.max(0, Math.min(x, canvas.width));
            const canvasY = Math.max(0, Math.min(y, canvas.height));
            ctx.save();
            ctx.translate(canvasX, canvasY);
            ctx.rotate(angle);

            // Draw full multi-point star inside the canvas
            drawShape(0, 0, 100, 0.5, 20);  // Larger radius to keep star intact
            angle += 0.05; // Slow down the angle increase
            ctx.restore();
          }
        }
      }

      function onTouchStart(e) {
        e.preventDefault();
        drawing = true;
      }

      function onTouchEnd() {
        drawing = false;
      }

      // Attach event listeners for mouse and touch events
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('mousedown', onMouseDown);
      canvas.addEventListener('mouseup', onMouseUp);
      canvas.addEventListener('touchmove', onTouchMove, { passive: false });
      canvas.addEventListener('touchstart', onTouchStart, { passive: false });
      canvas.addEventListener('touchend', onTouchEnd);

      // Store reference to remove listeners later
      this.handleDrawing = { onMouseMove, onMouseDown, onMouseUp, onTouchMove, onTouchStart, onTouchEnd };
    },

    // Cleanup canvas event listeners when modal is closed
    cleanupCanvas() {
      const canvas = document.getElementById('canvas1');
      if (!canvas) return;

      canvas.removeEventListener('mousemove', this.handleDrawing.onMouseMove);
      canvas.removeEventListener('mousedown', this.handleDrawing.onMouseDown);
      canvas.removeEventListener('mouseup', this.handleDrawing.onMouseUp);
      canvas.removeEventListener('touchmove', this.handleDrawing.onTouchMove);
      canvas.removeEventListener('touchstart', this.handleDrawing.onTouchStart);
      canvas.removeEventListener('touchend', this.handleDrawing.onTouchEnd);
    }
  }
};
</script>

<style scoped>
/* Modal and Button Styles */
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

.close-modal-btn {
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  position: absolute;
  bottom: 20px;
}

.close-modal-btn:hover {
  background-color: darkred;
}

canvas {
  background: black;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
