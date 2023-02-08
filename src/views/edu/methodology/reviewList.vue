<template>
  <KeepAlive>
    <n-card>
      <BTable ref="tableRef" :columns="fullColumns" :data-request="dataRequest" />
      <HtmlViewModal
        v-model:show="showPreviewFlag"
        :reviewed="methodologyPreview.publishedHtmlBrBase64"
        :modified="methodologyPreview.htmlBrBase64"
        mode="review"
        @action="handleViewAction"
      />
      <ReviewModal
        v-model:show="showModalFlag"
        :review="reviewModal"
        @action="handleReviewConfirm"
      />
    </n-card>
  </KeepAlive>
</template>

<script setup lang="ts">
  //   import { getPageActivityReview } from '@/api/edu/activity';
  import { ReviewModal } from '@/components/ReviewModal';
  //   import viewModal from './src/viewModal.vue';
  import { HtmlViewModal } from '@/components/HtmlViewModal';
  import { getPageMethodologyReview, getMethodologyViewById } from '@/api/edu/methodology';
  import {
    MethodologyInterface,
    ReviewAction,
    ReviewModalInterface,
    ReviewVo,
    PreviewInterface,
    ReviewType,
    ReviewStatus,
  } from '@/common/types';
  import { BTable } from '@/components/BTable';
  import { usePermission } from '@/hooks/web/usePermission';
  import { useUserStore } from '@/store/modules/user';
  import { EyeFilled } from '@vicons/antd';
  import { StopCircle } from '@vicons/ionicons5';
  import {
    DataTableColumn,
    DataTableColumns,
    NButton,
    NIcon,
    NTooltip,
    useMessage,
  } from 'naive-ui';
  import { computed, h, ref } from 'vue';
  //   import { useRouter } from 'vue-router';
  import { methodologyColumns } from './src/methodologyColumns';
  import { doReviewAction } from '@/api/edu/review';
  import { capitalized } from '@/utils/string/capitalized';

  //   const router = useRouter();
  const { hasPermission } = usePermission();
  const tableRef = ref();

  const methodologyPreview = ref<PreviewInterface>({});
  const showModalFlag = ref(false);
  const showPreviewFlag = ref(false);
  const message = useMessage();
  const tableActionFlag = computed(() =>
    hasPermission(['methodology.review.pass', 'methodology.review.reject'])
  );
  const tableAction: DataTableColumn<MethodologyInterface> = {
    title: 'Action',
    key: 'action',
    align: 'center',
    render(row) {
      return [
        hasPermission(['methodology.review.pass'])
          ? h(
              NTooltip,
              { trigger: 'hover' },
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      size: 'small',
                      onClick: () => reviewMethodology(row),
                      type: 'info',
                      class: 'mx-1',
                    },
                    { default: () => h(NIcon, null, { default: () => h(EyeFilled) }) }
                  ),
                default: () => 'Review Content',
              }
            )
          : null,
        hasPermission(['methodology.review.reject'])
          ? h(
              NTooltip,
              { trigger: 'hover' },
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      size: 'small',
                      type: 'error',
                      class: 'mx-1',
                      onClick: () => rejectMethodology(row),
                    },
                    { default: () => h(NIcon, null, { default: () => h(StopCircle) }) }
                  ),
                default: () => 'Reject Review',
              }
            )
          : null,
      ];
    },
  };
  const fullColumns = computed(() => {
    const columns: DataTableColumns<MethodologyInterface> = [...methodologyColumns];
    if (tableActionFlag.value) {
      columns.push(tableAction);
    }
    return columns;
  });
  const dataRequest = async (res: { current: number; size: number }) =>
    await getPageMethodologyReview(res.current, res.size);

  const reviewMethodology = (row: MethodologyInterface) => {
    getMethodologyViewById(row.id!).then((res: PreviewInterface) => {
      methodologyPreview.value = res;
      reviewVo.value.id = row.id;
      showPreviewFlag.value = true;
    });
  };
  const rejectMethodology = (row: MethodologyInterface) => {
    reviewVo.value.action = ReviewAction.REJECT;
    reviewVo.value.id = row.id;
    reviewModal.value.title = row.title;
    showModalFlag.value = true;
  };

  const user = useUserStore();
  const reviewVo = ref<ReviewVo>({
    userId: user.id,
    userName: user.username,
    from: ReviewStatus.APPLIED,
    to: ReviewStatus.REJECTED,
    action: ReviewAction.REJECT,
    type: ReviewType.METHODOLOGY,
    msg: '',
  });
  const reviewModal = computed<ReviewModalInterface>(() => {
    return {
      title: methodologyPreview.value.title,
      type: ReviewType.RESEARCH,
      action: reviewVo.value.action,
    };
  });
  const handleReviewConfirm = (value: string) => {
    reviewVo.value.msg = value;
    console.log(reviewVo.value);
    doReviewAction(reviewVo.value).then(() => {
      message.success(
        `${capitalized(reviewVo.value.action)} Review for ${reviewModal.value.type} ${
          reviewModal.value.title
        }`
      );
      showModalFlag.value = false;
      showPreviewFlag.value = false;
      tableRef.value.reload();
    });
  };
  const handleViewAction = (to: ReviewStatus, action: ReviewAction) => {
    reviewVo.value.action = action;
    reviewVo.value.to = to;
    showModalFlag.value = true;
  };
</script>

<style scoped></style>
