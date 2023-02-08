import { http } from '@/utils/http/axios';
const url = '/eduservice/admin/edu-review';
import { ReviewVo } from '@/common/types';
export function requestReviewByCourseId(id: string, reviewVo: ReviewVo) {
  return http.request({
    url: `${url}/${id}`,
    method: 'POST',
    data: reviewVo,
  });
}
export function requestReviewBySectionId(id: string, reviewVo: ReviewVo) {
  return http.request({
    url: `${url}/section/${id}`,
    method: 'POST',
    data: reviewVo,
  });
}
export function requestReviewByChapterId(id: string, reviewVo: ReviewVo) {
  return http.request({
    url: `${url}/chapter/${id}`,
    method: 'POST',
    data: reviewVo,
  });
}
export function passReviewByChapterId(id: string, reviewVo: ReviewVo) {
  return http.request({
    url: `${url}/chapter/${id}`,
    method: 'PUT',
    data: reviewVo,
  });
}
export function passReviewBySectionId(id: string, reviewVo: ReviewVo) {
  return http.request({
    url: `${url}/section/${id}`,
    method: 'PUT',
    data: reviewVo,
  });
}
export function passReviewByCourseId(id: string, reviewVo: ReviewVo) {
  return http.request({
    url: `${url}/${id}`,
    method: 'PUT',
    data: reviewVo,
  });
}
export function rejectReviewByChapterId(id: string, reviewVo: ReviewVo) {
  return http.request({
    url: `${url}/chapter/${id}`,
    method: 'DELETE',
    data: reviewVo,
  });
}
export function rejectReviewBySectionId(id: string, reviewVo: ReviewVo) {
  return http.request({
    url: `${url}/section/${id}`,
    method: 'DELETE',
    data: reviewVo,
  });
}
export function rejectReviewByCourseId(id: string, reviewVo: ReviewVo) {
  return http.request({
    url: `${url}/${id}`,
    method: 'DELETE',
    data: reviewVo,
  });
}
export function getPageCourseReviewList(current: number, size: number) {
  return http.request({
    url: `${url}/${current}/${size}`,
    method: 'GET',
  });
}
