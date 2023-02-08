<template>
  <div>
    <n-modal class="w-3/4" v-model:show="copperShow" preset="card">
      <Cropper
        ref="cropper"
        class="h-96"
        :src="image.src"
        :stencilSize="stencilSize"
        :canvas="stencilSize"
        :stencilProps="stencilProps"
      />
      <n-button @click="crop">Save</n-button>
    </n-modal>
    <div class="">
      <!-- <input type="file" ref="file" @change="loadImage" accept="image/*" capture /> -->
      <n-upload
        ref="upload"
        action=""
        :default-upload="false"
        :file-list="[]"
        @change="handleChange"
      >
        <n-button>Select File</n-button>
      </n-upload>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getOssAuth, uploadToOss } from '@/api/oss/oss';
  import { reactive, onUnmounted, ref, computed, defineComponent } from 'vue';
  import { Cropper } from 'vue-advanced-cropper';
  import 'vue-advanced-cropper/dist/style.css';
  // import VueCropper from 'vue-cropperjs';
  // const file = ref();
  const cropper = ref();
  const copperShow = ref(false);
  const upload = ref();
  type style = 'cover' | 'avator' | 'free';
  interface cropperInterface {
    url?: string;
    height?: number;
    width?: number;
    mode: style;
    path: string;
  }
  const props = withDefaults(defineProps<cropperInterface>(), {
    mode: 'free',
    path: '',
  });
  const emit = defineEmits(['update:url']);
  const defaultCoverSize = reactive({ height: 200, width: 260 });
  const defaultAvatorSize = reactive({ height: 200, width: 200 });
  const defaultFreeSize = reactive({ height: 400, width: 600 });
  const imageUrl = computed({
    get: () => props.url,
    set: (value) => emit('update:url', value),
  });
  const handleChange = (data) => {
    image.src && URL.revokeObjectURL(image.src);
    console.log(data);
    image.fileName = data.file.name;
    const blob = URL.createObjectURL(data.file.file);
    // const reader = new FileReader();
    image.src = blob;
    image.type = data.file.type;
    // reader.onload = (e) => {
    //   image.src = blob;
    //   image.type = getMimeType(e.target?.result, data.file.type);
    // };
    // reader.readAsArrayBuffer(data.file.file);

    copperShow.value = true;
    console.log(data);
  };

  const image = reactive<{ src?: string; type?: string; fileName: string }>({
    fileName: '',
  });
  const stencilProps = computed(() => {
    switch (props.mode) {
      case 'cover':
        return {
          handlers: {},
          movable: false,
          scalable: false,
        };
      case 'avator':
        return {
          handlers: {},
          movable: false,
          scalable: false,
        };
      case 'free':
        return {
          handlers: {},
          movable: false,
          scalable: true,
        };
      default:
        return {
          handlers: {},
          movable: true,
          scalable: true,
        };
    }
  });
  const stencilSize = computed(() => {
    switch (props.mode) {
      case 'cover':
        return {
          height: props.height ? props.height : defaultCoverSize.height,
          width: props.width ? props.width : defaultCoverSize.width,
        };
      case 'avator':
        return {
          height: props.height ? props.height : defaultAvatorSize.height,
          width: props.width ? props.height : defaultAvatorSize.height,
        };
      case 'free':
        return {
          height: props.height ? props.height : defaultFreeSize.height,
          width: props.width ? props.height : defaultFreeSize.height,
        };
      default:
        return { height: props.height, width: props.width };
    }
  });
  // const loadImage = () => {
  //   console.log(file);
  //   const files = file.value.files;
  //   if (files && files[0]) {
  //     console.log(files);
  //     image.src && URL.revokeObjectURL(image.src);
  //     image.fileName = files[0].name;
  //     const blob = URL.createObjectURL(files[0]);
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       image.src = blob;
  //       image.type = getMimeType(e.target?.result, files[0].type);
  //       // console.log(image);
  //     };
  //     reader.readAsArrayBuffer(files[0]);
  //   }
  //   copperShow.value = true;
  // };
  const crop = () => {
    const { canvas } = cropper.value.getResult();
    canvas.toBlob((blob: Blob) => {
      let formData = new FormData();
      getOssAuth(props.path).then((res) => {
        const timeMark = new Date().getTime();
        const key = res.dir + '/' + timeMark + image.fileName;
        const newUrl = res.host + '/' + key;
        formData.append('key', key);
        formData.append('policy', res.policy);
        formData.append('OSSAccessKeyId', res.accessId);
        formData.append('success_action_status', '200');
        formData.append('Signature', res.signature);
        formData.append('file', blob, image.fileName);
        uploadToOss(res.host, formData).then(() => {
          imageUrl.value = newUrl;
        });
      });
      image.src = '';
      copperShow.value = false;
      // Do something with blob: upload to a server, download and etc.
    }, image.type);
  };
  onUnmounted(() => {
    image.src && URL.revokeObjectURL(image.src);
  });

  // const getMimeType = (file, fallback = undefined) => {
  //   const byteArray = new Uint8Array(file).subarray(0, 4);
  //   let header = '';
  //   for (let i = 0; i < byteArray.length; i++) {
  //     header += byteArray[i].toString(16);
  //   }
  //   switch (header) {
  //     case '89504e47':
  //       return 'image/png';
  //     case '47494638':
  //       return 'image/gif';
  //     case 'ffd8ffe0':
  //     case 'ffd8ffe1':
  //     case 'ffd8ffe2':
  //     case 'ffd8ffe3':
  //     case 'ffd8ffe8':
  //       return 'image/jpeg';
  //     default:
  //       return fallback;
  //   }
  // };
</script>
<script lang="ts">
  export default defineComponent({
    name: 'ClCropper',
  });
</script>

<style scoped></style>
