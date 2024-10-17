<script setup lang="ts">
const pageTitle = useState("page-title");
onMounted(() => {
  pageTitle.value = "Task Manager";
});
</script>

<template>
  <div>
    <VCard> Hello Vuero </VCard>
  </div>
</template>

