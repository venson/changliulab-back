<template>
  <n-card>
    <n-table :columns="fullColumns" />
    <BasicTable
      :columns="fullColumns"
      :request="tableRequest"
      :row-key="(row:RoleData) => row.id"
    />
    <roleModal
      v-model:show="roleModalFlag"
      :role="role"
      :permissions="permissions"
      :permission-ids="permissionIds"
    />
  </n-card>
</template>

<script setup lang="ts">
  import { RoleData } from './src/roleData';
  import { computed, h, ref } from 'vue';
  import { usePermission } from '@/hooks/web/usePermission';
  import { NIcon, NButton, DataTableColumns, DataTableColumn } from 'naive-ui';
  import { EditFilled, PlusCircleFilled, DeleteFilled } from '@vicons/antd';
  import { useDialog, useMessage } from 'naive-ui';
  import { basicColumns } from './src/roleColumns';
  import { BasicTable } from '@/components/Table';
  import {
    getPermissionsByRoleId,
    getPermissionTree,
    getRolePage,
    removePermissionById,
  } from '@/api/acl/aclApi';
  import roleModal from './src/roleModal.vue';
  import PermissionData from '../menu/src/PermissionData';
  const roleModalFlag = ref(false);
  const role = ref<RoleData>();
  let permissions = ref<PermissionData[]>([{ name: '' }]);
  const permissionIds = ref<string[]>([]);
  const dialog = useDialog();
  const message = useMessage();
  const { hasPermission } = usePermission();
  const tableActionFlag = computed(() => hasPermission(['role.add', 'role.edit', 'role.remove']));
  const tableActionColumn: DataTableColumn<RoleData> = {
    title: 'actions',
    key: 'action',
    width: '80',
    render(row) {
      return [
        hasPermission(['role.edit'])
          ? h(
              NButton,
              { size: 'small', onClick: () => editRole(row) },
              {
                default: () => h(NIcon, null, { default: () => h(EditFilled) }),
              }
            )
          : null,
        hasPermission(['role.remove'])
          ? h(
              NButton,
              { size: 'small', color: 'red', onClick: () => removeRole(row) },
              {
                default: () => h(NIcon, null, { default: () => h(DeleteFilled) }),
              }
            )
          : null,
      ];
    },
  };
  const fullColumns = computed(() => {
    let columns: DataTableColumns<RoleData> = [...basicColumns];
    if (tableActionFlag.value) {
      columns.push(tableActionColumn);
    }
    return columns;
  });
  const tableRequest = async (res) => {
    let response = await getRolePage(res.current, res.size);
    return response;
  };
  getPermissionTree().then((res) => {
    permissions.value = res;
  });

  const editRole = (row: RoleData) => {
    row.id &&
      getPermissionsByRoleId(row.id).then((res) => {
        permissionIds.value = res;
        // permissionIds.value = [
        //   //   '1',
        //   '1544144710045777921',
        //   '1544145153702477826',
        //   '1544145433848430594',
        // ];
        // getPermissionIds(permissions.value, permissionIds.value);
        role.value = row;
        roleModalFlag.value = true;
      });
  };
  const removeRole = (row: RoleData) => {
    dialog.warning({
      title: 'Caution',
      content: `确定要删除${row.roleName}`,
      positiveText: 'Delete',
      negativeText: 'Cancel',
      onPositiveClick: () => {
        row.id &&
          removePermissionById(row.id).then((res) => {
            if (res.code === 20000) message.success('Role removed');
          });
      },
    });
  };
</script>

<style scoped></style>
