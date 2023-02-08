export interface RoleData {
  id?: string;
  roleName: string;
  roleCode: string;
  remark?: string;
}
export interface RolePermissionData extends RoleData {
  permissionIds?: string[];
  permissionChanged?: boolean;
}
