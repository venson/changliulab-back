<template>
  <n-card>
    <div class="max-w-md">
      <n-form
        label-placement="left"
        label-width="auto"
        ref="formRef"
        :model="personal"
        :rules="rules"
      >
        <n-form-item label="Username">
          <div>{{ userInfo.username }}</div>
          <!-- <n-input v-model:value="userInfo.username" /> -->
        </n-form-item>
        <n-form-item label="Nick Name">
          <div class="flex flex-col">
            <div>
              <span>{{ userInfo.nickName }}</span>
              <n-button class="px-2" text @click="editNickname">
                <n-icon> <EditOutlined /> </n-icon>
              </n-button>
            </div>
            <n-form-item v-show="editNicknameFlag" path="nickname">
              <div>
                <n-input
                  :input-props="{ autocomplete: 'nickname' }"
                  v-model:value="personal.nickname"
                />
              </div>
            </n-form-item>
          </div>
        </n-form-item>
        <n-form-item label="E-mail">
          <span>{{ userInfo.email }}</span>
          <n-button class="px-2" text @click="editEmail">
            <n-icon> <EditOutlined /> </n-icon>
          </n-button>
          <div>
            <n-input
              :input-props="{ autocomplete: 'email' }"
              v-show="editEmailFlag"
              v-model:value="personal.email"
            />
          </div>
        </n-form-item>
        <n-form-item label="Password" path="old">
          <n-input
            type="password"
            :input-props="{ autocomplete: 'current-password' }"
            show-password-on="click"
            placeholder="password"
            v-model:value="personal.old"
          />
        </n-form-item>
        <n-form-item label="New Password" path="altered">
          <n-input
            type="password"
            :input-props="{ autocomplete: 'new-password' }"
            show-password-on="click"
            placeholder="New password(Edit if needed)"
            v-model:value="personal.altered"
          />
        </n-form-item>
        <n-form-item label="Retype">
          <n-input
            type="password"
            :input-props="{ autocomplete: 'new-password' }"
            show-password-on="click"
            placeholder="Retype password(Edit if needed)"
            v-model:value="retype"
          />
        </n-form-item>
      </n-form>
      <n-button @click="save">Save</n-button>
    </div>
  </n-card>
</template>

<script setup lang="ts">
  import { FormRules, NCard, NForm, FormItemRule } from 'naive-ui';
  import { onMounted, ref } from 'vue';
  import { EditOutlined } from '@vicons/antd';
  import { UserInterface, UserPersonalInterface } from '@/common/types';
  import { useUserStore } from '@/store/modules/user';
  import { getUserById } from '@/api/acl/aclApi';
  const userInfo = ref<UserInterface>({ username: '', email: '' });
  const retype = ref('');
  const editNicknameFlag = ref(false);
  const editEmailFlag = ref(false);
  const user = useUserStore();
  const editEmail = () => {
    editEmailFlag.value = !editEmailFlag.value;
    // if (editEmailFlag.value === false) {
    personal.value.email = null;
    // } else {
    // personal.value.email = '';
    // }
  };
  const editNickname = () => {
    editNicknameFlag.value = !editNicknameFlag.value;
    personal.value.nickname = null;
  };
  const personal = ref<UserPersonalInterface>({
    old: '',
    email: null,
    nickname: null,
    altered: null,
  });
  const nicknameReg = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
  const emailReg =
    /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/;
  const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/;
  const rules: FormRules = {
    nickname: [
      {
        validator(_rule: FormItemRule, value: string) {
          console.log('value', value);
          if (!value || (value && nicknameReg.test(value))) {
            return true;
          }
          return false;
        },
        trigger: ['input', 'blur'],
        message:
          '8-20 characters, numbers and letters are allowed, underscore can not be the beginning or ending character',
      },
    ],
    email: [
      {
        validator(_rule: FormItemRule, value: string) {
          if (!value || (value && emailReg.test(value))) {
            return true;
          }
          return false;
        },
        trigger: ['input', 'blur'],
        message: 'Valid Email address',
      },
    ],
    old: [
      {
        required: true,
        message:
          'inimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
      },
    ],
    altered: [
      {
        validator(_rule: FormItemRule, value: string) {
          if (!value || (value && passwordReg.test(value))) {
            return true;
          }
          return false;
        },
        trigger: ['input', 'blur'],
        message:
          'Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
      },
    ],
  };
  onMounted(() => {
    getUserById(user.id).then((res) => (userInfo.value = res));
  });
  const save = () => {
    console.log(personal);
  };
</script>

<style scoped></style>
