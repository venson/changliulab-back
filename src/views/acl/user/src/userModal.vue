<template>
  <n-modal v-model:show="showFlag" preset="dialog" title="User">
    <n-form
      ref="formRef"
      :modal="userDetail"
      label-placement="left"
      require-mark-placement="right-hanging"
      label-width="auto"
    >
      <n-form-item label="Name" path="username">
        <n-input v-model:value="userDetail.username" />
      </n-form-item>
      <n-form-item label="Email" path="email">
        <n-input v-model:value="userDetail.email" />
      </n-form-item>
      <n-form-item label="Nick Name" path="nickName">
        <n-input v-model:value="userDetail.nickName" />
      </n-form-item>
      <n-form-item label="Roles ">
        <n-checkbox-group :default-value="userDetail.roleIds" :on-update:value="handleCheck">
          <n-checkbox
            v-for="(role, index) in allRoles"
            :key="index"
            :value="role.id"
            :label="role.roleName"
          />
        </n-checkbox-group>
      </n-form-item>
      <div class="flex justify-between">
        <n-button v-if="userDetail.id" round type="error" @click="resetPasswordButton"
          >Reset Password</n-button
        >
        <n-button round type="primary" @click="confirmButton">Confirm</n-button>
      </div>
      <div v-if="!userDetail.id" class="text-red-500"
        >Random password will be sent to the Email address after confirm. Please change password as
        soon as possible.</div
      >
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { userInterface } from './userInterface';
  import { RoleData } from '@/views/acl/role/src/roleData';
  import { useDialog, useMessage } from 'naive-ui';
  import { addUser, resetUserPassword, updateUser } from '@/api/acl/aclApi';
  const formRef = ref();
  const emit = defineEmits(['update:show']);
  const dialog = useDialog();
  const message = useMessage();
  interface madelProps {
    show: boolean;
    user: userInterface;
    allRoles: RoleData[];
  }
  const props = withDefaults(defineProps<madelProps>(), {
    show: false,
    user: () => {
      return { username: '', email: '', nickName: '', randomPassword: false };
    },
    allRoles: () => {
      return [{ roleName: '', roleCode: '' }];
    },
  });
  const showFlag = computed({
    get: () => props.show,
    set: () => emit('update:show', false),
  });
  const userDetail = computed(() => props.user);
  const handleCheck = (value: string[]) => {
    console.log(value);
  };
  const resetPasswordButton = () => {
    dialog.error({
      title: 'Caution',
      content: `确定要重置用户${userDetail.value.username}的密码`,
      positiveText: 'Confirm',
      negativeText: 'Cancel',
      onPositiveClick: () => {
        userDetail.value.id &&
          resetUserPassword(userDetail.value.id).then(() => {
            message.success('Password has been reset');
          });
      },
    });
  };
  const confirmButton = () => {
    if (userDetail.value.id) {
      updateUser(userDetail.value).then(() => {
        message.success('User updated');
      });
    } else {
      addUser(userDetail.value).then(() => {
        message.success('User added');
      });
    }
  };
</script>

<style scoped></style>
