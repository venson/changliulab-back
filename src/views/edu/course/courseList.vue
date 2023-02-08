<template>
  <n-card>
    <div>
      <div class="flex items-center justify-between">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button @click="addCourse">
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </n-button>
          </template>
          Create new Course
        </n-tooltip>
        <div>
          <n-form ref="formRef" inline>
            <n-form-item>
              <n-input v-model:value="condition" placeholder="Filter" />
            </n-form-item>
            <n-form-item>
              <n-button @click="reloadTable">Search</n-button>
            </n-form-item>
          </n-form>
        </div>
      </div>
    </div>
    <BTable ref="courseTable" class="text-xs" :columns="fullColumns" :data-request="pageCourse" />
    <courseInfoModal v-model:show="modalShow" v-model="courseInfo" @save="handleSaveInfo" />
  </n-card>
</template>

<script setup lang="ts">
  import { computed, h, ref } from 'vue';
  import { NIcon, NButton, DataTableColumns, DataTableColumn, useMessage } from 'naive-ui';
  import { CourseInterface, PageParamInterface } from '@/common/types';
  import {
    getPageCourse,
    getCourseById,
    removeCourseById,
    updateCourseInfo,
    addCourseInfo,
  } from '@/api/edu/course';
  import { courseColumns } from './src/courseColumns';
  import courseInfoModal from './src/courseInfoModal.vue';
  import {
    PlusOutlined,
    EditFilled,
    DeleteFilled,
    InfoCircleFilled,
    EyeFilled,
  } from '@vicons/antd';
  import { usePermission } from '@/hooks/web/usePermission';
  import { useRouter } from 'vue-router';
  import { BTable } from '@/components/BTable';
  // const condition = ref<string>('abc');
  const { hasPermission } = usePermission();
  const router = useRouter();
  const message = useMessage();
  const pageCourse = async (res: PageParamInterface) =>
    await getPageCourse(res.current, res.size, condition.value);
  const tableActionFlag = computed(() =>
    hasPermission(['course.edit.info', 'course.edit.content', 'course.remove'])
  );
  const fullColumns = computed(() => {
    let columns: DataTableColumns<CourseInterface> = [...courseColumns];
    if (tableActionFlag.value) {
      columns.push(tableActionColumn);
    }
    return columns;
  });
  const modalShow = ref(false);
  let courseInfo = ref<CourseInterface>({ title: '' });
  const condition = ref('');
  const courseTable = ref();
  const reloadTable = () => courseTable.value.reload(condition.value);
  // const reloadTable = ()=> console.log(courseTable.value);
  const tableActionColumn: DataTableColumn<CourseInterface> = {
    title: 'Actions',
    key: 'action',
    width: 200,
    render(row) {
      return [
        hasPermission(['course.edit.info'])
          ? h(
              NButton,
              { size: 'small', onClick: () => editInfo(row) },
              {
                default: () => h(NIcon, null, { default: () => h(InfoCircleFilled) }),
              }
            )
          : null,
        hasPermission(['course.edit.content'])
          ? h(
              NButton,
              { size: 'small', onClick: () => editContent(row) },
              {
                default: () => h(NIcon, null, { default: () => h(EditFilled) }),
              }
            )
          : null,
        hasPermission(['course.edit.preview'])
          ? h(
              NButton,
              { size: 'small', onClick: () => previewCourse(row) },
              {
                default: () => h(NIcon, null, { default: () => h(EyeFilled) }),
              }
            )
          : null,
        hasPermission(['course.remove'])
          ? h(
              NButton,
              { size: 'small', onClick: () => removeCourse(row) },
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
  const addCourse = () => {
    courseInfo.value = { title: '' };
    modalShow.value = true;
    console.log('add course');
  };
  // const test = ref({ title: 'erqiwer', cover: 'sdfoiqwer' });
  const editInfo = (row: CourseInterface) => {
    getCourseById(row.id!).then((res) => {
      // console.log(res);
      courseInfo.value = res;
      modalShow.value = true;
      // courseInfo = test;
    });

    console.log('edit info');
  };
  const editContent = (row: CourseInterface) => {
    router.push({ path: `content/${row.id}` });
    // router.push({ name: 'name_1195351566221938690', params: { id: '14' } });
  };
  const previewCourse = (row: CourseInterface) => {
    router.push({ path: `preview/${row.id}` });
  };
  const removeCourse = (row: CourseInterface) => {
    row.id && removeCourseById(row.id);
  };
  const handleSaveInfo = () => {
    if (courseInfo.value.id) {
      updateCourseInfo(courseInfo.value).then(() => {
        message.success(`Course ${courseInfo.value.title} Info updated`);
      });
    } else {
      addCourseInfo(courseInfo.value).then((res) => {
        courseInfo.value.id = res;
      });
    }
  };
</script>

<style scoped></style>
