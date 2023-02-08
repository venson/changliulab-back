<template>
  <n-modal v-model:show="showFlag" preset="dialog" title="Menu">
    <n-form
      ref="formRef"
      :model="menuDetail"
      :rules="menuDetail.level === 3 ? functionRules : menuRules"
      label-placement="left"
      require-mark-placement="right-hanging"
      label-width="auto"
      :style="{
        maxWidth: '640px',
      }"
    >
      <n-grid>
        <n-form-item-gi :span="14" label="Name" path="name">
          <n-input v-model:value="menuDetail.name" placeholder="Name" />
        </n-form-item-gi>

        <n-form-item-gi :span="10" label="Icon" path="icon">
          <n-select
            v-model:value="menuDetail.icon"
            placeholder="Select"
            :options="generalOptions"
            :render-label="renderLabel"
          />
        </n-form-item-gi>
      </n-grid>
      <n-form-item label="Path" path="path">
        <n-input v-model:value="menuDetail.path" placeholder="Path" />
      </n-form-item>
      <n-form-item label="Component" path="component">
        <n-input v-model:value="menuDetail.component" placeholder="Component" />
      </n-form-item>
      <n-form-item label="Permission" path="permissionValue">
        <n-input v-model:value="menuDetail.permissionValue" placeholder="permission" />
      </n-form-item>
      <div class="flex justify-end">
        <n-button round type="primary" @click="confirmButton"> Confirm</n-button>
      </div>
    </n-form>
  </n-modal>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { FormInst, useMessage } from 'naive-ui';
  import { PermissionInterface } from '@/common/types';
  import { insertPermission, updatePermission } from '@/api/acl/aclApi';
  import { constantIcon } from './menuIcon';

  const formRef = ref<FormInst | null>(null);
  const message = useMessage();
  const emit = defineEmits(['update:show', 'save']);
  interface madelProps {
    show: boolean;
    menu: PermissionInterface;
  }
  const showFlag = computed({
    get: () => props.show,
    set: () => emit('update:show', false),
  });
  const menuDetail = computed((): PermissionInterface => {
    console.log(props.menu.level);
    return props.menu;
  });
  const generalOptions = [
    'BookOutline',
    'EyeOutline',
    'ImagesOutline',
    'PeopleOutline',
    'KeyOutline',
    'HatGraduation12Regular',
    'TargetArrow16Regular',
    'BarChartOutline',
    'NewspaperOutline',
    'AirplaneTakeOff16Regular',
  ].map((v) => ({
    label: v,
    value: v,
  }));
  const props = withDefaults(defineProps<madelProps>(), {
    show: false,
    menu: (): PermissionInterface => {
      return {
        name: '',
        path: '',
        component: '',
        icon: '',
        permissionValue: '',
        level: 0,
      };
    },
  });

  const renderLabel = (row) => {
    // return [h(NIcon, null, { default: () => h(BookOutlined) })];
    // return [h(NIcon, null, { default: () => h('div', row.label) })];
    console.log(constantIcon[row.label]);
    console.log(row.label);
    return [constantIcon[row.label]];
  };
  const menuRules = {
    name: {
      required: true,
      trigger: ['blur', 'input'],
      message: 'Please input name',
    },
    // path: {
    //   required: true,
    //   trigger: ['blur', 'input'],
    //   message: 'Please input path',
    // },
    component: {
      required: true,
      trigger: ['blur', 'input'],
      message: 'Please input component',
    },
  };
  const functionRules = {
    name: {
      required: true,
      trigger: ['blur', 'input'],
      message: 'Please input name',
    },
    permissionValue: {
      required: true,
      trigger: ['blur', 'input'],
      message: 'Please input permission',
    },
  };
  const confirmButton = (e: MouseEvent) => {
    e.preventDefault();
    formRef.value?.validate((errors) => {
      if (!errors) {
        // message.success('Valid');
        // console.log(menuDetail);
        if (menuDetail.value.id) {
          updatePermission(menuDetail.value).then(() => {
            // if (res.code === 20000) {
            // console.log(res);
            message.success('Menu updated');
            showFlag.value = false;
            emit('save');
            // }
          });
        } else {
          insertPermission(menuDetail.value).then(() => {
            message.success('Menu added');
            showFlag.value = false;
            emit('save');
          });
        }
      } else {
        console.log(errors);
        message.error('Invalid Input');
      }
    });
  };
</script>
