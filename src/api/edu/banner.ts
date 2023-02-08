import { http } from '@/utils/http/axios';
const url = '/educms/admin/banner';
import { BannerInterface } from '@/common/types';

export function getPageBanner(current: number, size: number) {
  return http.request({
    url: `${url}/${current}/${size}`,
    method: 'GET',
  });
}
export function updateBanner(id: string, banner: BannerInterface) {
  return http.request({
    url: `${url}/${id}`,
    method: 'PUT',
    data: banner,
  });
}
export function getBannerById(id: string) {
  return http.request({
    url: `${url}/${id}`,
    method: 'GET',
  });
}

export function addCmsBanner(banner: BannerInterface) {
  return http.request({
    url: `${url}`,
    method: 'POST',
    data: banner,
  });
}
export function removeBanner(id: string) {
  return http.request({
    url: `${url}/${id}`,
    method: 'DELETE',
  });
}
export function switchBanner(id: string) {
  return http.request({
    url: `${url}/switch/${id}`,
    method: 'PUT',
  });
}
