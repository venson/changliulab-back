<template>
  <n-data-table
    remote
    :loading="loading"
    :columns="columns"
    :data="tableData"
    :pagination="paginationReactive"
    :single-line="false"
  >
    <template #empty> <div>No Data</div> </template>
  </n-data-table>
</template>

<script setup lang="ts">
  import { DataTableColumn } from 'naive-ui/lib/components';
  // import { DataTableColumn } from 'naive-ui/lib/data-table';
  import { defineComponent, onMounted, reactive, ref } from 'vue';

  const props = defineProps({
    dataRequest: { type: Function as PropType<(...arg: any[]) => Promise<any>>, required: true },
    columns: [Array] as PropType<DataTableColumn<any>[]>,
  });
  // const condition = ref<any>({});
  const loading = ref(true);
  const tableData = ref();
  const paginationReactive = reactive({
    page: 1,
    pageSize: 10,
    pageCount: 0,
    itemCount: 0,
    showSizePicker: true, //每页显示选项
    pageSizes: [2, 3, 5],
    onChange: (page: number) => {
      //切换第几页时
      paginationReactive.page = page;
      // fetch(condition.value);
      fetch();
    },
    onUpdatePageSize: (pageSize: number) => {
      console.log('pagesize', pageSize);
      paginationReactive.pageSize = pageSize;
      paginationReactive.page = 1;
      // fetch(condition.value);
      fetch();
    },
  });
  // const fetch = async (condition?: string) => {
  const fetch = async () => {
    try {
      setLoading(true);
      console.log(props.dataRequest);
      let params = {
        current: paginationReactive.page,
        size: paginationReactive.pageSize,
        // condition: condition,
      };
      const res = await props.dataRequest(params);
      // const res;
      console.log(res);
      tableData.value = res.records;
      console.log(tableData.value);
      paginationReactive.itemCount = res.total;
      paginationReactive.pageCount = res.pages;
    } catch (error) {
      console.log(error);
      tableData.value = [];
      paginationReactive.itemCount = 0;
      paginationReactive.pageCount = 0;
    } finally {
      setLoading(false);
    }
  };
  // const reload = async (condition?: string) => {
  const reload = async () => {
    // await fetch(condition);
    await fetch();
  };
  defineExpose({ reload });
  const setLoading = (status: boolean) => (loading.value = status);
  onMounted(() => {
    console.log(paginationReactive.page);
    fetch();
  });
</script>
<script lang="ts">
  export default defineComponent({
    name: 'BTable',
  });
</script>

<style scoped></style>
