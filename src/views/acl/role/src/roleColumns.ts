import { DataTableColumns } from 'naive-ui';
import { RoleData } from './roleData';
export const basicColumns: DataTableColumns<RoleData> = [
  {
    title: 'name',
    key: 'roleName',
    width: 120,
  },
  {
    title: 'Code',
    key: 'roleCode',
    width: 80,
  },
  {
    title: 'remark',
    key: 'remark',
    width: 100,
  },
];
