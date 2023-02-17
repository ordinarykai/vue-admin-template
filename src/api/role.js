import request from '@/utils/request'

export function page(params) {
  return request({
    url: '/system/role/page',
    method: 'get',
    params
  })
}

export function update(data) {
  return request({
    url: '/system/role/update',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/system/role/create',
    method: 'post',
    data
  })
}

export function deleteData(params) {
  return request({
    url: '/system/role/delete',
    method: 'post',
    params
  })
}

export function updateStatus(params) {
  return request({
    url: '/system/role/update-status',
    method: 'post',
    params
  })
}

export function select() {
  return request({
    url: '/system/role/select',
    method: 'get'
  })
}