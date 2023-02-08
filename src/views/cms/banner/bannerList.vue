<template>
  <n-card>
    <n-tooltip placement="top-start" trigger="hover">
      <template #trigger>
        <n-button type="success" class="my-1" size="small" @click="addBanner">
          <n-icon> <PlusOutlined /> </n-icon>
        </n-button>
      </template>
      Add New Banner
    </n-tooltip>
    <BTable :columns="fullColumns" :data-request="dataRequest" />
    <bannerModal v-model:show="showModalFlag" :banner="banner" @save="saveBannerModal" />
  </n-card>
</template>

<script setup lang="ts">
  import { BannerInterface } from '@/common/types';
  import { BTable } from '@/components/BTable';
  import { bannerColumns } from './src/bannerColumns';
  import bannerModal from './src/bannerModal.vue';
  import { usePermission } from '@/hooks/web/usePermission';
  import { computed, h, ref } from 'vue';
  import { PlusOutlined } from '@vicons/antd';
  import {
    DataTableColumn,
    DataTableColumns,
    NButton,
    NIcon,
    NTooltip,
    NCard,
    NSwitch,
    useMessage,
  } from 'naive-ui';
  import { DeleteFilled, EditFilled } from '@vicons/antd';
  import { getPageBanner, updateBanner, addCmsBanner, switchBanner } from '@/api/edu/banner';
  const showModalFlag = ref(false);
  const banner = ref<BannerInterface>();
  const { hasPermission } = usePermission();
  const message = useMessage();
  const tableActionFlag = computed(() =>
    hasPermission(['banner.add', 'banner.edit', 'banner.list'])
  );
  const tableSwitchFlag = computed(() => hasPermission(['banner.switch']));
  const dataRequest = async (res: { current: number; size: number }) =>
    await getPageBanner(res.current, res.size);
  const tableAction: DataTableColumn<BannerInterface> = {
    title: 'Actions',
    key: 'action',
    align: 'center',
    width: 80,
    minWidth: 80,
    maxWidth: 80,
    render(row) {
      return [
        hasPermission(['banner.edit'])
          ? h(
              NTooltip,
              { trigger: 'hover', placement: 'top-end' },
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      size: 'small',
                      onClick: () => editBanner(row),
                      type: 'primary',
                      class: 'mx-1',
                    },
                    { default: () => h(NIcon, null, { default: () => h(EditFilled) }) }
                  ),
                default: () => 'Edit Banner',
              }
            )
          : null,
        hasPermission(['banner.remove'])
          ? h(
              NTooltip,
              {
                trigger: 'hover',
                placement: 'top-end',
              },
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      size: 'small',
                      onClick: () => removeBanner(row),
                      type: 'error',
                      class: 'mx-1',
                    },
                    { default: () => h(NIcon, null, { default: () => h(DeleteFilled) }) }
                  ),
                default: () => 'Remove Banner',
              }
            )
          : null,
      ];
    },
  };

  const tableSwitch: DataTableColumn<BannerInterface> = {
    title: 'Status',
    key: 'enable',
    align: 'center',
    width: 80,
    minWidth: 80,
    maxWidth: 80,
    render(row) {
      return [
        h(NSwitch, {
          value: row.enable,
          'onUpdate:value': (value: boolean) => {
            row.enable = value;
            row.id &&
              switchBanner(row.id).then(() =>
                message.success(`Banner ${row.title} ${row.enable ? 'enabled' : 'disabled'}`)
              );
            console.log(row);
          },
        }),
      ];
    },
  };
  const fullColumns = computed(() => {
    let columns: DataTableColumns<BannerInterface> = [...bannerColumns];
    if (tableSwitchFlag.value) {
      columns.push(tableSwitch);
    }
    if (tableActionFlag.value) {
      columns.push(tableAction);
    }
    return columns;
  });
  const addBanner = () => {
    banner.value = { enable: false };
    showModalFlag.value = true;
  };
  const editBanner = (row: BannerInterface) => {
    banner.value = row;
    showModalFlag.value = true;
    // console.log(row);
  };
  const removeBanner = (row: BannerInterface) => {
    console.log(row);
  };
  const saveBannerModal = (banner: BannerInterface) => {
    if (banner.id) {
      console.log('update', banner);
      updateBanner(banner.id, banner).then(() => {
        message.success('Banner ' + banner.title + ' updated');
        showModalFlag.value = false;
      });
    } else {
      console.log('add', banner);
      addCmsBanner(banner).then(() => {
        message.success('New Banner Added');
        showModalFlag.value = false;
      });
    }
  };
</script>

<style scoped></style>
