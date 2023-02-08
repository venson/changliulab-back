<!-- eslint-disable vue/no-v-html -->
<template>
  <n-modal v-model:show="showFlag" preset="card" class="w-4/5">
    <div>
      <n-button @click="reviewedClick">Reviewed</n-button>
      <n-button @click="modifiedClick">Reviewed</n-button>
    </div>
    <div class="flex flex-row">
      <div :class="reviewedClass">
        <span class="text-xl text-center" @click="reviewedClick">Reviewed</span>
        <div
          class="h-[calc(80vh-200px)] overflow-auto border-solid border-gray-100 px-4"
          v-if="showReviewedFlag"
          v-html="reviewedHtml"
        ></div>
      </div>
      <div :class="modifiedClass">
        <span class="text-xl text-center" @click="modifiedClick">Modified</span>
        <div
          class="h-[calc(80vh-200px)] overflow-auto border-solid border-gray-100 px-4"
          v-if="showModifiedFlag"
          v-html="modifiedHtml"
        ></div>
      </div>
    </div>
    <n-button
      class="my-2"
      type="success"
      v-if="props.mode === 'preview'"
      @click="$emit('action', ReviewAction.REQUEST)"
    >
      Request
    </n-button>
    <div class="flex justify-between mx-4" v-if="props.mode === 'review'">
      <n-button
        class="my-2"
        type="success"
        @click="$emit('action', ReviewStatus.FINISHED, ReviewAction.PASS)"
      >
        Pass
      </n-button>
      <n-button
        class="my-2"
        type="error"
        @click="$emit('action', ReviewStatus.REJECTED, ReviewAction.REJECT)"
      >
        Reject
      </n-button>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
  // import { HtmlBrViewer } from '@/components/HtmlBrViewer';

  import { base64ToBytes } from '@/utils/base64';
  import pako from 'pako';
  import 'bytemd/dist/index.css';
  import 'highlight.js/styles/vs.css';
  import 'github-markdown-css/github-markdown-light.css';
  import 'katex/dist/katex.css';
  import { computed, defineComponent, ref } from 'vue';
  import { ReviewAction, ReviewStatus } from '@/common/types';
  interface ModalInterface {
    show: boolean;
    reviewed?: string;
    modified?: string;
    mode: 'review' | 'preview';
  }
  const props = defineProps<ModalInterface>();
  const emits = defineEmits(['action', 'update:show']);
  const showFlag = computed({
    get: () => props.show,
    set: () => emits('update:show', false),
  });
  const reviewedHtml = computed(() => {
    // console.log('reviewed', props.reviewed);
    if (props.reviewed && props.reviewed.length % 4 === 0) {
      // const htmlBr = base64ToBytes(res.htmlBrBase64);
      const bytes = base64ToBytes(props.reviewed);
      // console.log('reviewedBytes', bytes);

      const html = pako.inflate(bytes, { to: 'string' });
      // const html = pako.inflate(htmlBr, { to: 'string' });
      // console.log(html);
      return html;
    }
    console.log('no content');
    return 'No Conetent';
  });
  const modifiedHtml = computed(() => {
    // debugger;
    // console.log('reviewed', props.reviewed);
    if (props.modified && props.modified.length % 4 === 0) {
      const bytes = base64ToBytes(props.modified);
      const html = pako.inflate(bytes, { to: 'string' });
      // console.log(html);
      return html;
    }
    return 'No Conetent';
  });
  const showReviewedInit = computed<boolean>(
    () => props.reviewed === undefined && props.reviewed !== null
  );
  const showModifiedInit = computed<boolean>(
    () => props.modified === undefined && props.modified !== null
  );
  const showReviewedFlag = ref(showReviewedInit.value);
  const showModifiedFlag = ref(showModifiedInit.value);
  const reviewedClick = () => {
    showReviewedFlag.value = !showReviewedFlag.value;
  };
  const modifiedClick = () => {
    showModifiedFlag.value = !showModifiedFlag.value;
  };
  const reviewedClass = computed<string>(() => {
    if (showModifiedFlag.value && showReviewedFlag.value) {
      return 'w-1/2';
    } else if (showReviewedFlag.value) {
      return 'w-full';
    } else {
      return 'hidden';
    }
  });
  const modifiedClass = computed<string>(() => {
    if (showModifiedFlag.value && showReviewedFlag.value) {
      return 'w-1/2';
    } else if (showModifiedFlag.value) {
      return 'w-full';
    } else {
      return 'hidden';
    }
  });
</script>
<script lang="ts">
  export default defineComponent({
    name: 'HtmlViewModal',
  });
</script>
