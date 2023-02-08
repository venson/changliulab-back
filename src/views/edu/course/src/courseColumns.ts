import { CoursePageDTOInterface, ReviewStatus } from '@/common/types';
import { DataTableColumns, NTag, NTooltip } from 'naive-ui';
import { h } from 'vue';

export const courseColumns: DataTableColumns<CoursePageDTOInterface> = [
  {
    title: 'Title',
    key: 'title',
  },
  {
    title: 'Hour',
    key: 'totalHour',
    align: 'center',
  },
  {
    title: 'Modified',
    key: 'isModified',
    align: 'center',
    render(row) {
      return [
        h(NTag, { type: 'info' }, { default: () => (row.isModified ? 'Modified' : 'Intact') }),
      ];
    },
  },
  {
    title: 'Public',
    key: 'isPublic',
    align: 'center',
    render(row) {
      return [h(NTag, { type: 'info' }, { default: () => (row.isPublic ? 'Public' : 'Register') })];
    },
  },
  {
    title: 'Review',
    key: 'review',
    align: 'center',
    render(row: CoursePageDTOInterface) {
      return [
        h(
          NTooltip,
          { trigger: 'hover' },
          {
            default: () => getMessage(row.infoReview, 'Course info '),
            trigger: () =>
              h(
                NTag,
                {
                  type: getType(row.infoReview),
                  class: 'mx-1',
                },
                {
                  default: () => getTag(row.infoReview, 'C'),
                }
              ),
          }
        ),
        h(
          NTooltip,
          { trigger: 'hover' },
          {
            default: () => getMessage(row.chapterReview, 'Chapter '),
            trigger: () =>
              h(
                NTag,
                {
                  type: getType(row.chapterReview),
                  class: 'mx-1',
                },
                {
                  default: () => getTag(row.chapterReview, 'c'),
                }
              ),
          }
        ),
        h(
          NTooltip,
          { trigger: 'hover' },
          {
            default: () => getMessage(row.sectionReview, 'Section '),
            trigger: () =>
              h(
                NTag,
                {
                  type: getType(row.sectionReview),
                  class: 'mx-1',
                },
                {
                  default: () => getTag(row.sectionReview, 'S'),
                }
              ),
          }
        ),
      ];
    },
  },
];
// const getType = (review: ReviewStatus) =>
//   review === ReviewStatus.REJECTED
//     ? 'error'
//     : review === ReviewStatus.FINISHED
//     ? 'success'
//     : review === ReviewStatus.APPLIED
//     ? 'warning'
//     : 'info';
const getType = (review: ReviewStatus) => {
  switch (review) {
    case ReviewStatus.NONE:
      return 'info';
    case ReviewStatus.APPLIED:
      return 'warning';
    case ReviewStatus.REJECTED:
      return 'error';
    case ReviewStatus.FINISHED:
      return 'success';
    default:
      return 'default';
  }
};
const getMessage = (review: ReviewStatus, prefix: string) => {
  let status: string;
  switch (review) {
    case ReviewStatus.NONE:
      status = 'New';
      break;
    case ReviewStatus.APPLIED:
      status = 'Applied';
      break;
    case ReviewStatus.REJECTED:
      status = 'Rejected';
      break;
    case ReviewStatus.FINISHED:
      status = 'Reviewed';
    default:
      status = 'Not exist';
  }
  return prefix + status;
};
const getTag = (review: ReviewStatus, prefix: string) => {
  let status: string;
  switch (review) {
    case ReviewStatus.NONE:
      status = 'N';
      break;
    case ReviewStatus.APPLIED:
      status = 'A';
      break;
    case ReviewStatus.REJECTED:
      status = 'R';
      break;
    case ReviewStatus.FINISHED:
      status = 'r';
      break;
    default:
      status = 'X';
  }
  return prefix + status;
};

// const getType = (row: CourseInterface): string => {
//   switch (row.review) {
//     case 'APPLIED':
//       return 'warning';
//     case 'REJECTED':
//       return 'error';
//     case 'FINISHED':
//       return 'success';
//     default:
//       return 'info';
//   }
// };
