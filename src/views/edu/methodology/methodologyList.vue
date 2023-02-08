<template>
  <n-card>
    <n-tooltip placement="top-start" trigger="hover">
      <template #trigger>
        <n-button class="my-1" size="small" @click="newMethodology">
          <n-icon> <PlusOutlined /> </n-icon>
        </n-button>
      </template>
      Add New methodology
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
    getMethodologyList,
    getMethodologyViewById,
    switchMethodologyEnableById,
  } from '@/api/edu/methodology';
  import { ReviewModal } from '@/components/ReviewModal';
  import { useRouter } from 'vue-router';
  import { methodologyColumns } from './src/methodologyColumns';
  import { HtmlViewModal } from '@/components/HtmlViewModal';
  // import { activityColumns } from './src/activityColumns';
  import { BTable } from '@/components/BTable';
  import {
    PageParamInterface,
    MethodologyInterface,
    ReviewAction,
    ReviewModalInterface,
    ReviewVo,
    PreviewInterface,
    ReviewType,
    ReviewStatus,
  } from '@/common/types';
  import { usePermission } from '@/hooks/web/usePermission';
  import { computed, h, ref } from 'vue';
  import { DataTableColumn, NButton, NIcon, NSwitch, NTooltip, useMessage } from 'naive-ui';
  import { DeleteFilled, EditFilled, EyeFilled, PlusOutlined } from '@vicons/antd';
  // import { base64ToBytes } from '@/utils/base64';
  import { useUserStore } from '@/store/modules/user';
  import { doReviewAction } from '@/api/edu/review';
  import { capitalized } from '@/utils/string/capitalized';
  const tableRef = ref();
  const message = useMessage();
  const showModalFlag = ref(false);
  const reviewedHtml = ref<string>('No content');
  const modifiedHtml = ref<string>('No content');
  const user = useUserStore();
  const reviewModal = ref<ReviewModalInterface>({
    title: '',
    type: ReviewType.METHODOLOGY,
    action: ReviewAction.REQUEST,
  });
  const reviewVo = ref<ReviewVo>({
    userId: user.id,
    userName: user.username,
    action: ReviewAction.REQUEST,
    to: ReviewStatus.APPLIED,
    type: ReviewType.METHODOLOGY,
    msg: '',
  });
  const router = useRouter();
  const showViewFlag = ref(false);
  const { hasPermission } = usePermission();
  const tableActionFlag = computed(() =>
    hasPermission(['methodology.view', 'methodology.edit', 'methodology.remove'])
  );
  const tableEnableFlag = computed(() => hasPermission(['methodology.enable']));
  const tableEnableColumn: DataTableColumn<MethodologyInterface> = {
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
              switchMethodologyEnableById(row.id, row.language)
                .then(() => {
                  message.success(
                    `Methodology ${row.title} ${row.enable ? 'enabled' : 'disabled'}`
                  );
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
  const tableActionColumn: DataTableColumn<MethodologyInterface> = {
    title: 'Actions',
    key: 'action',
    width: 100,
    align: 'center',
    render(row) {
      return [
        hasPermission(['methodology.view'])
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
                      class: 'm-1',
                      onClick: () => viewMethodology(row),
                    },
                    {
                      default: () => h(NIcon, null, { default: () => h(EyeFilled) }),
                    }
                  ),
                default: () => 'View Methodology',
              }
            )
          : null,
        hasPermission(['methodology.edit'])
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
                      class: 'm-1',
                      onClick: () => editMethodology(row),
                    },
                    {
                      default: () => h(NIcon, null, { default: () => h(EditFilled) }),
                    }
                  ),
                default: () => 'Edit Methodology',
              }
            )
          : null,
        hasPermission(['methodology.remove'])
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
                        class: 'm-1',
                        onClick: () => removeMethodology(row),
                      },
                      { default: () => h(NIcon, null, { default: () => h(DeleteFilled) }) }
                    ),
                  default: () => 'Remove Methodology',
                }
              )
            )
          : null,
      ];
    },
  };
  const fullColumns = computed(() => {
    const columns = [...methodologyColumns];
    if (tableEnableFlag.value) {
      columns.push(tableEnableColumn);
    }
    if (tableActionFlag.value) {
      columns.push(tableActionColumn);
    }
    return columns;
  });
  const viewMethodology = (row) => {
    getMethodologyViewById(row.id).then((res: PreviewInterface) => {
      modifiedHtml.value = res.htmlBrBase64!;
      reviewedHtml.value = res.publishedHtmlBrBase64!;
      reviewModal.value.id = row.id;
      reviewModal.value.title = row.title;
      reviewVo.value.from = res.review;
      reviewVo.value.id = row.id;
      showViewFlag.value = true;
    });
  };
  const editMethodology = (row: MethodologyInterface) => {
    router.push({ path: `${row.id}` });
  };
  const removeMethodology = (row: MethodologyInterface) => {
    console.log(row);
  };
  const dataRequest = async (page: PageParamInterface) =>
    await getMethodologyList(page.current, page.size);
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
  const newMethodology = () => {
    router.push({ path: 'new' });
  };
</script>
