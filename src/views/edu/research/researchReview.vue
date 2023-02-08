<!-- eslint-disable vue/no-v-html -->
<template>
  <n-card>
    <div class="text-2xl flex justify-center">{{ researchPreview.title }}</div>
    <div class="flex justify-center">
      <span class="px-3"> Author: {{ researchPreview.authorMemberName }} </span>
      <span>Date: {{ researchPreview.researchDate }}</span>
    </div>
    <div class="border-t border-b-0 border-l-0 border-r-0 border-dashed my-2"></div>
    <div class="h-full" v-html="researchPreview.html"></div>
    <div class="border-t border-b-0 border-l-0 border-r-0 border-dashed my-2"></div>
    <div class="flex justify-between">
      <n-button type="success" @click="handleAction(ReviewStatus.FINISHED, ReviewAction.PASS)"
        >Pass</n-button
      >
      <n-button type="error" @click="handleAction(ReviewStatus.REJECTED, ReviewAction.REJECT)"
        >Reject</n-button
      >
    </div>
    <ReviewModal :review="reviewModal" v-model:show="showModalFlag" @action="handleReviewAction" />
  </n-card>
</template>

<script setup lang="ts">
  import {
    ReviewStatus,
    // ReviewModalInterface,
    ReviewAction,
    ReviewModalInterface,
    ReviewVo,
    ReviewType,
  } from '@/common/types';
  import { useRoute } from 'vue-router';
  import { base64ToBytes } from '@/utils/base64';
  import { ReviewModal } from '@/components/ReviewModal';
  import { getPreviewByResearchId } from '@/api/edu/research';
  import { computed, onMounted, ref } from 'vue';
  import { useUserStore } from '@/store/modules/user';
  import pako from 'pako';
  import { useMessage } from 'naive-ui';
  import { doReviewAction } from '@/api/edu/review';
  import { capitalized } from '@/utils/string/capitalized';
  const userStore = useUserStore();
  const message = useMessage();
  const route = useRoute();
  const researchId = route.params.id as string;
  const showModalFlag = ref(false);
  interface researchPreview {
    id?: string;
    title?: string;
    researchDate?: string;
    authorMemberId?: string;
    authorMemberName?: string;
    isPublished?: boolean;
    review?: ReviewStatus;
    html?: string;
    htmlBrBase64?: string;
    isRemoveAfterReview?: boolean;
  }

  const confirmButtonDisable = ref(false);
  const researchPreview = ref<researchPreview>({
    id: researchId,
  });
  // const reviewModal = computed(() => {
  //   return {
  //     id: researchId,
  //     title: researchPreview.value.title,
  //     // action: ReviewAction.PASS,
  //     action: any,
  //     type: ContentType.research,
  //   };
  // });

  const reviewVo = ref<ReviewVo>({
    userId: userStore.info.id,
    userName: userStore.info.username,
    from: ReviewStatus.APPLIED,
    type: ReviewType.RESEARCH,
    msg: '',
  });
  const handleAction = (to: ReviewStatus, action: ReviewAction) => {
    reviewVo.value.to = to;
    reviewModal.value.title = researchPreview.value.title!;
    reviewVo.value.action = action;
    showModalFlag.value = true;
  };
  const reviewModal = computed<ReviewModalInterface>(() => {
    return {
      title: '',
      action: reviewVo.value.action,
      type: reviewVo.value.type,
    };
  });
  const fetchData = async () => {
    getPreviewByResearchId(researchId).then((res) => {
      researchPreview.value = res;

      if (res.htmlBrBase64) {
        const htmlBr = base64ToBytes(res.htmlBrBase64);
        // const html = textDecoder.decode(brotli.decompress(htmlBr));
        const html = pako.inflate(htmlBr, { to: 'string' });
        researchPreview.value.html = html;
      } else {
        researchPreview.value.html = 'Empty Content';
      }
    });
  };

  const handleReviewAction = (value: string) => {
    confirmButtonDisable.value = true;
    reviewVo.value.msg = value;
    doReviewAction(reviewVo.value).then(() => {
      message.success(
        `${capitalized(reviewVo.value.action)} Review for ${reviewModal.value.type} ${
          reviewModal.value.title
        }`
      );
      fetchData();
      showModalFlag.value = false;
      confirmButtonDisable.value = false;
    });
    setTimeout(() => {
      confirmButtonDisable.value = false;
    }, 5000);
  };
  onMounted(() => {
    fetchData();
  });
</script>

<style scoped></style>
