<script setup lang="ts">
import type { SideblockItem } from "~/components/layouts/sideblock/sideblock.types";

const links = ref<SideblockItem[]>([
  {
    type: "link",
    label: "Dashboard",
    icon: "lucide:grid",
    to: "/app",
  },
  {
    type: "link",
    label: "Projects",
    icon: "lucide:folder",
    to: "/app/projects",
  },
  {
    type: "link",
    label: "Tasks",
    icon: "lucide:check",
    to: "/app/tasks",
  },
  {
    type: "link",
    label: "Transactions",
    icon: "lucide:credit-card",
    to: "/app/transactions",
  },
]);
</script>

<template>
  <SideblockLayout :links open-on-mounted size="large">
    <slot />

    <template #logo>
      <h3 class="is-hidden-mobile ml-2">Task manager</h3>
    </template>

    <template #toolbar>
      <div class="toolbar-link">
        <VDarkmodeToggle />
      </div>
    </template>
  </SideblockLayout>
</template>

