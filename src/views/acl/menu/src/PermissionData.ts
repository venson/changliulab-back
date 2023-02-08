export default interface PermissionData {
  id?: string;
  name: string;
  path?: string;
  permissionValue?: string;
  icon?: string;
  pid?: string;
  level?: number | null;
  select?: boolean;
  component?: string;
  children?: PermissionData[];
}
