import { h } from 'vue';
import { DataTableColumns, NTag } from 'naive-ui';
import { LanguageEnum, MethodologyInterface } from '@/common/types';

export const methodologyColumns: DataTableColumns<MethodologyInterface> = [
  {
    title: '名称',
    key: 'title',
    width: 100,
  },
  {
    title: '语言',
    key: 'language',
    width: 40,
    align: 'center',
    render(row) {
      return h(
        NTag,
        {
          type: 'info',
        },
        {
          default: () => (row.language === LanguageEnum.ENGLISH ? 'En' : 'Zh'),
        }
      );
    },
  },
  {
    title: 'review',
    key: 'status',
    align: 'center',
    width: 100,
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
  {
    title: '发布',
    key: 'isPublished',
    width: 70,
    align: 'center',
    render(row) {
      return h(
        NTag,
        {
          type: 'info',
        },
        {
          default: () => (row.isPublished ? '已发布' : '未发布'),
        }
      );
    },
  },
  {
    title: '修改',
    key: 'isModified',
    width: 80,
    align: 'center',
    render(row) {
      return h(
        NTag,
        {
          type: 'info',
        },
        {
          default: () => (row.isModified ? '已修改' : '未修改'),
        }
      );
    },
  },
];
