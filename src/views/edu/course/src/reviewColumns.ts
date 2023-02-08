import { CourseInterface } from '@/common/types';
// import { DataTableColumns, NTag } from 'naive-ui';
import { DataTableColumns } from 'naive-ui';
// import { h } from 'vue';

export const reviewColumns: DataTableColumns<CourseInterface> = [
  {
    title: 'Title',
    key: 'title',
  },
];
