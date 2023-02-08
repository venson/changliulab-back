import { LanguageEnum, MethodologyInterface, ReviewVo } from '@/common/types';
import { http } from '@/utils/http/axios';
const url = '/eduservice/admin/edu-methodology';

export function getMethodologyList(page: number, size: number) {
  return http.request({
    url: `${url}/${page}/${size}`,
    method: 'GET',
  });
}

export function getMethodologyById(id: string) {
  return http.request({
    url: `${url}/${id}`,
    method: 'GET',
  });
}
export function updateMethodology(id: string, methodology: MethodologyInterface) {
  return http.request({
    url: `${url}/${id}`,
    method: 'PUT',
    data: methodology,
  });
}
export function addMethodology(methodology: MethodologyInterface) {
  return http.request({
    url: `${url}`,
    method: 'POST',
    data: methodology,
  });
}
export function getMethodologyViewById(id: string) {
  return http.request({
    url: `${url}/view/${id}`,
    method: 'GET',
  });
}
export function requestMethodologyReviewById(id: string, applyVo: ReviewVo) {
  return http.request({
    url: `${url}/review/${id}`,
    method: 'POST',
    data: applyVo,
  });
}
export function doReviewByMethodologyId(reviewId: string, reviewVo: ReviewVo) {
  return http.request({
    url: `${url}/review/${reviewId}`,
    method: 'PUT',
    data: reviewVo,
  });
}
export function requestReviewByMethodologyId(reviewId: string, reviewVo: ReviewVo) {
  return http.request({
    url: `${url}/review/${reviewId}`,
    method: 'POST',
    data: reviewVo,
  });
}
export function passReviewByMethodologyId(reviewId: string, reviewVo: ReviewVo) {
  return http.request({
    url: `${url}/review/${reviewId}`,
    method: 'PUT',
    data: reviewVo,
  });
}
export function rejectReviewByMethodologyId(reviewId: string, reviewVo: ReviewVo) {
  return http.request({
    url: `${url}/review/${reviewId}`,
    method: 'DELETE',
    data: reviewVo,
  });
}
export function getPageMethodologyReview(current: number, size: number) {
  return http.request({
    url: `${url}/review/${current}/${size}`,
    method: 'GET',
  });
}
export function getPreviewByMethodologyId(id: string) {
  return http.request({
    url: `${url}/review/${id}`,
    method: 'GET',
  });
}
export function switchMethodologyEnableById(id: string, lang: LanguageEnum) {
  return http.request({
    url: `${url}/enable/${id}`,
    method: 'GET',
    params: { lang: lang },
  });
}
