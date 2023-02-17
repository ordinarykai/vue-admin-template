import request from '@/utils/request'

export function page(params) {
  return request({
    url: '/system/admin/page',
    method: 'get',
    params
  })
}

export function update(data) {
  return request({
    url: '/system/admin/update',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/system/admin/create',
    method: 'post',
    data
  })
}

export function deleteData(params) {
  return request({
    url: '/system/admin/delete',
    method: 'delete',
    params
  })
}

export function updateStatus(params) {
  return request({
    url: '/system/admin/update-status',
    method: 'post',
    params
  })
}

export function resetPwd(data) {
  return request({
    url: '/system/admin/reset-pwd',
    method: 'post',
    data
  })
}