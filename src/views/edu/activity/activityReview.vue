<!-- eslint-disable vue/no-v-html -->
<template>
  <n-card>
    <div class="text-2xl flex justify-center">{{ activityPreview.title }}</div>
    <div class="flex justify-center">
      <span class="px-3"> Author: {{ activityPreview.authorMemberName }} </span>
      <span>Date: {{ activityPreview.activityDate }}</span>
    </div>
    <div class="border-t border-b-0 border-l-0 border-r-0 border-dashed my-2"></div>
    <div class="h-full" v-html="activityPreview.html"></div>
    <div class="border-t border-b-0 border-l-0 border-r-0 border-dashed my-2"></div>
    <div class="flex justify-between">
      <n-button type="success" @click="passReview">Pass</n-button>
      <n-button type="error" @click="rejectReview">Reject</n-button>
    </div>
    <ReviewModal :review="reviewModal" v-model:show="showModalFlag" @action="handleAction" />
  </n-card>
</template>

<script setup lang="ts">
  import {
    brotliWasm,
    ReviewStatus,
    // ReviewModalInterface,
    ContentType,
    ReviewAction,
    ReviewModalInterface,
    ReviewVo,
  } from '@/common/types';
  import { useRoute } from 'vue-router';
  import { base64ToBytes } from '@/utils/base64';
  import { ReviewModal } from '@/components/ReviewModal';
  import { doReviewByActivityId, getPreviewByActivityId } from '@/api/edu/activity';
  import { onMounted, ref } from 'vue';
  import { useUserStore } from '@/store/modules/user';
  import { useMessage } from 'naive-ui';
  import { capitalized } from '@/utils/string/capitalized';
  const user = useUserStore();
  const message = useMessage();
  const route = useRoute();
  const activityId = route.params.id as string;
  const showModalFlag = ref(false);
  interface ActivityPreview {
    id?: string;
    title?: string;
    activityDate?: string;
    authorMemberId?: string;
    authorMemberName?: string;
    isPublished?: boolean;
    review?: ReviewStatus;
    html?: string;
    htmlBrBase64?: string;
    isRemoveAfterReview?: boolean;
  }
  const reviewVo = ref<ReviewVo>({
    id: user.id,
    name: user.username,
    action: ReviewAction.PASS,
    msg: '',
  });

  const activityPreview = ref<ActivityPreview>({
    id: activityId,
  });
  // const reviewModal = computed(() => {
  //   return {
  //     id: activityId,
  //     title: activityPreview.value.title,
  //     // action: ReviewAction.PASS,
  //     action: any,
  //     type: ContentType.ACTIVITY,
  //   };
  // });
  const reviewModal = ref<ReviewModalInterface>({
    id: activityId,
    title: activityPreview.value.title,
    // action: ReviewAction.PASS,
    action: ReviewAction.PASS,
    type: ContentType.ACTIVITY,
  });

  const fetchData = async () => {
    let brotli = await import(/* @vite-ignore */ brotliWasm).then((m) => m.default);
    const textDecoder = new TextDecoder();

    getPreviewByActivityId(activityId).then((res) => {
      activityPreview.value = res;
      if (activityPreview.value.htmlBrBase64) {
        const htmlBr = base64ToBytes(activityPreview.value.htmlBrBase64);
        const html = textDecoder.decode(brotli.decompress(htmlBr));
        activityPreview.value.html = html;
      } else {
        activityPreview.value.html = 'Empty Content';
      }
    });
  };
  const passReview = () => {
    reviewModal.value.action = ReviewAction.PASS;
    reviewModal.value.title = activityPreview.value.title;
    showModalFlag.value = true;
    console.log('review', reviewModal);
  };
  const rejectReview = () => {
    reviewModal.value.action = ReviewAction.REJECT;
    reviewModal.value.title = activityPreview.value.title;

    showModalFlag.value = true;
    console.log('review', reviewModal);
  };
  const handleAction = (value: string) => {
    reviewVo.value.msg = value;
    doReviewByActivityId(activityId, reviewVo.value).then(() => {
      message.success(
        `The review of ${activityPreview.value.title} was ${capitalized(reviewModal.value.action)} `
      );
      showModalFlag.value = false;
    });
    console.log(value);
  };
  onMounted(() => {
    fetchData();
  });
</script>

<style scoped></style>
