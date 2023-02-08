<template>
  <KeepAlive>
    <n-card>
      <n-tooltip placement="top-start" trigger="hover">
        <template #trigger>
          <n-button class="my-1" size="small" @click="addActivity">
            <n-icon> <PlusOutlined /> </n-icon>
          </n-button>
        </template>
        Add New Activity
      </n-tooltip>
      <BTable ref="tableRef" :columns="fullColumns" :data-request="dataRequest" />
      <HtmlViewModal
        v-model:show="showPreviewFlag"
        :reviewed="reviewedHtml"
        :modified="modifiedHtml"
        mode="preview"
        @action="handlePreviewAction"
      />
      <ReviewModal
        v-model:show="showModalFlag"
        :review="reviewModal"
        @action="handleConfirmAction"
      />
    </n-card>
  </KeepAlive>
</template>

<script setup lang="ts">
  import { ref, computed, h } from 'vue';
  import { BTable } from '@/components/BTable';
  import { activityColumns } from './src/activityColumns';
  import {
    getActivityPreviewById,
    getPageActivity,
    removeActivityById,
    switchActivityEnableById,
  } from '@/api/edu/activity';
  import { usePermission } from '@/hooks/web/usePermission';
  import {
    ActivityInterface,
    ActivityQuery,
    PageType,
    PreviewInterface,
    ReviewAction,
    ReviewModalInterface,
    ReviewStatus,
    ReviewType,
    ReviewVo,
  } from '@/common/types';
  import {
    DataTableColumn,
    DataTableColumns,
    NButton,
    NIcon,
    NSwitch,
    NTooltip,
    useMessage,
  } from 'naive-ui';
  import { DeleteFilled, EditFilled, EyeFilled, PlusOutlined } from '@vicons/antd';
  import { useRouter } from 'vue-router';
  import { ReviewModal } from '@/components/ReviewModal';
  import { useUserStore } from '@/store/modules/user';
  import { doReviewAction } from '@/api/edu/review';
  import { capitalized } from '@/utils/string/capitalized';
  const { hasPermission } = usePermission();
  const reviewedHtml = ref<string>();
  const modifiedHtml = ref<string>();
  const user = useUserStore();
  const showModalFlag = ref(false);
  const showPreviewFlag = ref(false);
  const reviewModal = ref<ReviewModalInterface>({
    title: '',
    type: ReviewType.ACTIVITY,
    action: ReviewAction.REQUEST,
  });
  const reviewVo = ref<ReviewVo>({
    userId: user.id,
    userName: user.username,
    action: ReviewAction.REQUEST,
    to: ReviewStatus.APPLIED,
    type: ReviewType.ACTIVITY,
    msg: '',
  });
  const condition = ref<ActivityQuery>();
  const router = useRouter();
  const tableRef = ref();
  const dataRequest = async (res) =>
    await getPageActivity(res.current, res.size, PageType.NORMAL, condition.value);
  const tableActionFlag = computed(() => hasPermission(['activity.edit', 'activity.remove']));
  const tableAction: DataTableColumn<ActivityInterface> = {
    title: 'Action',
    key: 'action',
    align: 'center',
    render(row) {
      return [
        hasPermission(['activity.preview'])
          ? h(
              NTooltip,
              {
                trigger: 'hover',
              },
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      size: 'small',
                      type: 'info',
                      class: 'mx-1',
                      onClick: () => previewActivity(row),
                    },
                    {
                      default: () => h(NIcon, null, { default: () => h(EyeFilled) }),
                    }
                  ),
                default: () => 'View Research',
              }
            )
          : null,
        hasPermission(['activity.edit'])
          ? h(
              NTooltip,
              { trigger: 'hover' },
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      size: 'small',
                      onClick: () => editActivity(row),
                      type: 'info',
                      class: 'mx-1',
                    },
                    { default: () => h(NIcon, null, { default: () => h(EditFilled) }) }
                  ),
                default: () => 'Edit Activity',
              }
            )
          : null,
        hasPermission(['activity.remove'])
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
                      onClick: () => removeActivity(row),
                    },
                    { default: () => h(NIcon, null, { default: () => h(DeleteFilled) }) }
                  ),
                default: () => 'Remove Activity',
              }
            )
          : null,
      ];
    },
  };
  const tableEnableFlag = computed(() => hasPermission(['research.enable']));
  const tableEnableColumn: DataTableColumn<ActivityInterface> = {
    title: 'Enable',
    key: 'enable',
    width: 40,
    align: 'center',
    render(row) {
      return [
        h(NSwitch, {
          value: row.enable,
          disabled: row.buttonDisabled || !row.isPublished,
          'onUpdate:value': (value: boolean) => {
            if (row.id) {
              row.enable = value;
              row.buttonDisabled = true;
              switchActivityEnableById(row.id)
                .then(() => {
                  message.success(`Research ${row.title} ${row.enable ? 'enabled' : 'disabled'}`);
                })
                .finally(() => {
                  setTimeout(() => {
                    tableRef.value.reload();
                    row.buttonDisabled = false;
                  }, 1000);
                });
            }
            console.log(row);
          },
        }),
      ];
    },
  };
  const fullColumns = computed(() => {
    let columns: DataTableColumns<ActivityInterface> = [...activityColumns];
    if (tableEnableFlag.value) {
      columns.push(tableEnableColumn);
    }
    if (tableActionFlag.value) {
      columns.push(tableAction);
    }
    return columns;
  });
  const addActivity = () => {
    router.push({ path: 'new' });
  };
  const editActivity = (row: ActivityInterface) => {
    router.push({ path: `${row.id}` });
  };
  const message = useMessage();
  const removeActivity = (row: ActivityInterface) => {
    row.id &&
      removeActivityById(row.id).then(() => {
        message.success(`Acitivty ${row.title} removed`);
        tableRef.value.reload();
      });
    console.log(row);
  };
  const previewActivity = (row: ActivityInterface) => {
    getActivityPreviewById(row.id!).then((res: PreviewInterface) => {
      modifiedHtml.value = res.htmlBrBase64!;
      // console.log(modifiedHtml.value);
      // reviewedHtml.value = res.publishedHtmlBrBase64!;
      // console.log(reviewedHtml.value);
      reviewModal.value.id = row.id;
      reviewModal.value.title = row.title;
      reviewVo.value.from = res.review;
      reviewVo.value.id = row.id;
      showPreviewFlag.value = true;
    });
  };
  const handlePreviewAction = () => {
    showModalFlag.value = true;
  };
  const handleConfirmAction = (value: string) => {
    reviewVo.value.msg = value;
    doReviewAction(reviewVo.value).then(() => {
      showModalFlag.value = false;
      message.success(
        `${capitalized(reviewVo.value.action)} Review for ${reviewModal.value.type} ${
          reviewModal.value.title
        }`
      );
      tableRef.value.reload();
    });
  };
</script>

<style scoped></style>
