<template>
  <n-card>
    <BTable :columns="fullColumns" :data-request="pageReview" />
  </n-card>
</template>

<script setup lang="ts">
  import { computed, h } from 'vue';
  // import btable from '@/components/BTable/src/btable.vue';
  import { BTable } from '@/components/BTable';
  // import { reviewColumns } from './src/reviewColumns';
  import { courseColumns } from './src/courseColumns';
  import { usePermission } from '@/hooks/web/usePermission';
  import { DataTableColumn, DataTableColumns, NButton, NIcon } from 'naive-ui';
  import { CourseInterface, CoursePageDTOInterface } from '@/common/types';
  import { EyeFilled, StopFilled } from '@vicons/antd';
  import { useRouter } from 'vue-router';
  import { getPageCourseReview } from '@/api/edu/course';

  const { hasPermission } = usePermission();
  const router = useRouter();

  const tableActionFlag = computed(() =>
    hasPermission(['course.review.reject', 'course.review.pass'])
  );
  const fullColumns = computed(() => {
    let columns: DataTableColumns<CoursePageDTOInterface> = [...courseColumns];
    if (tableActionFlag.value) {
      columns.push(tableActionColumn);
    }
    return columns;
  });
  // const pageReview = async (res) => await getPageCourseReviewList(res.current, res.size);
  const pageReview = async (res) => await getPageCourseReview(res.current, res.size);
  const tableActionColumn: DataTableColumn<CourseInterface> = {
    title: 'Actions',
    key: 'action',
    width: 100,
    align: 'center',
    render(row) {
      return [
        hasPermission(['course.review.pass'])
          ? h(
              NButton,
              { size: 'small', onClick: () => reviewCourse(row) },
              {
                default: () => h(NIcon, null, { default: () => h(EyeFilled) }),
              }
            )
          : null,
        hasPermission(['course.review.reject'])
          ? h(
              NButton,
              { size: 'small', type: 'error', onClick: () => rejectReview(row) },
              {
                default: () => h(NIcon, null, { default: () => h(StopFilled) }),
              }
            )
          : null,
      ];
    },
  };
  const reviewCourse = (row: CourseInterface) => {
    router.push({ path: `review/${row.id}` });
    console.log(row);
  };
  const rejectReview = (row: CourseInterface) => {
    console.log(row);
  };
</script>

<style scoped></style>
