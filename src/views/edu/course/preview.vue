<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <KeepAlive>
    <n-card>
      <div v-show="showCourseSyllabus">
        <div>
          <CourseDetail
            :course="courseDetail"
            mode="preview"
            @start="handleStart"
            :reviews="courseReviews"
            @action="handleAction"
          />
          <CourseSyllabus
            mode="preview"
            :syllabus="syllabus"
            @view-click="handleSelection"
            @action="handleAction"
          />
        </div>
      </div>
      <div class="flex flex-row" v-show="!showCourseSyllabus">
        <div class="w-56 h-[calc(100vh-160px)] overflow-auto flex-none">
          <CourseTree
            :course-tree="tree"
            mode="preview"
            @select="handleSelection"
            :select-id="content.id"
            @home="goToCourseHome"
          />
        </div>
        <div class="grow h-[calc(100vh-160px)] overflow-y-auto">
          <div v-show="showCourseSyllabus">
            <CourseDetail
              :course="courseDetail"
              mode="preview"
              :reviews="courseReviews"
              @action="handleAction"
            />
            <CourseSyllabus
              mode="preview"
              :syllabus="syllabus"
              @view-click="handleSelection"
              @action="handleAction"
            />
          </div>
          <div v-show="!showCourseSyllabus" class="px-4">
            <button @click="requestSectionReview()">Review for section</button>
            <iframe
              v-if="content.videoLink"
              :src="content.videoLink"
              scrolling="no"
              border="0"
              frameborder="no"
              framespacing="0"
              allowfullscreen="true"
              style="height: 400px; width: 60%"
            ></iframe>
            <div class="" v-html="content.html"></div>
          </div>
        </div>
      </div>
      <ReviewModal
        v-model:show="showModalFlag"
        :review="reviewModal"
        @action="handleReviewAction"
      />
    </n-card>
  </KeepAlive>
</template>

