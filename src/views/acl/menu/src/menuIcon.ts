import {
  HatGraduation12Regular,
  TargetArrow16Regular,
  AirplaneTakeOff16Regular,
} from '@vicons/fluent';
import { NIcon } from 'naive-ui';
import { h } from 'vue';

import {
  BookOutline,
  KeyOutline,
  PeopleOutline,
  EyeOutline,
  BarChartOutline,
  ImagesOutline,
  NewspaperOutline,
} from '@vicons/ionicons5';
export function renderIcon(icon) {
  return h(NIcon, null, { default: () => h(icon) });
}
//前端路由图标映射表
export const constantIcon = {
  BookOutline: renderIcon(BookOutline),
  PeopleOutline: renderIcon(PeopleOutline),
  KeyOutline: renderIcon(KeyOutline),
  HatGraduation12Regular: renderIcon(HatGraduation12Regular),
  TargetArrow16Regular: renderIcon(TargetArrow16Regular),
  EyeOutline: renderIcon(EyeOutline),
  AirplaneTakeOff16Regular: renderIcon(AirplaneTakeOff16Regular),
  BarChartOutline: renderIcon(BarChartOutline),
  ImagesOutline: renderIcon(ImagesOutline),
  NewspaperOutline: renderIcon(NewspaperOutline),
};
