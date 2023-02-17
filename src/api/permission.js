import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/system/permission/list',
    method: 'get',
    params
  })
}

export function getTree(params) {
  return request({
    url: '/system/permission/get-tree',
    method: 'get',
    params
  })
}

export function update(data) {
  return request({
    url: '/system/permission/update',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/system/permission/create',
    method: 'post',
    data
  })
}

export function deleteData(params) {
  return request({
    url: '/system/permission/delete',
    method: 'delete',
    params
  })
}