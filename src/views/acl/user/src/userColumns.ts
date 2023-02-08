import { DataTableColumns, NTag } from 'naive-ui';
import { h } from 'vue';
import { userInterface } from './userInterface';

export const userColumns: DataTableColumns<userInterface> = [
  { title: 'Name', key: 'username', width: 120 },
  { title: 'Email', key: 'email', width: 120 },
  {
    title: 'status',
    key: 'randomPassword',
    width: 50,
    render(row) {
      return [
        h(NTag, { type: 'info' }, { default: () => (row.randomPassword ? '需修改' : '正常') }),
      ];
    },
  },
];
