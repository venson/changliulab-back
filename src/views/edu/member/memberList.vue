<template>
  <n-card>
    <n-tooltip placement="top-start" trigger="hover">
      <template #trigger>
        <n-button type="success" class="my-1" size="small" @click="addMember">
          <n-icon> <PlusOutlined /> </n-icon>
        </n-button>
      </template>
      Add New Member
    </n-tooltip>
    <BTable :columns="fullColumns" :data-request="dataRequest" />
    <memberModal v-model:show="showModalFlag" :member="member" />
  </n-card>
</template>

<script setup lang="ts">
  import { MemberInterface, MemberLevel, MemberQueryInterface } from '@/common/types';
  import { BTable } from '@/components/BTable';
  import { memberColumns } from './src/memberColumns';
  import memberModal from './src/memberModal.vue';
  import { usePermission } from '@/hooks/web/usePermission';
  import { computed, h, ref } from 'vue';
  import { PlusOutlined } from '@vicons/antd';
  import { DataTableColumn, DataTableColumns, NButton, NIcon, NTooltip } from 'naive-ui';
  import { DeleteFilled, EditFilled } from '@vicons/antd';
  import { getPageMember } from '@/api/edu/member';
  const showModalFlag = ref(false);
  const member = ref<MemberInterface>();
  const { hasPermission } = usePermission();
  const tableActionFlag = computed(() =>
    hasPermission(['member.add', 'member.edit', 'member.list'])
  );
  const condition = ref<MemberQueryInterface>({});
  const dataRequest = async (res: { current: number; size: number }) =>
    await getPageMember(res.current, res.size, condition.value);
  const tableAction: DataTableColumn<MemberInterface> = {
    title: 'Actions',
    key: 'action',
    align: 'center',
    render(row) {
      return [
        // hasPermission(['member.edit'])
        //   ? h(
        //       NButton,
        //       { size: 'small', onClick: () => editMember(row), type: 'primary', class: 'mx-1' },
        //       { default: () => h(NIcon, null, { default: () => h(EditFilled) }) }
        //     )
        //   : null,
        hasPermission(['member.edit'])
          ? h(
              NTooltip,
              { trigger: 'hover', placement: 'top-end' },
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      size: 'small',
                      onClick: () => editMember(row),
                      type: 'primary',
                      class: 'mx-1',
                    },
                    { default: () => h(NIcon, null, { default: () => h(EditFilled) }) }
                  ),
                default: () => 'Edit Member',
              }
            )
          : null,
        hasPermission(['member.remove'])
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
                      onClick: () => removeMember(row),
                      type: 'error',
                      class: 'mx-1',
                    },
                    { default: () => h(NIcon, null, { default: () => h(DeleteFilled) }) }
                  ),
                default: () => 'Remove Member',
              }
            )
          : null,
      ];
    },
  };

  const fullColumns = computed(() => {
    let columns: DataTableColumns<MemberInterface> = [...memberColumns];
    if (tableActionFlag.value) {
      columns.push(tableAction);
    }
    return columns;
  });
  const addMember = () => {
    (member.value = { name: '', level: MemberLevel.INTERN }), (showModalFlag.value = true);
  };
  const editMember = (row: MemberInterface) => {
    member.value = row;
    showModalFlag.value = true;
    // console.log(row);
  };
  const removeMember = (row: MemberInterface) => {
    console.log(row);
  };
</script>

<style scoped></style>
