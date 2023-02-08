<template>
  <n-card>
    <n-tooltip placement="top-start" trigger="hover">
      <template #trigger>
        <n-button class="my-1" size="small" @click="newResearch">
          <n-icon> <PlusOutlined /> </n-icon>
        </n-button>
      </template>
      Add New Research
    </n-tooltip>
    <BTable ref="tableRef" :data-request="dataRequest" :columns="fullColumns" />
    <HtmlViewModal
      v-model:show="showViewFlag"
      :reviewed="reviewedHtml"
      :modified="modifiedHtml"
      mode="preview"
      @action="handleViewAction"
    />
    <ReviewModal v-model:show="showModalFlag" :review="reviewModal" @action="handleConfirmAction" />
  </n-card>
</template>
<script lang="ts" setup>
  import {
    getResearchList,
    getResearchViewById,
    removeResearchById,
    switchResearchEnableById,
  } from '@/api/edu/research';
  import { ReviewModal } from '@/components/ReviewModal';
  import { HtmlViewModal } from '@/components/HtmlViewModal';
  import { useRouter } from 'vue-router';
  import { researchColumns } from './src/researchColumns';
  // import { activityColumns } from './src/activityColumns';
  import { BTable } from '@/components/BTable';
  import {
    PageParamInterface,
    ResearchInterface,
    ReviewAction,
    ReviewModalInterface,
    ReviewStatus,
    ReviewType,
    ReviewVo,
    PreviewInterface,
  } from '@/common/types';
  import { usePermission } from '@/hooks/web/usePermission';
  import { computed, h, ref } from 'vue';
  import { capitalized } from '@/utils/string/capitalized';
  import { DataTableColumn, NButton, NIcon, NSwitch, NTooltip, useMessage } from 'naive-ui';
  import { DeleteFilled, EditFilled, EyeFilled, PlusOutlined } from '@vicons/antd';
  import { useUserStore } from '@/store/modules/user';
  import { doReviewAction } from '@/api/edu/review';
  const tableRef = ref();
  const message = useMessage();
  const reviewedHtml = ref<string>();
  const modifiedHtml = ref<string>();
  const user = useUserStore();
  const showModalFlag = ref(false);
  const reviewModal = ref<ReviewModalInterface>({
    title: '',
    type: ReviewType.RESEARCH,
    action: ReviewAction.REQUEST,
  });
  const reviewVo = ref<ReviewVo>({
    userId: user.id,
    userName: user.username,
    action: ReviewAction.REQUEST,
    to: ReviewStatus.APPLIED,
    type: ReviewType.RESEARCH,
    msg: '',
  });
  const showViewFlag = ref(false);
  const router = useRouter();
  const { hasPermission } = usePermission();
  const tableActionFlag = computed(() =>
    hasPermission(['research.view', 'research.edit', 'research.remove'])
  );
  const tableEnableFlag = computed(() => hasPermission(['research.enable']));
  const tableEnableColumn: DataTableColumn<ResearchInterface> = {
    title: 'Enable',
    key: 'enable',
    width: 40,
    align: 'center',
    render(row) {
      return [
        h(NSwitch, {
          value: row.enable,
          disabled: row.buttonDisabled,
          'onUpdate:value': (value: boolean) => {
            if (row.id && row.language) {
              row.enable = value;
              row.buttonDisabled = true;
              switchResearchEnableById(row.id, row.language)
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
  const tableActionColumn: DataTableColumn<ResearchInterface> = {
    title: 'Actions',
    key: 'action',
    width: 100,
    align: 'center',
    render(row) {
      return [
        hasPermission(['research.view'])
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
                      onClick: () => viewResearch(row),
                    },
                    {
                      default: () => h(NIcon, null, { default: () => h(EyeFilled) }),
                    }
                  ),
                default: () => 'View Research',
              }
            )
          : null,
        hasPermission(['research.edit'])
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
                      onClick: () => editResearch(row),
                    },
                    {
                      default: () => h(NIcon, null, { default: () => h(EditFilled) }),
                    }
                  ),
                default: () => 'Edit Research',
              }
            )
          : null,
        hasPermission(['research.remove'])
          ? h(
              h(
                NTooltip,
                {
                  trigger: 'hover',
                },
                {
                  trigger: () =>
                    h(
                      NButton,
                      {
                        type: 'error',
                        size: 'small',
                        class: 'mx-1',
                        onClick: () => removeResearch(row),
                      },
                      { default: () => h(NIcon, null, { default: () => h(DeleteFilled) }) }
                    ),
                  default: () => 'Remove Research',
                }
              )
            )
          : null,
      ];
    },
  };
  const fullColumns = computed(() => {
    const columns = [...researchColumns];
    if (tableEnableFlag.value) {
      columns.push(tableEnableColumn);
    }
    if (tableActionFlag.value) {
      columns.push(tableActionColumn);
    }
    return columns;
  });
  const viewResearch = async (row: ResearchInterface) => {
    getResearchViewById(row.id!).then((res: PreviewInterface) => {
      modifiedHtml.value = res.htmlBrBase64!;
      reviewedHtml.value = res.publishedHtmlBrBase64!;
      reviewModal.value.id = row.id;
      reviewModal.value.title = row.title;
      reviewVo.value.from = res.review;
      reviewVo.value.id = row.id;
      showViewFlag.value = true;
    });
  };
  const editResearch = (row: ResearchInterface) => {
    router.push({ path: `${row.id}` });
  };
  const removeResearch = (row: ResearchInterface) => {
    removeResearchById(row.id!).then(() => message.success(`Research ${row.title} deleted.`));
    console.log(row);
  };
  const dataRequest = async (page: PageParamInterface) =>
    await getResearchList(page.current, page.size);
  const handleViewAction = () => {
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
  const newResearch = () => {
    router.push({ path: 'new' });
  };
</script>
