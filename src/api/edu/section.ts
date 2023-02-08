import { ContentInterface, ReviewVo } from '@/common/types';
import { http } from '@/utils/http/axios';
const url = '/eduservice/admin/edu-section';
export function getSectionById(id: string) {
  return http.request({
    url: `${url}/${id}`,
    method: 'GET',
  });
}
export function addSection(section: ContentInterface) {
  return http.request({
    url: `${url}`,
    method: 'POST',
    data: section,
  });
}

export function updateSection(sectionId: string, section: ContentInterface) {
  return http.request({
    url: `${url}/${sectionId}`,
    method: 'PUT',
    data: section,
  });
}

export function removeSection(sectionId: string) {
  return http.request({
    url: `${url}/${sectionId}`,
    method: 'DELETE',
  });
}

export function getSectionPreviewBySectionId(sectionId: string) {
  return http.request({
    url: `${url}/preview/${sectionId}`,
    method: 'GET',
  });
}

export function doReviewAction(vo: ReviewVo) {
  return http.request({
    url: `${url}/review`,
    method: 'POST',
    data: vo,
  });
}
