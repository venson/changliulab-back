import { UserInterface, UserPersonalInterface } from '@/common/types';
import { http } from '@/utils/http/axios';
import menuData from '@/views/acl/menu/src/PermissionData';
import { RolePermissionData } from '@/views/acl/role/src/roleData';
const pUrl = '/auth/admin/permission';
const rUrl = '/auth/admin/role';
const uUrl = '/auth/admin/user';

// permission api
export function getPermissionTree() {
  return http.request({
    url: `${pUrl}`,
    method: 'GET',
  });
}
export function getPermissionsByRoleId(id: string) {
  return http.request({
    url: `${pUrl}/${id}`,
    method: 'GET',
  });
}
export function insertPermission(permission: menuData) {
  return http.request({
    url: `${pUrl}`,
    method: 'POST',
    data: permission,
  });
}
export function updatePermission(permission: menuData) {
  return http.request({
    url: `${pUrl}/${permission.id}`,
    method: 'PUT',
    data: permission,
  });
}

export function removePermissionById(id: string) {
  return http.request({
    url: `${pUrl}/${id}`,
    method: 'DELETE',
  });
}
//  role api
export function getAllRoles() {
  return http.request({
    url: `${rUrl}`,
    method: 'GET',
  });
}
export function getRolePage(page: number, size: number) {
  return http.request({
    url: `${rUrl}/${page}/${size}`,
    method: 'GET',
  });
}
export function getRoleById(id: string) {
  return http.request({
    url: `${rUrl}/${id}`,
    method: 'GET',
  });
}
export function removeRoleById(id: string) {
  return http.request({
    url: `${rUrl}/${id}`,
    method: 'DELETE',
  });
}
export function updateRole(rolePermission: RolePermissionData) {
  return http.request({
    url: `${rUrl}`,
    method: 'PUT',
    data: rolePermission,
  });
}
export function insertRolePermission(rolePermission: RolePermissionData) {
  return http.request({
    url: `${rUrl}`,
    method: 'POST',
    data: rolePermission,
  });
}
// user APi
export function getUserPage(page: number, size: number) {
  return http.request({
    url: `${uUrl}/${page}/${size}`,
    method: 'GET',
  });
}
export function getUserById(id: string) {
  return http.request({
    url: `${uUrl}/${id}`,
    method: 'GET',
  });
}
export function updateUser(user: UserInterface) {
  return http.request({
    url: `${uUrl}/${user.id}`,
    method: 'PUT',
    data: user,
  });
}
export function addUser(user: UserInterface) {
  return http.request({
    url: `${uUrl}`,
    method: 'POST',
    data: user,
  });
}
export function removeUserById(id: string) {
  return http.request({
    url: `${uUrl}/${id}`,
    method: 'DELETE',
  });
}
export function resetUserPassword(id: string) {
  return http.request({
    url: `${uUrl}/personal/${id}`,
    method: 'POST',
  });
}
export function updatePersonalUser(user: UserPersonalInterface) {
  return http.request({
    url: `${uUrl}/personal`,
    method: 'PUT',
    data: user,
  });
}
