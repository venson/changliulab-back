import { MemberInterface, MemberLevel } from '@/common/types';
import { DataTableColumns, NImage, NTag } from 'naive-ui';
import { h } from 'vue';

export const memberColumns: DataTableColumns<MemberInterface> = [
  { title: 'Name', key: 'name', align: 'center' },
  {
    title: 'Avatar',
    key: 'Avatar',
    align: 'center',
    render(row) {
      return [h(NImage, { class: 'w-10 h-10', src: row.avatar })];
    },
  },
  { title: 'Title', key: 'title' },
  {
    title: 'Level',
    key: 'level',
    align: 'center',
    render(row) {
      return [h(NTag, { type: 'info' }, { default: () => MemberLevel[row.level] })];
    },
  },
];
