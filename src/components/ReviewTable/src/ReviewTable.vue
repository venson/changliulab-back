<template>
  <div>
    <div class="flex justify-center">
      <n-button v-show="!showTableFlag" text class="text-gray-50" @click="showTableFlag = true">
        <n-icon>
          <ChevronDoubleDown16Regular class="w-20" />
        </n-icon>
      </n-button>
      <n-button v-show="showTableFlag" text class="text-gray-50" @click="showTableFlag = false">
        <n-icon>
          <ChevronDoubleUp16Regular class="w-20" />
        </n-icon>
      </n-button>
    </div>
    <div v-show="showTableFlag">
      <div v-for="(review, index) in props.reviews" :key="index">
        <div v-for="(message, msgindex) in review.messages" :key="msgindex">
          <div class="flex flex-row">
            <div id="requestMsg">
              <span
                >{{ message.requestMsg }}<br />
                requested by {{ message.requestUsername }} at
                {{ message.gmtCreate }}
              </span>
            </div>
            <div id="reviewMsg" v-if="message.reviewUsername">
              <span
                >{{ message.reviewMsg }}<br />
                {{ message.reviewAction }} by {{ message.reviewUsername }} at
                {{ message.gmtModified }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ReviewInterface } from '@/common/types';
  import { defineComponent, ref } from 'vue';
  import { ChevronDoubleDown16Regular, ChevronDoubleUp16Regular } from '@vicons/fluent';
  interface PropsInterface {
    reviews: ReviewInterface[];
  }
  const showTableFlag = ref(false);
  const props = defineProps<PropsInterface>();
</script>

<script lang="ts">
  export default defineComponent({
    name: 'ReviewTable',
  });
</script>

<style scoped></style>
