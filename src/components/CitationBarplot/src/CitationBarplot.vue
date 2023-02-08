<template>
  <div class="h-24 relative my-2">
    <a
      class="absolute bottom-8 w-5 bg-gray-500 hover:bg-blue-800 group hover:cursor-pointer flex"
      v-for="(citation, index) in plotData"
      :key="index"
      :style="{ left: +(index * 36 + 8) + 'px', height: citation.y + 'px' }"
      ><div
        class="invisible group-hover:visible absolute bottom-3 left-1 whitespace-nowrap bg-white text-gray-800 border border-solid border-gray-600 text-center text-xs"
        >{{ citation.value ? citation.value : 0 }}</div
      >
      <span class="absolute -bottom-4 -left-1 text-xs" :style="{ width: '36px' }"
        >{{ citation.x }}
        <!-- <n-input-number
        :show-button="false"
        class="w-[24px] text-xs"
        v-model:value="citation.citations"
      /> -->
        <!-- <input :value="citation.citations" @input="handleInput" /> -->
      </span>
      <!-- <span class="text-xs" :style="{ left: +index * 33 + 'px', width: '33px' }"
        >{{ citation.x }}
        <input class="w-[22px] text-xs" v-model="yComputed[index]" />
      </span> -->
    </a>
    <div
      class="absolute bottom-8 border-t border-b-0 border-solid border-gray-600 w-full"
      :style="{ width: propValue.length * 36 + 'px', minWidth: '500px' }"
    ></div>
    <span
      v-for="(citation, index) in propValue"
      :key="index"
      class="absolute bottom-8 text-xs text-center flex justify-center"
      :style="{ left: +index * 36 + 'px', width: '36px' }"
    >
      <input
        type="number"
        class="absolute flex w-[26px] appearance-none text-right top-4 justify-center"
        v-model="citation.citations"
      />
      <!-- <n-input-number
        :show-button="false"
        size="tiny"
        min="0"
        class="text-xs absolute flex w-[32px] appearance-none top-4 text-center justify-center"
        v-model:value="citation.citations"
      /> -->
    </span>
  </div>
</template>
<script lang="ts" setup>
  import { ScholarCitationInterface } from '@/common/types';
  // import { computed, defineComponent, ref, watch } from 'vue';
  import { computed, defineComponent } from 'vue';
  const emits = defineEmits(['update:value']);
  interface PropsInterface {
    value?: ScholarCitationInterface[];
    mode?: 'edit' | 'view';
  }
  const props = withDefaults(defineProps<PropsInterface>(), {
    value: () => {
      return [
        { year: 2010, citations: 2 },
        { year: 2011, citations: 3 },
        { year: 2012, citations: 4 },
      ];
    },
  });
  const propValue = computed({
    get: () => props.value,
    set: (value) => {
      emits('update:value', value);
      console.log('citation update', value);
    },
  });
  const maxCitation = computed(() => {
    const list = propValue.value.map((o) => o.citations);
    const maxc = Math.max(...list);
    console.log('maxc', maxc);
    return maxc;
  });
  const plotData = computed(() => {
    const list = propValue.value.map((o) => {
      return { x: o.year, y: (56 * o.citations) / maxCitation.value, value: o.citations };
    });
    return list;
  });
</script>

<script lang="ts">
  export default defineComponent({
    name: 'CitationBarplot',
  });
</script>

<style scoped></style>
