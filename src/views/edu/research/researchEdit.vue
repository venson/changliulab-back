<template>
  <KeepAlive>
    <n-card>
      <n-form label-placement="left" label-width="80">
        <n-grid>
          <n-form-item-gi :span="18" label="Title" label-width="40">
            <n-input v-model:value="research.title" />
          </n-form-item-gi>
          <n-form-item-gi :span="6" label="Language">
            <n-select v-model:value="research.language" :options="options" />
          </n-form-item-gi>
        </n-grid>
      </n-form>
      <MdEditor
        v-model="research.markdown"
        :request-enable="true"
        :edit-enable="research.id !== undefined"
        @html="saveHtml"
        @request="requestReview"
      />
      <ReviewModal v-model:show="showModalFlag" :review="reviewModal" @action="handleAction" />
    </n-card>
  </KeepAlive>
</template>

<script setup lang="ts">
  import { addResearch, getResearchById, updateResearch } from '@/api/edu/research';
  import {
    LanguageEnum,
    ResearchInterface,
    ReviewAction,
    ReviewModalInterface,
    ReviewStatus,
    ReviewType,
    ReviewVo,
  } from '@/common/types';
  import { MdEditor } from '@/components/MdEditor';
  import { computed, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '@/store/modules/user';
  import { doReviewAction } from '@/api/edu/review';
  import { useMessage } from 'naive-ui';
  const userStore = useUserStore();
  const message = useMessage();

  const showModalFlag = ref(false);
  const reviewVo = ref<ReviewVo>({
    userId: userStore.info.id,
    userName: userStore.info.username,
    msg: '',
    type: ReviewType.RESEARCH,
  });
  const reviewModal = computed<ReviewModalInterface>(() => {
    return {
      title: '',
      action: reviewVo.value.action,
      type: reviewVo.value.type,
    };
  });
  const options = [
    { label: 'Chinese', value: LanguageEnum.CHINESE },
    { label: 'English', value: LanguageEnum.ENGLISH },
  ];
  const route = useRoute();
  const researchId = route.params.id as string;
  const research = ref<ResearchInterface>({ title: '', buttonDisabled: false });
  const fetchData = () => {
    researchId &&
      getResearchById(researchId).then((res) => {
        research.value = res;
      });
  };
  onMounted(() => {
    fetchData();
  });
  const saveHtml = (html: string) => {
    research.value.htmlBrBase64 = html;
    if (research.value?.id) {
      updateResearch(research.value.id, research.value).then(() => {
        message.success(`Research ${research.value.title} updated`);
      });
    } else {
      addResearch(research.value).then((res) => {
        message.success(`Research ${research.value.title} added`);
        research.value.id = res;
      });
    }
  };

  const requestReview = () => {
    if (research.value.id) {
      reviewVo.value.id = research.value.id;
      reviewVo.value.from = research.value.review ? research.value.review : ReviewStatus.NONE;
      reviewVo.value.to = ReviewStatus.APPLIED;
      reviewVo.value.action = ReviewAction.REQUEST;
      reviewModal.value.title = research.value.title;
      showModalFlag.value = true;
    } else {
      message.error('Please save, then request review');
    }
  };
  const handleAction = (msg: string) => {
    // console.log(message);
    reviewVo.value.msg = msg;
    doReviewAction(reviewVo.value).then(() => {
      message.success(`Review applied for ${reviewModal.value.type} ${reviewModal.value.title}`);
      fetchData();
      showModalFlag.value = false;
    });
  };
</script>

<!-- <style scoped> -->
<style>
  .bytemd {
    height: calc(100vh - 250px);
  }
</style>
