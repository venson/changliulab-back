<template>
  <n-modal v-model:show="showFlag" preset="dialog" title="course">
    <n-form
      class="py-2"
      :modal="courseDetail"
      label-placement="left"
      require-mark-placement="right-hanging"
      label-width="auto"
      size="small"
      :show-feedback="false"
    >
      <n-form-item class="py-1" label="Title" path="title">
        <n-input v-model:value="courseDetail.title" />
      </n-form-item>
      <n-form-item class="py-1" label="Subject" path="">
        <n-cascader
          v-model:value="courseDetail.subjectId"
          expand-trigger="hover"
          check-strategy="child"
          :show-path="true"
          :options="subjects"
          value-field="id"
          label-field="title"
          @update:value="handleUpdate"
        />
      </n-form-item>
      <n-form-item class="py-1" label="member" path="memberId">
        <n-select
          v-model:value="courseDetail.memberId"
          :options="members"
          value-field="id"
          label-field="name"
        />
      </n-form-item>
      <n-form-item class="py-1" label="cover" path="cover">
        <div>
          <n-image class="h-28" :src="courseDetail.cover" />
          <div>
            <ClCropper
              :height="200"
              :width="260"
              v-model:url="courseDetail.cover"
              mode="cover"
              path="cover"
            />
          </div>
        </div>
      </n-form-item>
      <n-form-item class="py-1" label="Hours" path="totalHour">
        <n-input-number v-model:value="courseDetail.totalHour" :step="0.5" />
      </n-form-item>
      <n-form-item class="py-1" label="Public" path="isPublic">
        <n-switch v-model:value="courseDetail.isPublic">
          <template #checked> Free </template>
          <template #unchecked> Register </template>
        </n-switch>
      </n-form-item>
      <n-form-item class="py-1" label="Description" path="description">
        <n-input type="textarea" v-model:value="courseDetail.description" />
      </n-form-item>
      <n-form-item>
        <n-button @click="save">Save</n-button>
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { MemberInterface, CourseInterface } from '@/common/types';
  import { getAllSubject } from '@/api/edu/subject';
  // import { CascaderOption, useMessage } from 'naive-ui';
  import { CascaderOption } from 'naive-ui';
  import { getAllFormalMembers } from '@/api/edu/member';
  import ClCropper from '@/components/ClCropper/src/ClCropper.vue';
  // import { updateCourseInfo } from '@/api/edu/course';
  interface propsInterface {
    show: boolean;
    modelValue: CourseInterface;
  }
  // const message = useMessage();
  const props = withDefaults(defineProps<propsInterface>(), {
    show: false,
    course: () => {
      return {
        title: '',
        cover: '',
      };
    },
  });
  const emit = defineEmits(['update:show', 'update:modelValue', 'save']);
  const showFlag = computed({
    get: () => props.show,
    set: () => emit('update:show', false),
  });
  // const courseDetail = computed(() => props.course);
  const courseDetail = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });
  let subjects = ref();
  getAllSubject().then((res) => {
    subjects.value = res;
  });
  let members = ref<Array<MemberInterface>>();
  getAllFormalMembers().then((res) => {
    members.value = res;
  });
  //   const subjects = ()=>{
  //     getAllSubject()
  //   }
  //   const subject = await getAllSubject();
  const handleUpdate = ({
    pathValues,
  }: {
    value: string;
    option: CascaderOption;
    pathValues: Array<CascaderOption>;
  }) => {
    courseDetail.value.subjectParentId = pathValues[0].id as string;
  };
  onMounted(() => {});
  const save = () => {
    emit('save');
    // updateCourseInfo(courseDetail.value).then(() => {
    // emit('save');
    //   message.success('Course Info updated');
    // });
  };
</script>

<style scoped></style>
