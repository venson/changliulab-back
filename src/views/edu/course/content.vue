<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <n-card>
    <div class="flex flex-row border-collapse border border-solid border-gray-200">
      <div
        class="w-56 h-[calc(100vh-160px)] overflow-auto shrink-0 border-solid border border-gray-200 p-2"
      >
        <CourseTree
          :courseTree="tree"
          mode="edit"
          :selectId="content.id"
          @add="addContent"
          @edit="editContent"
          @remove="removeContent"
        />
      </div>
      <div
        class="w-full h-[calc(100vh-160px)] overflow-auto border border-solid border-gray-200 p-2"
      >
        <div v-show="!content.type" class="text-2xl font-semibold"
          >Please choose from the menu, then edit the content.
        </div>
        <n-form label-placement="left" label-width="auto" v-show="content.type">
          <n-grid responsive="self" :item-responsive="true">
            <n-form-item-gi :span="15" label="标题">
              <n-input v-model:value="content.title" />
            </n-form-item-gi>
            <n-form-item-gi :span="9" label="排序">
              <n-input-number v-model:value="content.sort" />
            </n-form-item-gi>
            <n-form-item-gi
              :span="content.type === CourseContentType.SECTION ? 24 : 0"
              label="视频"
            >
              <n-input v-model:value="content.videoLink" />
            </n-form-item-gi>
            <n-form-item-gi
              :span="24"
              v-if="content.type === CourseContentType.CHAPTER"
              label="简介"
            >
              <n-input v-model:value="content.description" type="textarea" />
            </n-form-item-gi>
          </n-grid>
          <div class="float-right" v-show="content.type === CourseContentType.CHAPTER">
            <n-button size="small" class="mt-1 w-24" @click="saveHtml" type="success"
              >Save</n-button
            >
          </div>
          <!-- <n-form-item v-if="content.type === ContentType.SECTION" label="VideoLink">
            <n-input v-model:value="content.videoLink" />
          </n-form-item> -->
          <MdEditor
            v-show="CourseContentType.SECTION === content.type"
            v-model="content.markdown"
            :edit-enable="content.id !== undefined"
            :path="`course/${courseId}/${content.chapterId}`"
            @html="saveHtml"
          />
        </n-form>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
  import { addChapter, getChapterById, removeChapter, updateChapter } from '@/api/edu/chapter';
  import { getCourseTreeById } from '@/api/edu/content';
  import { addSection, getSectionById, removeSection, updateSection } from '@/api/edu/section';
  import { CourseTree } from '@/components/CourseTree';
  import { ContentInterface, CourseContentType, CourseTreeInterface } from '@/common/types';
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useMessage } from 'naive-ui';
  import MdEditor from '@/components/MdEditor/src/MdEditor.vue';
  const message = useMessage();
  let tree = ref<CourseTreeInterface[]>([]);
  const route = useRoute();
  const courseId = route.params.id as string;
  const content = ref<ContentInterface>({ courseId: courseId, markdown: 'No Conent' });
  const fetchData = () => {
    getCourseTreeById(courseId).then((res) => {
      tree.value = res;
    });
  };
  onMounted(() => {
    fetchData();
  });
  const addContent = (row: CourseTreeInterface, type: CourseContentType) => {
    if (type === CourseContentType.CHAPTER) {
      content.value = {
        type: type,
        title: 'Please Edit',
        description: 'Please Edit',
        courseId: courseId,
      };
    } else {
      content.value = {
        type: type,
        title: 'Please Edit',
        description: 'Please Edit',
        courseId: courseId,
        chapterId: row.id,
      };
    }
  };
  const editContent = (row: CourseTreeInterface, type: CourseContentType) => {
    // console.log(row, type);
    if (type === CourseContentType.CHAPTER) {
      getChapterById(row.id).then((res) => {
        // console.log('get chapter', res);
        content.value = res;
        content.value.type = CourseContentType.CHAPTER;
        content.value.markdown = 'loading';
      });
    } else {
      console.log('get Section');
      // content.value.markdown = 'Loading';
      getSectionById(row.id).then((res) => {
        content.value = res;
        content.value.type = CourseContentType.SECTION;
      });
    }
  };
  const removeContent = (row: CourseTreeInterface, type: CourseContentType) => {
    if (type === CourseContentType.CHAPTER) {
      removeChapter(row.id).then(() => {
        message.success('chapter removed');
        fetchData();
      });
    } else {
      removeSection(row.id).then(() => {
        message.success('Section removed');
        fetchData();
      });
    }
  };
  const saveHtml = (value: object) => {
    const { id, title, markdown, description, sort, courseId, chapterId } = content.value;
    if (content.value.type === CourseContentType.CHAPTER) {
      const chapter = { id, courseId, description, title, sort };
      if (id) {
        console.log('update', content.value);
        updateChapter(id, chapter).then(() => {
          message.success(`Chapter ${chapter.title} Updated`);
          fetchData();
        });
      } else {
        console.log('add', content.value);
        addChapter(chapter).then((res) => {
          content.value.id = res;
          message.success(`Chapter ${chapter.title} added`);
          fetchData();
        });
      }
    } else {
      const section = { id, courseId, chapterId, markdown, title, sort, htmlBrBase64: value };
      if (id) {
        console.log('update', content.value);
        updateSection(id, section).then(() => {
          message.success(`Section ${section.title} Updated`);
          fetchData();
        });
      } else {
        console.log('add', content.value);
        addSection(section).then((res) => {
          console.log(res);
          content.value.id = res;
          message.success(`Section ${section.title} added`);
          fetchData();
        });
      }
    }
  };
</script>

<style>
  .bytemd {
    height: calc(100vh - 350px);
  }
</style>
