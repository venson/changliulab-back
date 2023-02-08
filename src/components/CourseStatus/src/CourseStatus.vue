<template>
  <div class="flex items-center">
    <n-tooltip v-for="(state, index) in courseStatus" :key="index" trigger="hover">
      <template #trigger>
        <n-tag class="mx-0.5" size="small" :bordered="false" :type="state.tagType">
          {{ state.mark }}</n-tag
        >
      </template>
      {{ state.tooltip }}
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
  import { ReviewStatus, CourseTreeInterface } from '@/common/types';
  import { defineComponent, computed, reactive } from 'vue';
  const props = defineProps<{ course: CourseTreeInterface }>();
  interface statusInfo {
    mark: string;
    tagType: string;
    tooltip: string;
  }
  const courseStatus = computed(() => {
    // debugger;
    const statusArray = reactive<statusInfo[]>([]);
    switch (props.course.review) {
      case ReviewStatus.APPLIED:
        statusArray.push({ mark: 'A', tagType: 'warning', tooltip: 'Review: Applied' });
        break;
      case ReviewStatus.REJECTED:
        statusArray.push({ mark: 'R', tagType: 'error', tooltip: 'Review: Rejected' });
        break;
      case ReviewStatus.NONE:
        statusArray.push({ mark: 'N', tagType: 'info', tooltip: 'Review: New' });
        break;
      case ReviewStatus.FINISHED:
        statusArray.push({ mark: 'F', tagType: 'success', tooltip: 'Review: Reviewed' });
        break;
    }
    if (props.course.isModified) {
      statusArray.push({ mark: 'M', tagType: 'warning', tooltip: 'Modified' });
    }
    if (props.course.isPublished) {
      statusArray.push({ mark: 'P', tagType: 'success', tooltip: 'Published' });
    }

    return statusArray;
  });
  //   console.log(course);
</script>
<script lang="ts">
  export default defineComponent({
    name: 'CourseStatus',
  });
</script>

<style scoped></style>
