<template>
  <n-modal class="w-3/4" v-model:show="showModalFlag" preset="card" title="Scholar">
    <div>
      <n-form
        :model="scholarDetail"
        label-placement="left"
        label-width="auto"
        size="small"
        :show-feedback="false"
      >
        <n-grid>
          <n-form-item-gi :span="22" class="py-1 w-full" label="Title">
            <n-input v-model:value="scholarDetail.title" />
          </n-form-item-gi>
          <n-form-item-gi :span="2"
            ><GoogleScholar class="w-8 h-8" :href="scholarDetail.googleLink" target="_blank" />
            <n-button text @click="showGoogleScholarLink = !showGoogleScholarLink">
              <n-icon>
                <EditFilled />
              </n-icon>
            </n-button>
          </n-form-item-gi>
        </n-grid>
        <n-form-item
          v-show="showGoogleScholarLink || !scholarDetail.id"
          class="py-1 w-full"
          label="Google"
        >
          <n-input v-model:value="scholarDetail.googleLink" />
        </n-form-item>

        <n-form-item class="py-1 w-full" label="Title Link">
          <n-input v-model:value="scholarDetail.titleLinkUrl" />
        </n-form-item>
        <n-grid>
          <n-form-item-gi :span="8" class="py-1" label="Ex Title">
            <n-input v-model:value="scholarDetail.linkText" />
          </n-form-item-gi>
          <n-form-item-gi :span="16" class="py-1" label="Ex Link">
            <n-input v-model:value="scholarDetail.linkUrl" />
          </n-form-item-gi>
        </n-grid>
        <n-form-item class="py-1" label="Authors">
          <n-input v-model:value="scholarDetail.authors" />
        </n-form-item>
        <n-form-item class="py-1" label="Members">
          <n-select
            v-model:value="scholarDetail.memberIdList"
            multiple
            filterable
            :options="allMemberList"
            label-field="name"
            :render-tag="renderTag"
            value-field="id"
            @update:value="handleMemberSelectUpdate"
          />
        </n-form-item>
        <n-grid :x-gap="1">
          <n-form-item-gi :span="10" class="py-1" label="Journal">
            <n-input v-model:value="scholarDetail.journal" />
          </n-form-item-gi>
          <n-form-item-gi :span="8" class="py-1" label="Publisher">
            <n-input v-model:value="scholarDetail.publisher" />
          </n-form-item-gi>
          <n-form-item-gi :span="6" class="py-1" label="Publication Date">
            <n-date-picker v-model:value="publicationDate" type="month" />
          </n-form-item-gi>
        </n-grid>
        <n-grid>
          <n-form-item-gi :span="8" class="py-1" label="Volume">
            <n-input-number v-model:value="scholarDetail.volume" />
          </n-form-item-gi>
          <n-form-item-gi :span="8" class="py-1" label="Issue">
            <n-input-number v-model:value="scholarDetail.issue" />
          </n-form-item-gi>
          <n-form-item-gi :span="8" class="py-1" label="Pages">
            <n-input v-model:value="scholarDetail.pages" />
          </n-form-item-gi>
        </n-grid>
        <n-form-item class="py-1" label="Description">
          <n-input type="textarea" :rows="7" v-model:value="scholarDetail.description" />
        </n-form-item>
        <n-form-item label="Total Citations">
          <div class="flex-none">
            <div>
              {{ totalCitations }}
            </div>
            <!-- <CitationBarplot v-model:value="scholarDetail.citationList" /> -->
            <CitationBarplot v-model:value="scholarDetail.citationList" />
          </div>
        </n-form-item>
      </n-form>
      <div class="float-right flex space-x-8">
        <n-button type="info" @click="closeModal">Close</n-button>
        <n-button type="success" @click="saveScholar">Save</n-button>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
  import GoogleScholar from '@/components/Icons/GoogleScholar.vue';
  import { getAllFormalMembers } from '@/api/edu/member';
  import {
    MemberInterface,
    MemberScholarInterface,
    ScholarCitationInterface,
    ScholarInterface,
  } from '@/common/types';
  import { NTag, SelectRenderTag } from 'naive-ui';
  import { computed, onMounted, ref, h, watch } from 'vue';
  import { CitationBarplot } from '@/components/CitationBarplot';
  import { SelectBaseOption } from 'naive-ui/es/select/src/interface';
  import { EditFilled } from '@vicons/antd';
  interface ScholarModalInterface {
    show: boolean;
    value: ScholarInterface;
  }
  const emits = defineEmits(['update:show', 'update:value', 'save']);
  const props = defineProps<ScholarModalInterface>();
  const showGoogleScholarLink = ref(false);

  const scholarDetail = computed({
    get: () => props.value,
    set: (value) => {
      console.log('scholarDetail', value);
      emits('update:value', value);
    },
  });

  const showModalFlag = computed({
    get: () => props.show,
    set: () => emits('update:show', false),
  });
  const renderTag: SelectRenderTag = ({ option, handleClose }) => {
    return h(
      NTag,
      {
        type: 'success',
        closable: true,
        onMousedown: (e: FocusEvent) => {
          e.preventDefault();
        },
        onClose: (e: MouseEvent) => {
          e.stopPropagation();
          handleClose();
        },
      },
      { default: () => option.name }
    );
  };
  const now = new Date();
  const presentYear = now.getFullYear();
  watch(
    () => props.show,
    (newVal, oldVal) => {
      if (newVal && !oldVal) {
        if (!scholarDetail.value.id) {
          //   console.log(String(presentYear), String(presentYear) + (now.getMonth() + 1));
          scholarDetail.value.publicationDate = presentYear + '-' + (now.getMonth() + 1);
          scholarDetail.value.citationList = [{ year: presentYear, citations: 1 }];
          return;
        }
        let tempList: ScholarCitationInterface[] = [];
        if (scholarDetail.value.citationList && scholarDetail.value.citationList.length) {
          let citationLength = scholarDetail.value.citationList.length;
          const lastYear = scholarDetail.value.citationList[citationLength - 1].year;
          if (lastYear < presentYear) {
            for (let i = lastYear + 1; i <= presentYear; i++) {
              tempList.push({
                year: i,
                citations: 0,
              });
            }
            scholarDetail.value.citationList = scholarDetail.value.citationList.concat(tempList);
          }
        }

        if (scholarDetail.value.citationList && props.value.year) {
          handleCitationBefore(Number(props.value.year), scholarDetail.value.citationList[0].year);
        }
      }
    }
  );
  const totalCitations = computed(() => {
    const list: number[] = scholarDetail.value.citationList?.map((o) => o.citations) as number[];
    return list?.reduce((partialSum, a) => partialSum + a, 0);
  });
  const publicationDate = computed<number>({
    get: () => {
      let date: Date;
      if (scholarDetail.value.publicationDate) {
        date = new Date(scholarDetail.value.publicationDate);
      } else {
        date = new Date();
      }
      return date.getTime();
    },
    set: (val: number) => {
      const date = new Date(val);
      const dateString = date.getFullYear() + '-' + (date.getMonth() + 1);
      scholarDetail.value.publicationDate = dateString;
      scholarDetail.value.year = date.getFullYear();
      if (scholarDetail.value.citationList) {
        handleCitationBefore(date.getFullYear(), scholarDetail.value.citationList[0].year);
      }
    },
  });
  const handleCitationBefore = (publishYear: number, earlyestYear: number) => {
    if (publishYear < earlyestYear) {
      for (let i = earlyestYear; i >= publishYear; i--) {
        scholarDetail.value.citationList?.unshift({
          year: i,
          citations: 0,
        });
      }
    } else if (publishYear > earlyestYear) {
      for (let i = earlyestYear; i >= publishYear; i++) {
        scholarDetail.value.citationList?.shift();
      }
    }
  };
  const allMemberList = ref<MemberInterface>();
  onMounted(() => {
    getAllFormalMembers().then((res) => {
      allMemberList.value = res;
    });
  });
  const saveScholar = () => {
    emits('save');
    // console.log(scholarDetail.value);
  };
  const closeModal = () => {
    emits('update:show', false);
  };
  //   const handleUpdate = ({
  //     option,value
  //   }: {
  //     value: Array<any> | string | number | null;
  //     option: SelectBaseOption | null | SelectBaseOption[];
  //   }) => {
  //     // console.log(value);
  //     console.log(option);
  //     scholarDetail.value.memberList = option as unknown as MemberScholarInterface[];
  //   };
  const handleMemberSelectUpdate = (
    value: Array<any> | string | number | null,
    option: SelectBaseOption | null | SelectBaseOption[]
  ) => {
    console.log('value', value);
    console.log('option', option);
    scholarDetail.value.memberList = option as unknown as MemberScholarInterface[];
  };
</script>

<style scoped></style>
