import { http } from '@/utils/http/axios';
import { CourseInterface, ReviewVo } from '@/common/types';
const url = '/eduservice/admin/edu-course';
// export function getPageCourse(page: number, size: number, condition: string) {
//   return http.request({
//     url: `${url}/${page}/${size}`,
//     method: 'GET',
//     params: { condition: condition },
//   });
// }
export function getPageCourse(page: number, size: number, condition: string) {
  return http.request({
    url: `${url}/${page}/${size}`,
    method: 'GET',
    params: { type: 'NORMAL', condition: condition },
  });
}
export function getPageCourseReview(page: number, size: number) {
  return http.request({
    url: `${url}/${page}/${size}`,
    method: 'GET',
    params: { type: 'REVIEW', condition: '' },
  });
}
export function removeCourseById(id: string) {
  return http.request({
    url: `${url}/${id}`,
    method: 'DELETE',
  });
}
export function getCourseById(id: string) {
  return http.request({
    url: `${url}/${id}`,
    method: 'GET',
  });
}
export function updateCourseInfo(courseInfo: CourseInterface) {
  return http.request({
    url: `${url}/${courseInfo.id}`,
    method: 'PUT',
    data: courseInfo,
  });
}
export function addCourseInfo(courseInfo: CourseInterface) {
  return http.request({
    url: `${url}`,
    method: 'POST',
    data: courseInfo,
  });
}
export function getCoursePreview(id: string) {
  return http.request({
    url: `${url}/preview/${id}`,
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
