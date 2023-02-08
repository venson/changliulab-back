<template>
  <div>
    <div>
      <h1>课程内容</h1>
      <div v-for="(chapter, index) in syllabusRef" :key="index">
        <div class="flex flex-row">
          <div class="flex flex-col items-center px-3 py-4 w-24">
            <div class="tracking-widest">CHAPTER</div>
            <div class="text-6xl text-center">{{ index + 1 }}</div>
          </div>
          <div class="w-full">
            <!-- <div class="text-xl mb-6">{{ chapter.title }}</div> -->
            <div class="text-xl mb-6">
              <div class="relative">
                <div class="flex" :class="chapter.isRemoveAfterReview ? 'line-through' : ''">
                  {{ chapter.title }}
                  <CourseStatus :course="chapter" />
                </div>
                <div class="absolute right-1 top-1">
                  <div v-if="mode === 'preview'">
                    <n-button
                      size="small"
                      class="mx-1 w-20"
                      type="success"
                      :disabled="chapter.review === ReviewStatus.APPLIED"
                      @click="handleChapter(chapter, ReviewStatus.APPLIED, ReviewAction.REQUEST)"
                      >Request</n-button
                    >
                    <n-button
                      size="small"
                      class="mx-1 w-28"
                      type="success"
                      @click="
                        handleChapter(chapter, ReviewStatus.APPLIED, ReviewAction.REQUEST_ENTIRE)
                      "
                      >Request Entire</n-button
                    >
                  </div>
                  <div v-if="mode === 'review'">
                    <div>
                      <n-button
                        v-if="chapter.review === ReviewStatus.APPLIED"
                        size="tiny"
                        class="mx-1 w-14"
                        type="success"
                        @click="handleChapter(chapter, ReviewStatus.FINISHED, ReviewAction.PASS)"
                        >Pass</n-button
                      >
                      <n-button
                        size="tiny"
                        class="mx-1 w-20"
                        type="success"
                        @click="
                          handleChapter(chapter, ReviewStatus.FINISHED, ReviewAction.PASS_ENTIRE)
                        "
                        >Pass Entire</n-button
                      >
                    </div>
                    <div>
                      <n-button
                        v-if="chapter.review === ReviewStatus.APPLIED"
                        size="tiny"
                        class="mx-1 w-14"
                        type="error"
                        @click="handleChapter(chapter, ReviewStatus.REJECTED, ReviewAction.REJECT)"
                        >Reject</n-button
                      >
                      <n-button
                        size="tiny"
                        class="mx-1 w-20"
                        type="error"
                        @click="
                          handleChapter(chapter, ReviewStatus.REJECTED, ReviewAction.REJECT_ENTIRE)
                        "
                        >Reject Entire</n-button
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-sm mb-2">{{ chapter.description }}</div>
            <div v-show="chapter.children && chapter.children.length > 0">
              <div class="text-sm text-gray-400 mb-2">
                共{{ chapter.children?.length }}小节
                <a @click="showSection(index)">显示全部</a>
              </div>
              <div v-if="showAllSection[index]">
                <li
                  class="list-none py-1 hover:bg-gray-100"
                  v-for="(section, sectionIndex) in chapter.children"
                  :key="sectionIndex"
                >
                  <div class="flex justify-between">
                    <div class="flex items-center">
                      <a
                        @click="emits('viewClick', section)"
                        class="px-2"
                        :class="section.isRemoveAfterReview ? 'line-through' : ''"
                      >
                        {{ section.title }}
                      </a>
                      <CourseStatus :course="section" />
                    </div>
                    <n-button
                      size="small"
                      class="mx-1 w-20"
                      type="success"
                      :disabled="section.review === ReviewStatus.APPLIED"
                      v-if="mode === 'preview'"
                      @click="handleSection(section, ReviewStatus.APPLIED, ReviewAction.REQUEST)"
                      >Request</n-button
                    >
                    <div v-if="mode === 'review'">
                      <n-button
                        size="tiny"
                        type="success"
                        class="rounded w-16 mx-1"
                        :disabled="section.review !== ReviewStatus.APPLIED"
                        @click="handleSection(section, ReviewStatus.FINISHED, ReviewAction.PASS)"
                        >Pass</n-button
                      >
                      <!-- <button
                      class="bg-green-300 rounded p-1 w-16 mx-2 border-0"
                      @click="passSection(section)"
                      >Pass</button
                    > -->
                      <n-button
                        size="tiny"
                        type="error"
                        class="rounded w-16 mx-1"
                        @click="handleSection(section, ReviewStatus.REJECTED, ReviewAction.REJECT)"
                        >Reject</n-button
                      >
                    </div>
                  </div>
                </li>
              </div>
            </div>
            <div class="border-b border-solid border-gray-300 mb-3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { defineComponent, ref, toRef } from 'vue';
  import { CourseSyllabusInterface, ReviewType, ReviewVo } from '@/common/types';
  import { CourseStatus } from '@/components/CourseStatus';
  import { ReviewAction, ReviewStatus } from '@/common/types';

  const emits = defineEmits(['update:reviewVo', 'viewClick', 'action']);
  interface propsInterface {
    syllabus: CourseSyllabusInterface[];
    mode: 'preview' | 'review';
    // reviewVo: ReviewVo;
  }
  const props = defineProps<propsInterface>();
  // defineProps<{ syllabus: CourseSyllabusInterface[] }>();
  // const syllabusRef = computed(() => props.syllabus);
  const syllabusRef = toRef(props, 'syllabus');
  const showAllSection = ref<boolean[]>([]);
  const showSection = (index: number) => {
    showAllSection.value.splice(index, 1, !showAllSection.value[index]);
    console.log(showAllSection);
  };
  const handleChapter = (
    chapter: CourseSyllabusInterface,
    to: ReviewStatus,
    action: ReviewAction
  ) => {
    const vo: ReviewVo = {
      id: chapter.id,
      type: ReviewType.CHAPTER,
      from: chapter.review,
      to: to,
      action: action,
      parentId: chapter.courseId,
      parentType: ReviewType.COURSE,
    };
    emits('action', vo, chapter.title);
  };
  const handleSection = (
    section: CourseSyllabusInterface,
    to: ReviewStatus,
    action: ReviewAction
  ) => {
    const vo: ReviewVo = {
      id: section.id,
      type: ReviewType.SECTION,
      from: section.review,
      to: to,
      action: action,
      parentId: section.chapterId,
      parentType: ReviewType.SECTION,
    };
    emits('action', vo, section.title);
  };
</script>
<script lang="ts">
  export default defineComponent({
    name: 'CourseSyllabus',
  });
</script>
