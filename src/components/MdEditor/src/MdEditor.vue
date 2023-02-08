<template>
  <div class="">
    <Editor
      ref="markdown"
      :value="modelValue"
      mode="split"
      :plugins="plugins"
      @change="handleChange"
    />
    <div class="" :class="requestEnable ? 'flex justify-between' : ''">
      <n-button
        class="mt-1 w-24"
        :class="requestEnable ? '' : 'float-right'"
        type="success"
        size="small"
        :disabled="saveButtonDisabled"
        :loading="saveButtonDisabled"
        @click="saveHtml"
        >{{ saveButtonContext }}
      </n-button>
      <NTooltip trigger="hover">
        <template #trigger>
          <div>
            <n-button
              v-if="requestEnable"
              class="mt-1 w-24"
              type="warning"
              size="small"
              :disabled="requestButtonDisabled"
              :loading="requestButtonDisabled"
              @click="request"
              >{{ requestButtonContext }}
            </n-button>
          </div>
        </template>
        Request Review
      </NTooltip>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { Editor } from '@bytemd/vue-next';
  import { NButton, useMessage } from 'naive-ui';
  import { ref } from 'vue';
  import gfm from '@bytemd/plugin-gfm';
  import highlight from '@bytemd/plugin-highlight';
  import breaks from '@bytemd/plugin-breaks';
  import frontmatter from '@bytemd/plugin-frontmatter';
  import gemoji from '@bytemd/plugin-gemoji';
  // import mediumZoom from '@bytemd/plugin-medium-zoom'
  import mermaid from '@bytemd/plugin-mermaid';
  import math from '@bytemd/plugin-math';
  import 'bytemd/dist/index.css';
  import 'highlight.js/styles/vs.css';
  import 'github-markdown-css/github-markdown-light.css';
  import 'katex/dist/katex.css';
  import { bytesToBase64 } from '@/utils/base64';
  import pako from 'pako';
  const saveButtonDisabled = ref(false);
  const saveButtonContext = ref('Save');
  const requestButtonDisabled = ref(false);
  const requestButtonContext = ref('Request');
  const props = defineProps({
    modelValue: { type: String, require: false, default: 'Please edit on the left window' },
    requestEnable: { type: Boolean, require: false, default: false },
    editEnable: Boolean,
  });
  const message = useMessage();
  const emit = defineEmits(['update:modelValue', 'html', 'request']);
  const markdown = ref<Editor>();
  // async () => {};
  const plugins = ref([
    gfm(),
    breaks(),
    highlight(),
    mermaid(),
    math(),
    frontmatter(),
    gemoji(),
    // Add more plugins here
  ]);
  const handleChange = (v: string): void => {
    // mdText = v;
    if (props.editEnable) {
      emit('update:modelValue', v);
    } else {
      message.error('Please save before edit');
    }
    // textnew = v;
  };
  const request = () => {
    emit('request');
  };

  const textEncoder = new TextEncoder();
  const saveHtml = () => {
    if (props.editEnable) {
      saveButtonDisabled.value = true;
      saveButtonContext.value = 'Saving';
      const markdownDom = document.getElementsByClassName('bytemd-preview');
      const html = markdownDom[0].innerHTML;
      const htmlPako = pako.deflate(textEncoder.encode(html));
      // let htmlBr = brotli.compress(textEncoder.encode(html));
      // let base64HtmlBr = bytesToBase64(htmlBr);
      let base64HtmlBr = bytesToBase64(htmlPako);
      // const uncompressed = pako.inflate(htmlPako, { to: 'string' });
      // console.log('uncompressed', uncompressed);
      // console.log(base64HtmlBr);
      emit('html', base64HtmlBr);
      setTimeout(() => {
        saveButtonDisabled.value = false;
        saveButtonContext.value = 'Save';
      }, 1000);
    } else {
      emit('html');
    }
  };
</script>
<style lang="css">
  .bytemd {
    height: calc(100vh - 250px);
  }
  .n-layout .n-layout-scroll-container {
    overflow: visible;
    box-sizing: content-box;
    height: 100%;
  }
</style>
