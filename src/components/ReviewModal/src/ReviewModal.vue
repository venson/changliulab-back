<template>
  <n-modal v-model:show="showModalFlag" preset="dialog" title="Review">
    <div class="text-gray-700">
      <span class="text-xl font-semibold">{{ capitalized(review.action) }}</span> review for
    </div>
    <div class="text-gray-800 text-2xl pb-2">{{ review.title }} </div>
    <n-form>
      <!-- <n-form-item :label="labelText"> -->
      <n-form-item :label="labelText">
        <n-input type="textarea" v-model:value="message" />
        <!-- <div>{{ labelText }}</div> -->
      </n-form-item>
      <!-- <div class="flex justify-end"> -->
      <n-button
        :type="comfirmButtonType"
        class="float-right"
        :disabled="confirmButtonDisable"
        @click="confirmButton"
        >{{ confirmButtonText }}</n-button
      >
      <!-- </div> -->
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
  import { ReviewAction, ReviewModalInterface } from '@/common/types';
  import { computed, defineComponent, ref } from 'vue';
  import { capitalized } from '@/utils/string/capitalized';
  interface PropsInterface {
    show: boolean;
    review: ReviewModalInterface;
  }
  const props = defineProps<PropsInterface>();
  const emit = defineEmits(['update:show', 'action']);
  const showModalFlag = computed({
    get: () => props.show,
    set: () => emit('update:show', false),
  });
  const comfirmButtonType = computed(() => {
    switch (props.review.action) {
      case ReviewAction.REJECT:
        return 'error';
      default:
        return 'success';
    }
  });
  const confirmButtonText = computed(() => {
    switch (props.review.action) {
      case ReviewAction.REJECT:
        return 'Confirm Reject';
      default:
        return 'Confirm';
    }
  });
  const labelText = computed(() => {
    switch (props.review.action) {
      case ReviewAction.PASS:
        return 'Pass Review comment';
      case ReviewAction.REJECT:
        return 'Reject Review comment';
      case ReviewAction.REQUEST:
        return 'Request message';
      default:
        return '';
    }
  });
  const confirmButtonDisable = ref(false);
  const message = ref('');
  const confirmButton = () => {
    confirmButtonDisable.value = true;
    emit('action', message.value);
    setTimeout(() => (confirmButtonDisable.value = false), 1000);
  };
</script>
<script lang="ts">
  export default defineComponent({
    name: 'ReviewModal',
  });
</script>

<style scoped></style>
