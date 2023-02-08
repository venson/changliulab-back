import { SubjectInterface } from '@/common/types';
import { http } from '@/utils/http/axios';
const url = '/eduservice/admin/edu-subject';

export function getAllSubject() {
  return http.request({
    url: `${url}`,
    method: 'GET',
  });
}
export function updateSubject(subjects: SubjectInterface[]) {
  return http.request({
    url: `${url}`,
    method: 'PUT',
    data: subjects,
  });
}
