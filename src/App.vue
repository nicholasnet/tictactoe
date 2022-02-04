<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import TictacToe from './components/TictacToe.vue'
document.getElementById('year').innerText = new Date().getFullYear()
</script>

<template>
    <div>
        <TictacToe />
    </div>
</template>
