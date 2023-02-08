<template>
  <KeepAlive>
    <n-card>
      <n-form label-placement="left" label-width="80" inline>
        <n-grid>
          <n-form-item-gi :span="18" label="Title" label-width="40">
            <n-input v-model:value="methodology.title" />
          </n-form-item-gi>
          <n-form-item-gi :span="6" label="Language">
            <n-select v-model:value="methodology.language" :options="options" />
          </n-form-item-gi>
        </n-grid>
      </n-form>
      <MdEditor
        v-model="methodology.markdown"
        :request-enable="true"
        :edit-enable="methodology.id !== undefined"
        @html="saveHtml"
        @request="requestMethodologyReview"
      />
      <ReviewModal v-model:show="showModalFlag" :review="reviewModal" @action="handleAction" />
    </n-card>
  </KeepAlive>
</template>

<script setup lang="ts">
  import { addMethodology, getMethodologyById, updateMethodology } from '@/api/edu/methodology';
  import {
    LanguageEnum,
    MethodologyInterface,
    ReviewAction,
    ReviewModalInterface,
    ReviewStatus,
    ReviewType,
    ReviewVo,
  } from '@/common/types';
  import { MdEditor } from '@/components/MdEditor';
  import { useMessage } from 'naive-ui';
  import { computed, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';

  import { useUserStore } from '@/store/modules/user';
  import { doReviewAction } from '@/api/edu/review';
  const user = useUserStore();
  const message = useMessage();
  const route = useRoute();
  const methodologyId = route.params.id as string;
  const methodology = ref<MethodologyInterface>({ title: '' });
  const fetchData = () => {
    methodologyId &&
      getMethodologyById(methodologyId).then((res) => {
        methodology.value = res;
        console.log(methodology.value);
      });
  };
  const options = [
    { label: 'Chinese', value: LanguageEnum.CHINESE },
    { label: 'English', value: LanguageEnum.ENGLISH },
  ];
  const showModalFlag = ref(false);
  const reviewModal = computed<ReviewModalInterface>(() => {
    return {
      title: '',
      action: reviewVo.value.action,
      type: reviewVo.value.type,
    };
  });
  const reviewVo = ref<ReviewVo>({
    userId: user.id,
    userName: user.username,
    msg: '',
    type: ReviewType.METHODOLOGY,
  });
  onMounted(() => {
    fetchData();
  });
  const saveHtml = (html: string) => {
    methodology.value.htmlBrBase64 = html;
    if (methodology.value.id) {
      updateMethodology(methodology.value.id, methodology.value).then(() => {
        message.success(`Methodology ${methodology.value.title} updated`);
      });
    } else {
      addMethodology(methodology.value).then((res) => {
        message.success(`Methodology ${methodology.value.title} added`);
        methodology.value.id = res;
      });
    }
  };
  const requestMethodologyReview = () => {
    if (methodology.value.id) {
      reviewVo.value.id = methodology.value.id;
      reviewVo.value.from = methodology.value.review ? methodology.value.review : ReviewStatus.NONE;
      reviewVo.value.to = ReviewStatus.APPLIED;
      reviewVo.value.action = ReviewAction.REQUEST;
      reviewModal.value.title = methodology.value.title;
      showModalFlag.value = true;
    } else {
      message.error('Please save, then request review');
    }
  };
  const handleAction = (msg: string) => {
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
