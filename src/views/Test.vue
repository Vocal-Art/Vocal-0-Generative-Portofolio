<template>
  <div>
    <!-- La variable isDrawing pour contrôler si l'utilisateur a appuyé sur "Start Drawing". Tant qu'il n'a pas appuyé sur ce bouton, le canvas n'est pas affiché et n'est pas interactif-->
    <p v-if="!isDrawing" class="text-white text-2xl font-serif mb-10 relative top-4 p-5 mx-auto text-center w-full sm:w-auto">
      Open one of the Canvas beneath. Create dynamic shapes.<br>
      Start exploring to see the magic of some generative tools.
    </p>

    <!-- Le bouton "Open Modal 1" reste visible tout le temps -->
    
    <!-- Le bouton centré -->
    <div class="flex justify-center flex-col">
      <div class="flex justify-center w-1/2 items-center m-auto">
        <button @click="openModal" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-blue-600 mb-4 w-full">
          Open Canvas 1
        </button>
      </div>

      <Test_2 />
      <Test_3 />
      <Test_4/>
      <Test_5/>
      <Test_6/>
      <Test_7/>

      <p class="text-white text-2xl font-serif mt-[-2px] relative top-4 p-5 mx-auto text-center w-full sm:w-auto">
        Please don't forget to check out my gallery by clicking on the menu
      </p>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
      <p v-if="!isDrawing" class="text-white text-2xl font-serif mb-4 absolute top-4 p-5 mx-auto text-center sm:text-left sm:justify-between sm:max-w-3xl sm:w-full bg-green-500 w-[450px] sm:w-[650px] p-5 mx-auto">
        This canvas is a trail of 4 branched star-shaped form in HSL color.<br>
        The form appears by moving the finger or the mouse fluidly over the screen.<br>
        With each move a new star shape is drawn at the cursor's position.<br>
        Each star is layered on top of the previous ones without erasing the previous drawing (scribbling effect).<br>
        This tool is inspired by a digital artist Frank Laboratory.
      </p>

      <!-- Bouton Start Drawing pour initier le dessin -->
      <button v-if="!isDrawing" @click="startDrawing" class="px-8 py-4 bg-green-500 text-white rounded-md hover:bg-blue-600 absolute bottom-4 left-1/2 transform -translate-x-1/2">
        Start Drawing
      </button>

      <!-- Canevas et bouton Fermer Modal -->
      <div v-if="isDrawing" class="bg-transparent p-0 w-full h-full relative">
        <!-- Canevas sans cadre et transparent -->
        <canvas id="canvas1" class="w-full h-full" style="background: transparent; border: none;"></canvas>

        <!-- Conteneur flex pour les boutons -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          <!-- Bouton Effacer pour réinitialiser le canvas -->
          <button @click="clearCanvas" class="px-8 py-4 bg-yellow-500 text-white rounded-md hover:bg-red-600">
            Clear
          </button>

          <!-- Bouton Capture pour télécharger l'image -->
          <button @click="captureCanvas" class="px-8 py-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Capture
          </button>

          <!-- Bouton Fermer pour fermer la modal -->
          <button @click="closeModal" class="px-8 py-4 bg-red-500 text-white rounded-md hover:bg-red-600">
            Close
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Test_2 from '../components/Test_2.vue';
import Test_3 from '../components/Test_3.vue';
import Test_4 from '../components/Test_4.vue';
import Test_5 from '../components/Test_5.vue';
import Test_6 from '../components/Test_6.vue';
import Test_7 from '../components/Test_7.vue';

