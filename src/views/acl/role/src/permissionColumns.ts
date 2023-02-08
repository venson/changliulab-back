import { DataTableColumns } from 'naive-ui';
import PermissionData from '@/views/acl/menu/src/PermissionData';
export const columns: DataTableColumns<PermissionData> = [
  {
    type: 'selection',
    width: 20,
    maxWidth: 2,
  },
  {
    title: 'name',
    key: 'name',
    width: 120,
  },
];
