<template>
  <KeepAlive>
    <n-card ref="cardRef" :bordered="false" class="proCard">
      <n-data-table
        ref="tableRef"
        class="text-xs"
        :columns="fullColumns"
        :single-line="false"
        :data="menus"
        :row-key="rowKey"
        :loading="loading"
        :max-height="600"
        :scroll-x="1000"
      />
      <menuModal v-model:show="menuModalShow" :menu="menu" @save="fetchData" />
    </n-card>
  </KeepAlive>
</template>

<script lang="ts" setup>
  import { EditFilled, PlusCircleFilled, DeleteFilled } from '@vicons/antd';
  import { computed, h, onMounted, ref } from 'vue';
  import { basicColumns } from './src/menuColumns';
  import { usePermission } from '@/hooks/web/usePermission';
  import { PermissionInterface } from '@/common/types';
  import { NIcon, NButton, DataTableColumns, DataTableColumn } from 'naive-ui';
  import { useDialog, useMessage } from 'naive-ui';
  import { getPermissionTree, removePermissionById } from '@/api/acl/aclApi';
  import menuModal from './src/menuModal.vue';
  const tableRef = ref();
  const cardRef = ref();

  const message = useMessage();
  const dialog = useDialog();
  const menu = ref<PermissionInterface>();
  const menus = ref([]);
  const menuModalShow = ref(false);
  const loading = ref(true);
  const { hasPermission } = usePermission();
  const rowKey = (row: PermissionInterface) => row.id;
  const tableActionFlag = computed(() =>
    hasPermission(['permission.add', 'permission.edit', 'permission.remove'])
  );
  const tableActionColumn: DataTableColumn<PermissionInterface> = {
    title: 'actions',
    key: 'actions',
    fixed: 'right',
    resizable: true,
    width: 80,
    minWidth: 80,
    maxWidth: 80,
    render(row) {
      return [
        row.level && row.level !== 3 && hasPermission(['permission.add'])
          ? h(
              NButton,
              {
                // disabled: !hasPermission(['permission.add']),
                size: 'small',
                onClick: () => row.id && addMenu(row),
              },
              { default: () => h(NIcon, null, { default: () => h(PlusCircleFilled) }) }
            )
          : null,
        hasPermission(['permission.edit'])
          ? h(
              NButton,
              {
                size: 'small',
                onClick: () => editMenu(row),
              },
              { default: () => h(NIcon, null, { default: () => h(EditFilled) }) }
            )
          : null,
        hasPermission(['permission.remove'])
          ? h(
              NButton,
              {
                // disabled: !hasPermission(['permission.remove']),
                size: 'small',
                onClick: () => row.id && removeMenu(row),
              },
              { default: () => h(NIcon, null, { default: () => h(DeleteFilled) }) }
            )
          : null,
      ];
    },
  };

  const fullColumns = computed(() => {
    let columns: DataTableColumns<PermissionInterface> = [...basicColumns];
    if (tableActionFlag.value) {
      columns.push(tableActionColumn);
    }
    return columns;
  });
  const addMenu = (row: PermissionInterface) => {
    console.log(row);
    // let newMenu = {
    //   name: '',
    //   pid: id,
    //   level: ro,
    // };
    menu.value = { name: '', pid: row.id, level: row.level + 1 };
    console.log(menu);
    menuModalShow.value = true;
  };
  const editMenu = (row: PermissionInterface) => {
    menu.value = row;
    menuModalShow.value = true;
  };
  const removeMenu = (permission: PermissionInterface) => {
    dialog.info({
      title: '提示',
      content: `您想删除${permission.name}`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        permission.id &&
          removePermissionById(permission.id).then(() => {
            message.success('删除成功');
            fetchData();
          });
      },
      onNegativeClick: () => {},
    });
  };
  const fetchData = () => {
    getPermissionTree().then((res) => {
      menus.value = res;
      loading.value = false;
    });
  };
  onMounted(() => {
    fetchData();
  });
</script>
<style lang="scss" scoped></style>
