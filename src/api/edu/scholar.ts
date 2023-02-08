import { ScholarInterface, ScholarQueryInterface } from '@/common/types';
import { http } from '@/utils/http/axios';
const url = '/eduservice/admin/edu-scholar';
const citationUrl = '/eduservice/admin/edu-scholar-citation';
export function getPageScholar(current: number, size: number, condition?: ScholarQueryInterface) {
  return http.request({
    url: `${url}/${current}/${size}`,
    method: 'POST',
    data: condition,
  });
}
export function getScholarById(id: string) {
  return http.request({
    url: `${url}/${id}`,
    method: 'GET',
  });
}
export function getCitationByScholarId(id: string) {
  return http.request({
    url: `${citationUrl}/${id}`,
    method: 'GET',
  });
}
export function updateScholar(scholar: ScholarInterface) {
  return http.request({
    url: `${url}/${scholar.id}`,
    method: 'PUT',
    data: scholar,
  });
}

export function addScholar(scholar: ScholarInterface) {
  return http.request({
    url: `${url}/`,
    method: 'POST',
    data: scholar,
  });
}
export function removeScholarById(id: string) {
  return http.request({
    url: `${url}/${id}`,
    method: 'DELETE',
  });
}
