import request from '@/utils/request'

export function page(params) {
  return request({
    url: '/system/accept-event/page',
    method: 'get',
    params
  })
}

export function updateLevel(data) {
  return request({
    url: '/system/accept-event/update-level',
    method: 'post',
    data
  })
}