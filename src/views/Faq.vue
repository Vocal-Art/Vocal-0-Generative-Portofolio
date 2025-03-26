<template>
    <div class="min-h-screen text-white flex flex-col items-center justify-start px-6 py-12" 
      style="background-color: rgb(10, 10, 10);">
      
      <p class="text-2xl md:text-4xl font-bold mb-8 mt-8 text-center">
        Click on the question below to see the answer
      </p>
  
      <!-- FAQ Section -->
      <div class="faq-container max-w-4xl w-full sm:p-6 p-4">
        <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
          <div 
            class="faq-question cursor-pointer py-3 px-4 text-lg md:text-xl font-semibold border-b border-white"
            @click="toggleAnswer(index)"
          >
            {{ faq.question }}
          </div>
          <div 
            v-show="faq.open" 
            class="faq-answer py-3 px-4 text-lg md:text-xl text-gray-300"
          >
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // FAQ Data (Reactive)
  const faqs = ref([
    {
      question: 'What material did I use to make this project?',
      answer: 'An internet connection, a computer, and a text editor (Visual Studio Code).',
      open: false,
    },
    {
      question: 'What is generative art?',
      answer: 'Generative art is a form of art that uses algorithms, computer systems, and automated processes to create works of art.',
      open: false,
    },
    {
      question: 'How does an autonomous system work?',
      answer: 'An autonomous system operates independently, making decisions and taking actions based on its own rules, programs, or algorithms.',
      open: false,
    },
    {
      question: 'What is an algorithm?',
      answer: 'An algorithm is a set of instructions that must be executed in a specific order to produce a desired result. It can be implemented in different programming languages.',
      open: false,
    },
    {
      question: 'What is a loop?',
      answer: 'Loops allow tasks to be repeated multiple times, which is essential for saving time and minimizing errors in programming.',
      open: false,
    },
    {
      question: 'What is a condition?',
      answer: 'A condition in programming is like a question that determines what action the program should take based on whether the condition is true or false.',
      open: false,
    },
    {
      question: 'Did I use AI for this project?',
      answer: 'The generative structures were made with vanilla JavaScript. ChatGPT was only used to improve the ergonomics of the JavaScript code.',
      open: false,
    },
  ]);
  
  // Toggle the visibility of the answer when a question is clicked
  const toggleAnswer = (index) => {
    faqs.value[index].open = !faqs.value[index].open;
  };
  </script>
  
  <style scoped>
  .faq-item {
    transition: all 0.3s ease;
  }
  
  .faq-question {
    background-color: #38b2ac;
    border-radius: 4px;
  }
  
  .faq-answer {
    background-color: transparent;
    margin-top: 10px;
  }
  
  .faq-container {
    margin: 0 auto;
  }
  </style>
  