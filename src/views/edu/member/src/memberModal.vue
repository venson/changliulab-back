<template>
  <n-modal v-model:show="showFlag" preset="dialog" title="Member">
    <n-form
      ref="formRef"
      :model="memberDetail"
      label-placement="left"
      require-mark-placement="right-hanging"
      label-width="auto"
      :rules="rules"
    >
      <n-form-item label="Name" path="name">
        <n-input v-model:value="memberDetail.name" />
      </n-form-item>
      <n-form-item label="Title">
        <n-input v-model:value="memberDetail.title" />
      </n-form-item>
      <n-form-item label="Intro">
        <n-input v-model:value="memberDetail.intro" />
      </n-form-item>
      <n-form-item label="Career">
        <n-input v-model:value="memberDetail.career" />
      </n-form-item>
      <n-form-item label="Level">
        <n-select v-model:value="memberDetail.level" :options="options" />
        <!-- <n-input v-model:value="memberDetail.career" /> -->
      </n-form-item>
      <n-form-item label="Avatar">
        <div>
          <n-image v-show="memberDetail.avatar" :src="memberDetail.avatar" class="w-20 h-20" />
          <ClCropper v-model:url="memberDetail.avatar" mode="cover" path="avatar" />
        </div>
      </n-form-item>
      <div>
        <n-button class="float-right" type="success" :disabled="buttonDisabled" @click="saveMember"
          >Save</n-button
        >
      </div>
      <!-- <n-form-item> </n-form-item> -->
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
  import { addMember, updateMember } from '@/api/edu/member';
  import { MemberInterface, MemberLevel } from '@/common/types';
  import { ClCropper } from '@/components/ClCropper';
  import { FormValidationError, useMessage } from 'naive-ui';
  import { computed, ref } from 'vue';
  const message = useMessage();
  const buttonDisabled = ref(false);
  const emit = defineEmits(['update:show']);
  const formRef = ref();
  interface PropsInterface {
    show: boolean;
    member: MemberInterface;
  }
  const props = withDefaults(defineProps<PropsInterface>(), {
    show: false,
    member: () => {
      return { name: '', level: MemberLevel.INTERN };
    },
  });
  const showFlag = computed({
    set: () => {
      formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
        if (!errors || !memberDetail.value.id) {
          emit('update:show', false);
        }
      });
      // if (formRef.value.validate) emit('update:show', false);
    },
    get: () => props.show,
  });
  const memberDetail = computed(() => props.member);
  const options = [
    {
      label: MemberLevel.INTERN,
      value: 'INTERN',
    },
    {
      label: MemberLevel.FORMER_MEMBER,
      value: 'FORMER_MEMBER',
    },
    {
      label: MemberLevel.CURRENT_MEMBER,
      value: 'CURRENT_MEMBER',
    },
    {
      label: MemberLevel.TECH,
      value: 'TECH',
    },
    {
      label: MemberLevel.PI,
      value: 'PI',
    },
  ];
  const rules = {
    name: {
      required: true,
      message: 'Name can not be empty',
      trigger: 'blur',
    },
  };
  const saveMember = () => {
    formRef.value.validate((error: Array<FormValidationError> | undefined) => {
      if (!error) {
        buttonDisabled.value = true;
        if (memberDetail.value.id) {
          updateMember(memberDetail.value.id, memberDetail.value).then(() => {
            message.success('Member ' + memberDetail.value.name + ' updated');
          });
        } else {
          addMember(memberDetail.value).then(() => {
            message.success('New Member Added');
          });
        }
        setTimeout(() => (buttonDisabled.value = false), 1000);
        // buttonDisabled.value = false;
      }
    });
  };
</script>

<style scoped></style>
