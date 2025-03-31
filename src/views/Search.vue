<script setup lang="ts">
import { onMounted } from 'vue';

const props = defineProps<{
  query: string;
}>();

onMounted(() => {
  console.log(props.query);
});

</script>

<template>
  <div>
    a
  </div>
</template>