<script setup lang="ts">
  import { getCourseTreeById, getSyllabus } from '@/api/edu/content';
  import { getSectionPreviewBySectionId } from '@/api/edu/section';
  import { CourseTree } from '@/components/CourseTree';
  import { base64ToBytes } from '@/utils/base64';
  import { computed, onMounted, ref } from 'vue';
  import { ReviewModal } from '@/components/ReviewModal';
  import { useRoute } from 'vue-router';
  import { CourseDetail } from '@/components/CourseDetail';
  import { CourseSyllabus } from '@/components/CourseSyllabus';
  import {
    ReviewVo,
    CourseDetailInterface,
    CourseTreeInterface,
    CourseSyllabusInterface,
    ReviewAction,
    ReviewStatus,
    ReviewModalInterface,
    ReviewType,
    ReviewInterface,
  } from '@/common/types';
  import pako from 'pako';

  import { useUserStore } from '@/store/modules/user';
  import 'bytemd/dist/index.css';
  import 'highlight.js/styles/vs.css';
  import 'github-markdown-css/github-markdown-light.css';
  import 'katex/dist/katex.css';
  import { getCoursePreview } from '@/api/edu/course';
  import { useMessage } from 'naive-ui';
  import { doReviewAction, getReviewListByRefId } from '@/api/edu/review';
  const route = useRoute();
  const courseId = route.params.id as string;
  const message = useMessage();
  const showCourseSyllabus = ref(true);
  const showModalFlag = ref(false);
  const courseReviews = ref<ReviewInterface[]>([]);
  const videoLinkReg = /src\s*=\s*"(.+?)"/;
  // const videoLinkReg = /src\s*=\s*"(.+?\s*\"*\d\"*)"/;
  const userStore = useUserStore();
  const reviewVo = ref<ReviewVo>({
    userId: userStore.info.id,
    userName: userStore.info.username,
    msg: '',
  });
  // const reviewModal = ref<ReviewModalInterface>({
  //   title: '',
  //   action: reviewVo.value.action,
  //   type: reviewVo.value.type,
  // });
  const handleStart = () => {
    const firstSection = tree.value.at(0)?.children?.at(0) as CourseSyllabusInterface;
    console.log(firstSection);
    firstSection && handleSelection(firstSection);
  };
  const reviewModal = computed<ReviewModalInterface>(() => {
    return {
      title: '',
      action: reviewVo.value.action,
      type: reviewVo.value.type,
    };
  });
  const content = ref<{ id: string; html: string; title: string; videoLink?: string }>({
    id: '',
    html: '',
    title: '',
  });
  const requestSectionReview = () => {
    handleAction(
      {
        id: content.value.id,
        type: ReviewType.SECTION,
        // from: courseDetail.value.review,
        to: ReviewStatus.APPLIED,
        action: ReviewAction.REQUEST,
      },
      content.value.title
    );
  };
  const tree = ref<CourseTreeInterface[]>([]);
  const syllabus = ref<CourseSyllabusInterface[]>([]);
  const courseDetail = ref<CourseDetailInterface>({ title: '' });
  // const requestChapterReview = (chapter: CourseTreeInterface, action: ReviewAction) => {
  //   reviewModal.value.title = chapter.title;
  //   reviewVo.value.id = chapter.id;
  //   reviewVo.value.action = action;
  //   reviewVo.value.type = ReviewType.CHAPTER;
  //   showModalFlag.value = true;
  // };
  const getCourseDetail = () => {
    getCoursePreview(courseId).then((res) => {
      courseDetail.value = res;
    });
  };
  const fetchData = () => {
    getCourseTreeById(courseId).then((res) => {
      tree.value = res;
    });
    getSyllabus(courseId).then((res) => {
      syllabus.value = res;
    });
    getReviewListByRefId(courseId, ReviewType.COURSE).then((res) => {
      courseReviews.value = res;
    });
  };
  // const handleAction<T extends ReviewContentInterface > = (from :T ) =>{

  // }
  // function handleAction<T>(from: T) {
  //   console.log(from);
  // }
  const handleAction = (vo: ReviewVo, title: string) => {
    Object.assign(reviewVo.value, vo);
    reviewModal.value.title = title;
    console.log('reviewModal', reviewModal);
    console.log('reviewVo', reviewVo);
    showModalFlag.value = true;
  };

  const handleReviewAction = (value: string) => {
    reviewVo.value.msg = value;
    doReviewAction(reviewVo.value).then(() => {
      message.success(`Review applied for ${reviewModal.value.type} ${reviewModal.value.title}`);
      fetchData();
      showModalFlag.value = false;
    });
  };
  const sectionReviewVo = ref<ReviewVo>({
    parentType: ReviewType.CHAPTER,
    type: ReviewType.SECTION,
  });
  onMounted(() => {
    fetchData();
    getCourseDetail();
    console.log(userStore);
    console.log(reviewVo);
  });

  const handleSelection = (section: CourseTreeInterface) => {
    reviewVo.value.from = section.review;
    getSectionPreviewBySectionId(section.id).then((res) => {
      sectionReviewVo.value.id = res.id;
      sectionReviewVo.value.from = res.review;
      sectionReviewVo.value.parentId = res.chapterId;
      content.value.id = res.id;
      content.value.title = section.title;
      console.log(res);
      if (res.videoLink && res.videoLink.indexOf('iframe') !== -1) {
        content.value.videoLink = res.videoLink.match(videoLinkReg)[1];
        console.log(content);
      } else {
        content.value.videoLink = undefined;
      }
      if (res.htmlBrBase64) {
        const htmlBr = base64ToBytes(res.htmlBrBase64);
        const html = pako.inflate(htmlBr, { to: 'string' });
        content.value.html = html;
      } else {
        content.value.html = 'No Content';
      }
      showCourseSyllabus.value = false;
    });
  };
  const goToCourseHome = () => {
    showCourseSyllabus.value = true;
  };
</script>

<style scoped></style>
