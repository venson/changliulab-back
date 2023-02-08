import { DataTableColumns } from 'naive-ui';
import menuData from './PermissionData';
export const basicColumns: DataTableColumns<menuData> = [
  {
    title: 'name',
    key: 'name',
    fixed: 'left',
    width: 120,
  },
  {
    title: 'path',
    key: 'path',
    width: 80,
  },
  {
    title: 'component',
    key: 'component',
    width: 100,
  },
  {
    title: 'permission',
    key: 'permissionValue',
    width: 100,
  },
];