export default {
  components: {
    Test_2,
    Test_3,
    Test_4,
    Test_5,
    Test_6,
    Test_7
  },
  
  data() {
    return {
      isModalOpen: false,  // Pour gérer l'état d'ouverture de la modal
      isDrawing: false,    // Détermine si le dessin doit commencer
      hue: 0,              // Variable pour gérer la couleur
      handleDrawing: null, // Référence à la fonction de dessin
    };
  },
  
  methods: {
    // Ouvre la modal
    openModal() {
      this.isModalOpen = true;
    },

    // Ferme la modal
    closeModal() {
      this.isModalOpen = false;
      this.isDrawing = false; // Remet le dessin à false lorsqu'on ferme la modal
      this.cleanupCanvas();  // Nettoie les événements lorsque la modal est fermée
    },

    // Démarre le dessin
    startDrawing() {
      this.isDrawing = true;  // Permet de commencer à dessiner
      this.$nextTick(() => {
        this.setupCanvas();  // Initialisation du canevas après que l'élément soit visible
      });
    },

    // Efface le canvas
    clearCanvas() {
      const canvas = document.getElementById('canvas1');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le contenu du canvas
    },

    // Capture l'image du canvas et la télécharge en format PNG
    captureCanvas() {
      const canvas = document.getElementById('canvas1');
      if (!canvas) {
        console.error("Le canvas n'a pas été trouvé");
        return;
      }

      // Crée un lien pour télécharger l'image
      const dataURL = canvas.toDataURL("image/png");

      // Crée un élément <a> pour permettre le téléchargement
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'canvas_image.png';  // Nom du fichier à télécharger
      link.click();  // Lance le téléchargement
    },

    // Initialisation du canevas et des événements
    setupCanvas() {
      const canvas = document.getElementById('canvas1');
      if (!canvas) {
        console.error("Le canvas n'a pas été trouvé");
        return;
      }

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;  // Le canevas prend toute la largeur de la fenêtre
      canvas.height = window.innerHeight; // Le canevas prend toute la hauteur de la fenêtre

      // Clear the canvas to avoid any unwanted initial strokes or brush marks
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Reset canvas settings
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.shadowBlur = 1;
      ctx.shadowColor = "green";

      // Dynamically calculate radius based on canvas width
      const getStarRadius = () => {
        const canvasWidth = canvas.width;
        // If the screen width is larger than a certain value, reduce the star size
        if (window.innerWidth > 1200) {
          return Math.max(canvasWidth * 0.05, 30); // For large screens, make stars smaller
        }
        return Math.max(canvasWidth * 0.1, 40); // Default size for smaller screens
      };

      // Function to draw the shape
      const drawShape = (x, y, radius, inset, n) => {
        ctx.fillStyle = 'hsl(' + this.hue + ',100%,50%)';
        ctx.beginPath();
        ctx.save();
        ctx.translate(x, y); // Translate to the x, y coordinates where the drawing will occur
        ctx.moveTo(0, 0 - radius); // Move to the starting point of the shape (no shape drawn yet)

        // Draw the shape
        for (let i = 0; i < n; i++) {
          ctx.rotate(Math.PI / n);
          ctx.lineTo(0, 0 - (radius * inset));
          ctx.rotate(Math.PI / n);
          ctx.lineTo(0, 0 - radius);
        }

        ctx.restore();
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      };

      // Handle drawing logic based on user input (mouse or touch)
      const handleDrawing = (e) => {
        this.hue += 3;
        let x, y;

        // Get position relative to the canvas
        const rect = canvas.getBoundingClientRect();
        const offsetX = rect.left;
        const offsetY = rect.top;

        // For mouse events (no preview shape should appear in top-left)
        if (e.type === 'mousemove') {
          x = e.clientX - offsetX;
          y = e.clientY - offsetY;

          // Only draw if the mouse has moved
          if (x !== 0 && y !== 0) {
            const radius = getStarRadius();
            drawShape(x, y, radius, 0.2, 4); // Pass dynamic radius
          }
        }

        // For touch events (draw shape only where touch occurs, no preview at top-left)
        if (e.type === 'touchmove') {
          const touch = e.touches[0];
          x = touch.clientX - offsetX;
          y = touch.clientY - offsetY;

          // Only draw when touch occurs and move it to the proper position
          const radius = getStarRadius();
          drawShape(x, y, radius, 0.2, 4); // Pass dynamic radius
        }
      };

      // Add mouse events
      canvas.addEventListener('mousemove', handleDrawing);

      // Add touch events
      canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent default browser behavior
        handleDrawing(e);
      }, { passive: false });

      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevent default browser behavior
        handleDrawing(e);
      }, { passive: false });

      // Store the reference to handleDrawing for later cleanup
      this.handleDrawing = handleDrawing;
    },

    // Clean up events when modal is closed
    cleanupCanvas() {
      const canvas = document.getElementById('canvas1');
      if (!canvas) return;

      canvas.removeEventListener('mousemove', this.handleDrawing);
      canvas.removeEventListener('touchstart', this.handleDrawing);
      canvas.removeEventListener('touchmove', this.handleDrawing);
    }
  }
};
</script>
