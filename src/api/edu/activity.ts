import { ActivityInterface, ActivityQuery, PageType } from '@/common/types';
import { http } from '@/utils/http/axios';
const url = '/eduservice/admin/edu-activity';
export function getPageActivity(
  current: number,
  size: number,
  type: PageType,
  condition?: ActivityQuery
) {
  return http.request({
    url: `${url}/${current}/${size}`,
    method: 'GET',
    // data: condition,
    params: { type: type, title: condition?.title, begin: condition?.begin, end: condition?.end },
  });
}
export function getActivityById(id: string) {
  return http.request({
    url: `${url}/${id}`,
    method: 'GET',
  });
}
export function addActivity(activity: ActivityInterface) {
  return http.request({
    url: `${url}`,
    method: 'POST',
    data: activity,
  });
}
export function updateActivity(activity: ActivityInterface) {
  return http.request({
    url: `${url}/${activity.id}`,
    method: 'PUT',
    data: activity,
  });
}
export function getPageActivityReview(current: number, size: number) {
  return http.request({
    url: `${url}/review/${current}/${size}`,
    method: 'GET',
  });
}
export function getPreviewByActivityId(id: string) {
  return http.request({
    url: `${url}/preview/${id}`,
    method: 'GET',
  });
}
export function removeActivityById(id: string) {
  return http.request({
    url: `${url}/${id}`,
    method: 'DELETE',
  });
}

export function switchActivityEnableById(id: string) {
  return http.request({
    url: `${url}/enable/${id}`,
    method: 'PUT',
  });
}
export function getActivityPreviewById(id: string) {
  return http.request({
    url: `${url}/preview/${id}`,
    method: 'GET',
  });
}
