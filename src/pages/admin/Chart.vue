<template>
  <h1>Chart demo</h1>
  <canvas id="myChart"></canvas>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import Chart from 'chart.js/auto'

  onMounted(() => {
    const ctx = document.getElementById('myChart')
    new Chart(ctx, {
      data: {
        datasets: [
          {
            type: 'bar',
            label: 'Bar chart',
            data: [10, 20, 30, 40],
            backgroundColor: ' #79DAFF',
          },
          {
            type: 'line',
            label: 'Line chart',
            data: [12, 30, 10, 20],
            borderColor: '#004AFF',
          },
        ],
        labels: ['January', 'February', 'March', 'April'],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  })
</script>

<style scoped></style>
