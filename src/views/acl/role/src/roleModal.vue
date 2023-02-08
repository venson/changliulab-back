<template>
  <n-modal v-model:show="showFlag" preset="dialog" title="Role">
    <n-form
      ref="formRef"
      :modal="roleDetail"
      label-placement="left"
      require-mark-placement="right-hanging"
      label-width="auto"
    >
      <n-form-item label="Name" path="roleName">
        <n-input v-model:value="roleDetail.roleName" />
      </n-form-item>
      <n-form-item label="Code" path="rolePath">
        <n-input v-model:value="roleDetail.roleCode" />
      </n-form-item>
      <n-form-item label="Remark" path="remark">
        <n-input v-model:value="roleDetail.remark" />
      </n-form-item>
      <div class="overflow-auto h-80">
        <n-data-table
          :data="permissions"
          :columns="columns"
          :row-key="(row: PermissionData) => row.id"
          :default-checked-row-keys="permissionIdsDetail"
          :default-expanded-row-keys="permissionIdsDetail"
          :on-update:checked-row-keys="handleCheck"
        />
      </div>
      <div class="flex justify-end">
        <n-button round type="primary" @click="confirmButton">Confirm</n-button>
      </div>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { RoleData, RolePermissionData } from './roleData';
  import { updateRole } from '@/api/acl/aclApi';
  import { columns } from './permissionColumns';
  import PermissionData from '../../menu/src/PermissionData';
  const formRef = ref();
  const emit = defineEmits(['update:show']);
  interface madelProps {
    show: boolean;
    role: RoleData;
    permissions: PermissionData[];
    permissionIds?: string[];
  }
  const showFlag = computed({
    get: () => props.show,
    set: () => emit('update:show', false),
  });
  const roleDetail = computed((): RolePermissionData => props.role);
  const permissionIdsDetail = computed((): string[] => props.permissionIds);
  const props = withDefaults(defineProps<madelProps>(), {
    show: false,
    role: () => {
      return { roleName: '', roleCode: '' };
    },
    permissions: () => {
      return [{ name: '' }];
    },
    permissionIds: () => {
      return [];
    },
  });
  const confirmButton = (e: MouseEvent) => {
    // console.log(e);
    e.preventDefault;
    formRef.value?.validate((errors: any) => {
      if (!errors) {
      }
      console.log(errors);
    });
    console.log(roleDetail.value);
    updateRole(roleDetail.value);
  };
  const handleCheck = (keys: Array<string>) => {
    roleDetail.value.permissionIds = keys;
    roleDetail.value.permissionChanged = true;
    // console.log(keys);
  };
</script>

<style scoped></style>
