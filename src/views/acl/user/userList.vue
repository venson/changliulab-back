<template>
  <n-card>
    <BasicTable :columns="fullColumns" :request="getUser" :row-key="(row: UserInterface) => row.id">
      <template #tableTitle>
        <n-button type="primary" @click="addUser">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新建
        </n-button>
      </template>
    </BasicTable>
    <userMadel v-model:show="userModalFlag" :user="userDetail" :all-roles="allRoles" />
  </n-card>
</template>

<script setup lang="ts">
  import { computed, ref, h, onMounted } from 'vue';
  import { UserInterface } from '@/common/types';
  import { BasicTable } from '@/components/Table';
  import { userColumns } from './src/userColumns';
  import { usePermission } from '@/hooks/web/usePermission';
  import { RoleData } from '@/views/acl/role/src/roleData';
  import userMadel from './src/userModal.vue';
  import { PlusOutlined } from '@vicons/antd';
  import { getAllRoles, getUserById, getUserPage, removeUserById } from '@/api/acl/aclApi';
  import {
    DataTableColumns,
    DataTableColumn,
    NButton,
    NIcon,
    useDialog,
    useMessage,
  } from 'naive-ui';
  import { DeleteFilled, EditFilled } from '@vicons/antd';
  let allRoles = ref<RoleData[]>();
  const dialog = useDialog();
  const message = useMessage();
  const { hasPermission } = usePermission();
  let userDetail = ref<UserInterface>();
  const tableActionFlag = computed(() => hasPermission(['user.add', 'user.edit', 'user.remove']));
  const userModalFlag = ref(false);
  const tableActionColumn: DataTableColumn<UserInterface> = {
    title: 'Actions',
    key: 'action',
    width: '80',
    render(row) {
      return [
        hasPermission(['user.edit'])
          ? h(
              NButton,
              { size: 'small', onClick: () => editUser(row) },
              {
                default: () => h(NIcon, null, { default: () => h(EditFilled) }),
              }
            )
          : null,
        hasPermission(['user.remove'])
          ? h(
              NButton,
              { size: 'small', onClick: () => removeUser(row) },
              {
                default: () =>
                  h(NIcon, null, {
                    default: () => h(DeleteFilled),
                  }),
              }
            )
          : null,
      ];
    },
  };
  const addUser = () => {
    userDetail.value = { username: '', email: '', nickName: '', randomPassword: false };
    userModalFlag.value = true;
  };

  const editUser = (row: UserInterface) => {
    row.id &&
      getUserById(row.id).then((res) => {
        userDetail.value = res;
        userModalFlag.value = true;
      });
  };
  const removeUser = (row: UserInterface) => {
    dialog.warning({
      title: 'Caution',
      content: `确认要删除${row.username}`,
      positiveText: 'Delete',
      negativeText: 'Cancel',
      onPositiveClick: () => {
        row.id &&
          removeUserById(row.id).then((res) => {
            if (res.code === 20000) message.success('User Removed');
          });
      },
    });
  };
  const getUser = async (params) => {
    let res = await getUserPage(params.current, params.size);
    return res;
  };
  const fullColumns = computed(() => {
    let columns: DataTableColumns<UserInterface> = [...userColumns];
    if (tableActionFlag.value) {
      columns.push(tableActionColumn);
    }
    return columns;
  });
  onMounted(() => {
    getAllRoles().then((res) => {
      allRoles.value = res;
    });
  });
</script>

<style scoped></style>
