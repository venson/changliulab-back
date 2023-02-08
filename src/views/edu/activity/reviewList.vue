<template>
  <KeepAlive>
    <n-card>
      <BTable ref="tableRef" :columns="fullColumns" :data-request="dataRequest" />
      <HtmlViewModal
        v-model:show="showPreviewFlag"
        :reviewed="activityPreview.publishedHtmlBrBase64"
        :modified="activityPreview.htmlBrBase64"
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
  import { getActivityPreviewById, getPageActivity } from '@/api/edu/activity';
  import { doReviewAction } from '@/api/edu/review';
  import {
    ActivityInterface,
    PageType,
    PreviewInterface,
    ReviewAction,
    ReviewModalInterface,
    ReviewStatus,
    ReviewType,
    ReviewVo,
  } from '@/common/types';
  import { BTable } from '@/components/BTable';
  import { usePermission } from '@/hooks/web/usePermission';
  import { useUserStore } from '@/store/modules/user';
  import { capitalized } from '@/utils/string/capitalized';
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
  import { useRouter } from 'vue-router';
  import { activityColumns } from './src/activityColumns';
  const router = useRouter();
  const tableRef = ref();
  const message = useMessage();
  const user = useUserStore();

  const showPreviewFlag = ref(false);
  const showModalFlag = ref(false);
  const activityPreview = ref<PreviewInterface>({});
  const { hasPermission } = usePermission();
  const tableActionFlag = computed(() =>
    hasPermission(['activity.review.pass', 'activity.review.reject'])
  );
  const tableAction: DataTableColumn<ActivityInterface> = {
    title: 'Action',
    key: 'action',
    align: 'center',
    render(row) {
      return [
        hasPermission(['activity.review.pass'])
          ? h(
              NTooltip,
              { trigger: 'hover' },
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      size: 'small',
                      onClick: () => reviewActivity(row),
                      type: 'info',
                      class: 'mx-1',
                    },
                    { default: () => h(NIcon, null, { default: () => h(EyeFilled) }) }
                  ),
                default: () => 'Review Content',
              }
            )
          : null,
        hasPermission(['activity.review.reject'])
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
                      onClick: () => rejectActivity(row),
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
    const columns: DataTableColumns<ActivityInterface> = [...activityColumns];
    if (tableActionFlag.value) {
      columns.push(tableAction);
    }
    return columns;
  });

  const reviewVo = ref<ReviewVo>({
    userId: user.id,
    userName: user.username,
    from: ReviewStatus.APPLIED,
    to: ReviewStatus.REJECTED,
    action: ReviewAction.REJECT,
    type: ReviewType.ACTIVITY,
    msg: '',
  });
  const handleViewAction = (to: ReviewStatus, action: ReviewAction) => {
    reviewVo.value.action = action;
    reviewVo.value.to = to;
    showModalFlag.value = true;
  };
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
  const reviewModal = computed<ReviewModalInterface>(() => {
    return {
      title: activityPreview.value.title,
      type: ReviewType.ACTIVITY,
      action: reviewVo.value.action,
    };
  });
  const dataRequest = async (res: { current: number; size: number }) =>
    await getPageActivity(res.current, res.size, PageType.REVIEW);
  const reviewActivity = (row: ActivityInterface) => {
    getActivityPreviewById(row.id!).then((res: PreviewInterface) => {
      activityPreview.value = res;
      reviewVo.value.id = row.id;
      showPreviewFlag.value = true;
    });
    router.push({ path: `review/${row.id}` });
    console.log(row);
  };
  const rejectActivity = (row: ActivityInterface) => {
    console.log(row);
  };
</script>

<style scoped></style>
