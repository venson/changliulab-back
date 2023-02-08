<!-- eslint-disable vue/no-v-html -->
<template>
  <n-modal v-model:show="showFlag" preset="card" class="w-4/5">
    <div class="flex flex-row">
      <div class="w-1/2">
        <span class="text-xl text-center">Reviewed</span>
        <div
          class="h-[calc(80vh-200px)] overflow-auto border-solid border-gray-100 px-4"
          v-if="showModifiedFlag"
          v-html="props.modified"
        ></div>
      </div>
      <div class="w-1/2">
        <span class="text-xl text-center">Modified</span>
        <div
          class="h-[calc(80vh-200px)] overflow-auto border-solid border-gray-100 px-4"
          v-if="showReviewedFlag"
          v-html="props.reviewed"
        ></div>
      </div>
    </div>
    <n-button class="my-2" type="success" v-if="props.requestEnable" @click="request">
      Request
    </n-button>
    <n-button class="my-2" type="success" v-if="props.passEnable" @click="pass"> Pass </n-button>
    <n-button class="my-2" type="success" v-if="props.rejectEnable" @click="reject">
      Reject
    </n-button>
  </n-modal>
</template>

<script setup lang="ts">
  // import { HtmlBrViewer } from '@/components/HtmlBrViewer';

  import 'bytemd/dist/index.css';
  import 'highlight.js/styles/vs.css';
  import 'github-markdown-css/github-markdown-light.css';
  import 'katex/dist/katex.css';
  import { computed, ref } from 'vue';
  interface ModalInterface {
    show: boolean;
    reviewed: string;
    modified: string;
    requestEnable?: boolean;
    passEnable?: boolean;
    rejectEnable?: boolean;
  }
  const emits = defineEmits(['request', 'pass', 'reject', 'update:show']);
  const showFlag = computed({
    get: () => props.show,
    set: () => emits('update:show', false),
  });
  const props = defineProps<ModalInterface>();
  const showReviewedFlag = ref(true);
  const showModifiedFlag = ref(true);
  const request = () => {
    emits('request');
  };
  const pass = () => {
    emits('pass');
  };
  const reject = () => {
    emits('pass');
  };
</script>
