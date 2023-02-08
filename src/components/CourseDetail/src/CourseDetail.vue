<template>
  <div class="appearance-none">
    <div class="bg-gradient-to-r from-[#032f71] to-[#0c60b5] text-white px-3 py-12">
      <div class="sm:flex justify-between">
        <div class="mb-2">
          <a href="/course">公开课</a><span>&gt;</span> <a>{{ course.l1Subject }}</a
          ><span>&gt;</span>
          <a>{{ course.l2Subject }}</a>
        </div>
        <div class="mr-4">
          <div v-if="mode === 'preview'">
            <n-button
              type="success"
              class="mx-1 w-40"
              size="tiny"
              @click="handleCourse(ReviewStatus.APPLIED, ReviewAction.REQUEST)"
              >Request Course Info</n-button
            >
            <n-button
              type="success"
              class="mx-1"
              size="tiny"
              @click="handleCourse(ReviewStatus.APPLIED, ReviewAction.REQUEST_ENTIRE)"
              >Request Entire Course</n-button
            >
          </div>
          <div v-if="mode === 'review'">
            <div>
              <n-button
                v-if="course.review === ReviewStatus.APPLIED"
                type="success"
                class="mx-1 mt-1 w-32"
                size="tiny"
                @click="handleCourse(ReviewStatus.FINISHED, ReviewAction.PASS)"
                >Pass Course Info</n-button
              >
              <n-button
                type="success"
                class="mx-1 mt-1 w-32"
                size="tiny"
                @click="handleCourse(ReviewStatus.FINISHED, ReviewAction.PASS_ENTIRE)"
                >Pass Entire Course</n-button
              >
            </div>
            <div>
              <n-button
                v-if="course.review === ReviewStatus.APPLIED"
                type="error"
                class="mx-1 mt-1 w-32"
                size="tiny"
                @click="handleCourse(ReviewStatus.REJECTED, ReviewAction.REJECT)"
                >Reject Course Info</n-button
              >
              <n-button
                type="error"
                class="mx-1 mt-1 w-32"
                size="tiny"
                @click="handleCourse(ReviewStatus.REJECTED, ReviewAction.REJECT_ENTIRE)"
                >Reject Entire Course</n-button
              >
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row">
        <div class="sm:w-1/2">
          <div class="sm:flex sm:flex-row">
            <div class="sm:w-1/2">
              <div class="mb-4">
                <div class="text-2xl font-bold">{{ course.title }}</div>
                <div class="text-sm">{{ course.description }}</div>
              </div>
              <div class="flex flex-row items-center py-2">
                <img class="w-7 h-7 rounded-full mr-2" :src="course.avatar" />
                <span>{{ course.memberName }}, {{ course.memberTitle }}</span>
              </div>
            </div>
            <div class="mt-2 sm:hidden">
              <img class="aspect-video h-28" :src="course.cover" />
            </div>
          </div>

          <div class="md:flex md:flex-row md:items-center">
            <n-button
              class="appearance-none h-20 mt-3 w-48 rounded text-xl bg-blue-500"
              @click="goToCourse"
              >开始学习</n-button
            >
            <div class="pt-6 md:pt-0 text-sm md:pl-6">{{
              course.isPublic ? '免费公开' : '需注册'
            }}</div>
          </div>
          <div class="pt-6 text-base">{{ course.viewCount }} 人已学习</div>
        </div>
        <div id="left" class="hidden mt-2 mb-3 sm:flex w-1/2 items-center">
          <img class="aspect-video max-w-full max-h-40" :src="course.cover" />
        </div>
      </div>
      <ReviewTable :reviews="reviews" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { defineComponent } from 'vue';
  import { ReviewTable } from '@/components/ReviewTable';
  import {
    CourseDetailInterface,
    ReviewAction,
    ReviewInterface,
    ReviewStatus,
    ReviewType,
    ReviewVo,
  } from '@/common/types';
  interface propsInterface {
    course: CourseDetailInterface;
    mode: 'review' | 'preview';
    reviews: ReviewInterface[];
  }
  const props = defineProps<propsInterface>();
  const emits = defineEmits(['start', 'action']);
  const goToCourse = () => {
    console.log('emits');
    emits('start');
  };
  const handleCourse = (to: ReviewStatus, action: ReviewAction) => {
    const vo: ReviewVo = {
      id: props.course.id,
      type: ReviewType.COURSE,
      from: props.course.review,
      to: to,
      action: action,
    };
    emits('action', vo, props.course.title);
  };
</script>

<script lang="ts">
  export default defineComponent({
    name: 'CourseDetail',
  });
</script>
