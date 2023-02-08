import { BannerInterface } from '@/common/types';
import { DataTableColumns, NImage } from 'naive-ui';
import { h } from 'vue';

// const emit = defineEmits(['update:modelValue']);
export const bannerColumns: DataTableColumns<BannerInterface> = [
  { title: 'Title', key: 'title', width: 100 },
  {
    title: 'Image',
    key: 'imageUrl',
    align: 'center',
    width: 400,
    render(row) {
      return [h(NImage, { class: 'h-24', src: row.imageUrl ? row.imageUrl : row.imageOutlinkUrl })];
    },
  },
];
