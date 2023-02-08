<template>
  <KeepAlive>
    <n-card>
      <BTable ref="tableRef" :columns="fullColumns" :data-request="dataRequest" />
      <HtmlViewModal
        v-model:show="showPreviewFlag"
        :reviewed="researchPreview.publishedHtmlBrBase64"
        :modified="researchPreview.htmlBrBase64"
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
  import { ReviewModal } from '@/components/ReviewModal';
  import { HtmlViewModal } from '@/components/HtmlViewModal';
  import { getPageResearchReview, getResearchViewById } from '@/api/edu/research';
  import {
    ResearchInterface,
    ReviewAction,
    ReviewModalInterface,
    ReviewStatus,
    ReviewType,
    ReviewVo,
    PreviewInterface,
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
  import { researchColumns } from './src/researchColumns';
  import { doReviewAction } from '@/api/edu/review';
  import { capitalized } from '@/utils/string/capitalized';
  const { hasPermission } = usePermission();
  const tableRef = ref();

  const showPreviewFlag = ref(false);
  const showModalFlag = ref(false);
  const researchPreview = ref<PreviewInterface>({});
  const message = useMessage();
  const tableActionFlag = computed(() =>
    hasPermission(['research.review.pass', 'research.review.reject'])
  );
  const tableAction: DataTableColumn<ResearchInterface> = {
    title: 'Action',
    key: 'action',
    align: 'center',
    render(row) {
      return [
        hasPermission(['research.review.pass'])
          ? h(
              NTooltip,
              { trigger: 'hover' },
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      size: 'small',
                      onClick: () => reviewResearch(row),
                      type: 'info',
                      class: 'mx-1',
                    },
                    { default: () => h(NIcon, null, { default: () => h(EyeFilled) }) }
                  ),
                default: () => 'Review Content',
              }
            )
          : null,
        hasPermission(['research.review.reject'])
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
                      onClick: () => rejectResearch(row),
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
    const columns: DataTableColumns<ResearchInterface> = [...researchColumns];
    if (tableActionFlag.value) {
      columns.push(tableAction);
    }
    return columns;
  });
  const dataRequest = async (res: { current: number; size: number }) =>
    await getPageResearchReview(res.current, res.size);

  const reviewResearch = (row: ResearchInterface) => {
    getResearchViewById(row.id!).then((res: PreviewInterface) => {
      researchPreview.value = res;
      reviewVo.value.id = row.id;
      showPreviewFlag.value = true;
    });
  };
  const rejectResearch = (row: ResearchInterface) => {
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
    type: ReviewType.RESEARCH,
    msg: '',
  });
  const reviewModal = computed<ReviewModalInterface>(() => {
    return {
      title: researchPreview.value.title,
      type: ReviewType.RESEARCH,
      action: reviewVo.value.action,
    };
  });
  const handleReviewConfirm = (value: string) => {
    reviewVo.value.msg = value;
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
