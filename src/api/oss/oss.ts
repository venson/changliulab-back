import { http } from '@/utils/http/axios';
const url = '/eduoss/admin/fileoss';
import axios from 'axios';

export function getOssAuth(dir: string) {
  return http.request({
    url: `${url}/auth`,
    method: 'GET',
    params: { path: dir },
  });
}
export function uploadToOss(url: string, formData: FormData) {
  return axios.post(url, formData);
}
