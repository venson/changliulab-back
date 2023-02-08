import { ReviewType, ReviewVo } from '@/common/types';
import { http } from '@/utils/http/axios';
const url = '/eduservice/admin/edu-review';

export function doReviewAction(vo: ReviewVo) {
  return http.request({
    url: `${url}`,
    method: 'POST',
    data: vo,
  });
}
export function getReviewListByRefId(id: string, type: ReviewType) {
  return http.request({
    url: `${url}/${id}`,
    method: 'GET',
    params: { type: type },
  });
}
