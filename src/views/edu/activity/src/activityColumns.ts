import { DataTableColumns, NTag } from 'naive-ui';
import { ActivityInterface } from '@/common/types';
import { h } from 'vue';
export const activityColumns: DataTableColumns<ActivityInterface> = [
  { title: 'Title', key: 'title' },
  { title: 'Date', key: 'activityDate', width: 100, align: 'center' },
  { title: 'Author', key: 'authorMemberName', width: 100, align: 'center' },
  //   { title: 'Last Editor', key:'last'}
  {
    title: 'Modified',
    key: 'isModified',
    width: 90,
    align: 'center',
    render(row) {
      return [
        h(NTag, { type: 'info' }, { default: () => (row.isModified ? 'Modified' : 'Intact') }),
      ];
    },
  },
  {
    title: 'Published',
    key: 'isPubished',
    align: 'center',
    render(row) {
      return [
        h(NTag, { type: 'info' }, { default: () => (row.isPublished ? 'Published' : 'Draft') }),
      ];
    },
  },
  {
    title: 'Review',
    key: 'review',
    align: 'center',
    render(row) {
      return [
        h(
          NTag,
          {
            type:
              row.review === 'REJECTED'
                ? 'error'
                : row.review === 'FINISHED'
                ? 'success'
                : row.review === 'APPLIED'
                ? 'warning'
                : 'info',
            // type: getType(row),
          },
          {
            default: () => {
              switch (row.review) {
                case 'NONE':
                  return 'New';
                case 'APPLIED':
                  return 'Applied';
                case 'REJECTED':
                  return 'Rejected';
                case 'FINISHED':
                  return 'Reviewed';
              }
            },
          }
        ),
      ];
    },
  },
];
