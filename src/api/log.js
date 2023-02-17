import request from '@/utils/request'

export function page(params) {
  return request({
    url: '/system/operate-log/page',
    method: 'get',
    params
  })
}