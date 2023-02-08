<template>
  <n-modal v-model:show="showFlag" preset="card" title="Banner" class="w-1/2">
    <n-form
      ref="formRef"
      :model="bannerDetail"
      label-placement="left"
      require-mark-placement="right-hanging"
      label-width="auto"
      :rules="rules"
    >
      <n-form-item label="Title">
        <n-input v-model:value="bannerDetail.title" />
      </n-form-item>
      <n-form-item label="Banner">
        <div>
          <div v-if="bannerDetail.imageUrl" class="flex flex-row">
            <n-image :src="bannerDetail.imageUrl" alt="Invalid Image" class="h-28 py-2" />
            <n-button text class="text-2xl" @click="clearImageUrl">
              <n-icon>
                <CloseCircleOutline />
              </n-icon>
            </n-button>
          </div>
          <ClCropper v-model:url="bannerDetail.imageUrl" mode="cover" path="avatar" />
        </div>
      </n-form-item>
      <n-form-item label="Image Out">
        <div>
          <n-input v-model:value="bannerDetail.imageOutlinkUrl" />
          <n-image
            v-show="bannerDetail.imageOutlinkUrl"
            :src="bannerDetail.imageOutlinkUrl"
            class="h-28 py-2"
          />
        </div>
      </n-form-item>
      <div>
        <n-button class="float-right" type="success" :disabled="buttonDisabled" @click="saveBanner"
          >Save</n-button
        >
      </div>
      <!-- <n-form-item> </n-form-item> -->
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
  // import { addBanner, updateBanner } from '@/api/edu/banner';
  import { BannerInterface } from '@/common/types';
  import { ClCropper } from '@/components/ClCropper';
  import { FormValidationError } from 'naive-ui';
  import { CloseCircleOutline } from '@vicons/ionicons5';
  import { computed, ref } from 'vue';
  // const message = useMessage();
  const buttonDisabled = ref(false);
  const emit = defineEmits(['update:show', 'save']);
  const formRef = ref();
  interface PropsInterface {
    show: boolean;
    banner: BannerInterface;
  }
  const props = withDefaults(defineProps<PropsInterface>(), {
    show: false,
    banner: () => {
      return { enable: false };
    },
  });
  const showFlag = computed({
    set: () => {
      formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
        if (!errors || !bannerDetail.value.id) {
          emit('update:show', false);
        }
      });
      // if (formRef.value.validate) emit('update:show', false);
    },
    get: () => props.show,
  });
  const bannerDetail = computed(() => props.banner);
  const rules = {
    title: {
      required: true,
      message: 'Name can not be empty',
      trigger: 'blur',
    },
  };
  const saveBanner = () => {
    formRef.value.validate((error: Array<FormValidationError> | undefined) => {
      if (!error) {
        console.log(error);
        emit('save', bannerDetail.value);
        buttonDisabled.value = true;
        setTimeout(() => (buttonDisabled.value = false), 1000);
        // buttonDisabled.value = false;
      }
    });
  };
  const clearImageUrl = () => {
    bannerDetail.value.imageUrl = '';
  };
</script>

<style scoped></style>
