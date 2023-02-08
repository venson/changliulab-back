<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <n-card>
    <div v-show="showCourseSyllabus">
      <CourseDetail
        :course="courseDetail"
        @start="handleStart"
        mode="review"
        :reviews="courseReviews"
        @action="handleAction"
      />

      <CourseSyllabus
        :syllabus="syllabus"
        mode="review"
        @view-click="handleSelection"
        @action="handleAction"
      />
    </div>
    <div v-show="!showCourseSyllabus">
      <div class="flex flex-row">
        <div class="w-56 h-[calc(100vh-160px)] overflow-auto shrink-0">
          <CourseTree
            :course-tree="tree"
            mode="preview"
            @select="handleSelection"
            :select-id="content.id"
            @home="goToCourseHome"
          />
        </div>
        <div class="w-full h-[calc(100vh-160px)] overflow-auto">
          <div> </div>
          <div v-if="content.review && content.review === ReviewStatus.APPLIED">
            <n-button
              size="tiny"
              type="success"
              class="rounded w-16 mx-2"
              @click="handleSectionAction(ReviewStatus.FINISHED, ReviewAction.PASS)"
              >Pass</n-button
            >
            <n-button
              size="tiny"
              type="error"
              class="rounded w-16 mx-2"
              @click="handleSectionAction(ReviewStatus.REJECTED, ReviewAction.REJECT)"
              >Reject</n-button
            >
          </div>
          <div class="" v-html="content.html"></div>
        </div>
      </div>
    </div>

    <ReviewModal v-model:show="showModalFlag" :review="reviewModal" @action="handleReviewConfirm" />
  </n-card>
</template>

<script setup lang="ts">
  import { computed, onMounted, reactive, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import pako from 'pako';
  import { useUserStore } from '@/store/modules/user';
  import { CourseSyllabus } from '@/components/CourseSyllabus';
  import { CourseDetail } from '@/components/CourseDetail';
  import { useMessage } from 'naive-ui';
  import 'bytemd/dist/index.css';
  import 'highlight.js/styles/vs.css';
  import 'github-markdown-css/github-markdown-light.css';
  import 'katex/dist/katex.css';
  import { getCoursePreview } from '@/api/edu/course';
  import { CourseTree } from '@/components/CourseTree';
  import {
    CourseDetailInterface,
    CourseTreeInterface,
    CourseSyllabusInterface,
    ReviewVo,
    ReviewAction,
    ReviewStatus,
    ReviewType,
    ReviewInterface,
    ReviewModalInterface,
    SectionContentInterface,
  } from '@/common/types';
  import { getCourseTreeById, getSyllabus } from '@/api/edu/content';

  import { doReviewAction, getReviewListByRefId } from '@/api/edu/review';
  import { ReviewModal } from '@/components/ReviewModal';
  import { getSectionPreviewBySectionId } from '@/api/edu/section';
  import { base64ToBytes } from '@/utils/base64';
  const message = useMessage();
  const showCourseSyllabus = ref(true);
  const showModalFlag = ref(false);
  const confirmButtonDisable = ref(false);

  const userStore = useUserStore();
  const route = useRoute();
  const courseId = route.params.id as string;

  const reviewVo = ref<ReviewVo>({
    userId: userStore.info.id,
    userName: userStore.info.username,
    msg: '',
  });
  //   const showDetail = ref(true);
  //   const section = ref<{ id: string; htmlBrBase64?: string }>({ id: '' });

  const reviewModal = computed<ReviewModalInterface>(() => {
    return {
      title: '',
      action: reviewVo.value.action,
      type: reviewVo.value.type,
    };
  });
  const courseReviews = ref<ReviewInterface[]>([]);
  const fetchData = () => {
    getCourseTreeById(courseId).then((res) => {
      tree.value = res;
    });
    getSyllabus(courseId).then((res) => {
      syllabus.value = res;
    });
    getCoursePreview(courseId).then((res) => {
      courseDetail.value = res;
    });
    getReviewListByRefId(courseId, ReviewType.COURSE).then((res) => {
      courseReviews.value = res;
    });
  };
  const sectionReviewVo = ref<ReviewVo>({
    parentType: ReviewType.CHAPTER,
    type: ReviewType.SECTION,
  });
  const handleSectionAction = (to: ReviewStatus, action: ReviewAction) => {
    sectionReviewVo.value.to = to;
    sectionReviewVo.value.action = action;
    handleAction(sectionReviewVo.value, content.title);
  };
  const getSectionContent = async (section: CourseSyllabusInterface) => {
    // let brotli = await import(brotliWasm).then((m) => m.default);

    // const textDecoder = new TextDecoder();

    getSectionPreviewBySectionId(section.id).then((res: SectionContentInterface) => {
      sectionReviewVo.value.id = res.id;
      // sectionReviewVo.value.type = ReviewType.SECTION;
      sectionReviewVo.value.from = res.review;
      sectionReviewVo.value.parentId = res.chapterId;
      // sectionReviewVo.value.parentType = ReviewType.CHAPTER;
      content.id = res.id;
      content.title = section.title;
      if (res.htmlBrBase64) {
        const htmlBr = base64ToBytes(res.htmlBrBase64);
        // const html = textDecoder.decode(brotli.decompress(htmlBr));
        const html = pako.inflate(htmlBr, { to: 'string' });
        content.html = html;
      } else {
        content.html = 'Empty Content';
      }
      showCourseSyllabus.value = false;
    });
    content.review = section.review;
  };
  const handleSelection = (section: CourseSyllabusInterface) => {
    getSectionContent(section);
  };
  const handleStart = () => {
    const firstSection = tree.value.at(0)?.children?.at(0) as CourseSyllabusInterface;
    console.log(firstSection);
    getSectionContent(firstSection);
  };
  interface ContentInterface {
    id: string;
    html: string;
    title: string;
    review?: ReviewStatus;
  }
  const content = reactive<ContentInterface>({
    id: '',
    html: 'Empty',
    title: '',
  });
  const tree = ref<CourseTreeInterface[]>([]);
  const syllabus = ref<CourseSyllabusInterface[]>([]);
  const courseDetail = ref<CourseDetailInterface>({ title: '' });
  onMounted(() => {
    fetchData();
  });

  const handleReviewConfirm = (value: string) => {
    confirmButtonDisable.value = true;
    reviewVo.value.msg = value;
    doReviewAction(reviewVo.value).then(() => {
      message.success(`Review applied for ${reviewModal.value.type} ${reviewModal.value.title}`);
      fetchData();
      showModalFlag.value = false;
      confirmButtonDisable.value = false;
    });
    setTimeout(() => {
      confirmButtonDisable.value = false;
    }, 5000);
  };
  const handleAction = (vo: ReviewVo, title: string) => {
    Object.assign(reviewVo.value, vo);
    reviewModal.value.title = title;
    console.log('reviewModal', reviewModal);
    console.log('reviewVo', reviewVo);
    showModalFlag.value = true;
  };
  const goToCourseHome = () => {
    showCourseSyllabus.value = true;
  };
</script>

<style scoped></style>
