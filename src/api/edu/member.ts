import { http } from '@/utils/http/axios';
const url = '/eduservice/admin/edu-member';
import { MemberInterface, MemberQueryInterface } from '@/common/types';

export function getAllFormalMembers(type?: string) {
  return http.request({
    url: `${url}`,
    method: 'GET',
    params: { type: type },
  });
}
export function getPageMember(current: number, size: number, condition?: MemberQueryInterface) {
  return http.request({
    url: `${url}/${current}/${size}`,
    method: 'POST',
    data: condition,
  });
}
export function updateMember(id: string, member: MemberInterface) {
  return http.request({
    url: `${url}/${id}`,
    method: 'PUT',
    data: member,
  });
}

export function addMember(member: MemberInterface) {
  return http.request({
    url: `${url}`,
    method: 'POST',
    data: member,
  });
}
