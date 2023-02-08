<template>
  <div class="relative mx-2 z-50">
    <div v-if="mode === 'edit'">
      <n-button type="success" size="tiny" @click="addContent(CourseContentType.CHAPTER)">
        new Chapter
      </n-button>
    </div>
    <div v-else>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button type="info" size="tiny" @click="goToHome">
            <n-icon>
              <HomeOutlined />
            </n-icon>
          </n-button>
        </template>
        Back to Course Home
      </n-tooltip>
    </div>
    <nav>
      <ul class="list-none pl-1">
        <li v-for="(chapter, index) in courseTree" :key="index">
          <div>
            <div class="px-1 group">
              <button
                class="text-sm font-bold my-1 w-full text-left hover:bg-gray-300"
                :class="chapter.isRemoveAfterReview ? 'line-through' : ''"
                @click="setChapterVisible(index)"
                >{{ chapter.title }}</button
              >
              <div v-if="mode === 'edit'" class="flex justify-between">
                <CourseStatus :course="chapter" />
                <div class="flex items-center invisible group-hover:visible">
                  <n-button
                    text
                    class="text-xl px-1"
                    @click="addContent(CourseContentType.SECTION, chapter)"
                  >
                    <n-icon>
                      <PlusCircleFilled />
                    </n-icon>
                  </n-button>
                  <n-button
                    text
                    class="text-xl px-1"
                    @click="editContent(CourseContentType.CHAPTER, chapter)"
                  >
                    <n-icon>
                      <EditFilled />
                    </n-icon>
                  </n-button>
                  <n-button
                    text
                    class="text-xl px-1"
                    @click="removeContent(CourseContentType.CHAPTER, chapter)"
                  >
                    <n-icon>
                      <Delete20Regular v-show="!chapter.isRemoveAfterReview" />
                      <DeleteOff20Regular v-show="chapter.isRemoveAfterReview" />
                    </n-icon>
                  </n-button>
                </div>
              </div>
            </div>

            <div v-if="chapterExpandComp[index]">
              <ul class="list-none pl-1">
                <li v-for="(section, subindex) in chapter.children" :key="subindex">
                  <div
                    class="group pr-4 py-2 pl-2 hover:border-solid hover:border-l-8 hover:border-green-900 hover:bg-gray-300"
                    :class="
                      selectId === section.id
                        ? 'bg-gray-200 border-green-800 border-solid border-l-8'
                        : ''
                    "
                  >
                    <div
                      :class="
                        chapter.isRemoveAfterReview || section.isRemoveAfterReview
                          ? 'line-through'
                          : ''
                      "
                      @click="mode === 'preview' && selectSection(section)"
                    >
                      <div class="flex">
                        {{ section.title }}
                        <CourseStatus v-if="mode === 'preview'" :course="section" />
                      </div>
                    </div>
                    <div v-if="mode === 'edit'" class="flex justify-between">
                      <CourseStatus :course="section" />
                      <div class="flex items-center invisible group-hover:visible">
                        <!-- <n-button text class="text-xl px-1" @click="addContent(section, 'section')">
                          <n-icon>
                            <PlusCircleFilled />
                          </n-icon>
                        </n-button> -->
                        <n-button
                          text
                          class="text-xl px-1"
                          @click="editContent(CourseContentType.SECTION, section)"
                        >
                          <n-icon>
                            <EditFilled />
                          </n-icon>
                        </n-button>
                        <n-button
                          text
                          class="text-xl px-1"
                          @click="removeContent(CourseContentType.SECTION, section)"
                        >
                          <n-icon>
                            <DeleteFilled />
                          </n-icon>
                        </n-button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script lang="ts" setup>
  import { computed, defineComponent, ref } from 'vue';
  import { CourseTreeInterface, CourseContentType } from '@/common/types';
  import { CourseStatus } from '@/components/CourseStatus';
  import { PlusCircleFilled, EditFilled, DeleteFilled, HomeOutlined } from '@vicons/antd';
  import { Delete20Regular, DeleteOff20Regular } from '@vicons/fluent';
  interface propsInterface {
    courseTree: CourseTreeInterface[];
    mode: 'edit' | 'preview';
    selectId?: string;
  }
  const emit = defineEmits(['edit', 'add', 'remove', 'select', 'home']);
  const props = defineProps<propsInterface>();
  // const chapterShow = ref<boolean[]>([true]);
  // const chapterExpandArray = computed<boolean[]>(() => {
  //   debugger;
  //   const chapters = new Array<boolean>(props.courseTree.length).fill(false);
  //   // chapters.forEach((item, index, array) => {
  //   //   console.log('item', item, 'index', index, 'array', array);
  //   //   array[index] = false;
  //   // });
  //   console.log('chapters', chapters);

  //   return chapters;
  // });
  const chapterExpand = ref<boolean[]>([]);
  const chapterExpandComp = computed<boolean[]>({
    get: () => {
      if (chapterExpand.value.length != props.courseTree.length) {
        const temp = new Array<boolean>(props.courseTree.length).fill(false);
        temp[0] = true;
        return temp;
      }
      return chapterExpand.value;
    },
    set: (index) => {
      chapterExpand.value = index;
      // console.log('computed set');
    },
  });

  const setChapterVisible = (index: number) => {
    // debugger;
    // console.log('set', chapterExpandArray.value[index], chapterExpandArray);
    chapterExpandComp.value[index] = !chapterExpandComp.value[index];
    chapterExpandComp.value = chapterExpandComp.value;
    // console.log('after set', chapterExpandArray.value[index], chapterExpandArray);
    // chapterExpandArray.value.splice(index, 1, !chapterExpandArray.value[index]);
  };
  const addContent = (type: CourseContentType, node?: CourseTreeInterface) => {
    emit('add', node, type);
  };
  const editContent = (type: CourseContentType, node?: CourseTreeInterface) => {
    emit('edit', node, type);
  };
  const removeContent = (type: CourseContentType, node?: CourseTreeInterface) => {
    emit('remove', node, type);
  };
  const selectSection = (section: CourseTreeInterface) => {
    emit('select', section);
  };
  const goToHome = () => {
    emit('home');
  };
</script>
<script lang="ts">
  export default defineComponent({
    name: 'CourseTree',
  });
</script>
