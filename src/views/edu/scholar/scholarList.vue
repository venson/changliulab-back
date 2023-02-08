<template>
  <n-card>
    <div>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button class="my-1" type="success" @click="addScholarButton">
            <n-icon>
              <PlusCircleFilled />
            </n-icon>
          </n-button>
        </template>
        Add New Scholar
      </n-tooltip>
      <BTable :columns="fullColumns" :data-request="dataRequest" />
      <schoarlModal v-model:show="showModalFlag" v-model:value="scholar" @save="handleSave" />
    </div>
  </n-card>
</template>

<script setup lang="ts">
  import { BTable } from '@/components/BTable';
  import { scholarColumns } from './src/scholarColumns';
  import { DataTableColumn, NButton, NIcon, NTooltip, useMessage } from 'naive-ui';
  import { usePermission } from '@/hooks/web/usePermission';
  import { computed, h, ref } from 'vue';
  import { ScholarInterface, PageParamInterface, ScholarQueryInterface } from '@/common/types';
  import { DeleteFilled, EditFilled, PlusCircleFilled } from '@vicons/antd';
  import {
    addScholar,
    getPageScholar,
    getScholarById,
    removeScholarById,
    updateScholar,
  } from '@/api/edu/scholar';
  import schoarlModal from './src/scholarModal.vue';
  const { hasPermission } = usePermission();
  const tableActionFlag = computed(() => hasPermission(['scholar.edit', 'scholar.remove']));
  const scholarQuery = ref<ScholarQueryInterface>();
  const message = useMessage();
  const actionColumn: DataTableColumn<ScholarInterface> = {
    title: 'Action',
    key: 'action',
    align: 'center',
    width: '140',
    render(row) {
      return [
        hasPermission(['scholar.edit'])
          ? h(
              NTooltip,
              { trigger: 'hover' },
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      size: 'small',
                      onClick: () => editScholar(row),
                      type: 'success',
                      class: 'mx-1',
                    },
                    { default: () => h(NIcon, null, { default: () => h(EditFilled) }) }
                  ),
                default: () => 'Edit Scholar',
              }
            )
          : null,
        hasPermission(['scholar.remove'])
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
                      onClick: () => removeScholar(row),
                    },
                    { default: () => h(NIcon, null, { default: () => h(DeleteFilled) }) }
                  ),
                default: () => 'Remove Scholar',
              }
            )
          : null,
      ];
    },
  };
  const fullColumns = computed(() => {
    const columns = [...scholarColumns];
    if (tableActionFlag.value) {
      columns.push(actionColumn);
    }
    return columns;
  });
  const showModalFlag = ref(false);
  const scholar = ref<ScholarInterface>({
    title: '',
  });
  const addScholarButton = () => {
    scholar.value = {
      title: '',
    };
    showModalFlag.value = true;
  };
  const editScholar = (row: ScholarInterface) => {
    if (row.id) {
      getScholarById(row.id).then((res) => {
        scholar.value = res;
        // console.log(scholar);
        showModalFlag.value = true;
      });
    }
  };
  const dataRequest = async (res: PageParamInterface) =>
    await getPageScholar(res.current, res.size, scholarQuery.value);
  const removeScholar = (scholar: ScholarInterface) => {
    console.log(scholar);
    scholar.id &&
      removeScholarById(scholar.id).then(() => {
        message.success(`Scholar ${scholar.title} was Removed`);
      });
  };
  const handleSave = () => {
    console.log('scholar', scholar);
    if (scholar.value.id) {
      updateScholar(scholar.value).then(() => {
        message.success(`Scholar ${scholar.value.title} updated`);
      });
    } else
      addScholar(scholar.value).then(() => {
        message.success(`Scholar ${scholar.value.title} added`);
      });
  };
</script>

<style scoped></style>
