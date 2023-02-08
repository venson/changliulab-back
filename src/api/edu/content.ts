import { http } from '@/utils/http/axios';
const url = '/eduservice/admin/edu-content';
export function getCourseTreeById(id: string) {
  return http.request({
    url: `${url}/${id}`,
    method: 'GET',
  });
}

export function getSyllabus(id: string) {
  return http.request({
    url: `${url}/syllabus/${id}`,
    method: 'GET',
  });
}
