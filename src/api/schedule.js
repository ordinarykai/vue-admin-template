import request from '@/utils/request'

export function page(params) {
  return request({
    url: '/system/schedule/page',
    method: 'get',
    params
  })
}

export function create(data) {
  return request({
    url: '/system/schedule/create',
    method: 'post',
    data
  })
}

export function deleteData(params) {
  return request({
    url: '/system/schedule/delete',
    method: 'post',
    params
  })
}

export function update(data) {
  return request({
    url: '/system/schedule/update',
    method: 'post',
    data
  })
}