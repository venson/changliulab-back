import { http } from '@/utils/http/axios';
const url = '/eduservice/admin/edu-research';

export function getResearchList(page: number, size: number) {
  return http.request({
    url: `${url}/${page}/${size}`,
    method: 'GET',
  });
}

export function getResearchById(id: string) {
  return http.request({
    url: `${url}/${id}`,
    method: 'GET',
  });
}
export function updateResearch(id: string, research: object) {
  return http.request({
    url: `${url}/${id}`,
    method: 'PUT',
    data: research,
  });
}
export function requestReviewById(id: string, applyVo: object) {
  return http.request({
    url: `${url}/review/${id}`,
    method: 'POST',
    data: applyVo,
  });
}
export function passReviewById(reviewId: string, reviewVo: object) {
  return http.request({
    url: `${url}/review/${reviewId}`,
    method: 'PUT',
    data: reviewVo,
  });
}
export function rejectReviewById(reviewId: string, reviewVo: object) {
  return http.request({
    url: `${url}/review/reject/${reviewId}`,
    method: 'POST',
    data: reviewVo,
  });
}
export function getReviewList() {
  return http.request({
    url: `${url}/reivew`,
    method: 'GET',
  });
}
