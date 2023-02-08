import { LanguageEnum, ResearchInterface } from '@/common/types';
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
export function updateResearch(id: string, research: ResearchInterface) {
  return http.request({
    url: `${url}/${id}`,
    method: 'PUT',
    data: research,
  });
}
export function addResearch(research: ResearchInterface) {
  return http.request({
    url: `${url}`,
    method: 'POST',
    data: research,
  });
}
export function removeResearchById(id: string) {
  return http.request({
    url: `${url}/${id}`,
    method: 'DELETE',
  });
}
export function getResearchViewById(id: string) {
  return http.request({
    url: `${url}/preview/${id}`,
    method: 'GET',
  });
}
export function getPageResearchReview(current: number, size: number) {
  return http.request({
    url: `${url}/review/${current}/${size}`,
    method: 'GET',
  });
}
export function getPreviewByResearchId(id: string) {
  return http.request({
    url: `${url}/preview/${id}`,
    method: 'GET',
  });
}
export function switchResearchEnableById(id: string, lang: LanguageEnum) {
  return http.request({
    url: `${url}/enable/${id}`,
    method: 'GET',
    params: { lang: lang },
  });
}
