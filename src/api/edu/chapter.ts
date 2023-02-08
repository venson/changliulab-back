import { ContentInterface, ReviewVo } from '@/common/types';
import { http } from '@/utils/http/axios';
const url = '/eduservice/admin/edu-chapter';
export function getChapterById(id: string) {
  return http.request({
    url: `${url}/${id}`,
    method: 'GET',
  });
}
export function addChapter(chapter: ContentInterface) {
  return http.request({
    url: `${url}`,
    method: 'POST',
    data: chapter,
  });
}
export function doReviewAction(vo: ReviewVo) {
  return http.request({
    url: `${url}/review`,
    method: 'POST',
    data: vo,
  });
}

export function updateChapter(chapterId: string, chapter) {
  return http.request({
    url: `${url}/${chapterId}`,
    method: 'PUT',
    data: chapter,
  });
}
export function removeChapter(chapterId: string) {
  return http.request({
    url: `${url}/${chapterId}`,
    method: 'DELETE',
  });
}
