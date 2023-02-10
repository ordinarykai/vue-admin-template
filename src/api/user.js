import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/system/auth/login',
    method: 'post',
    data
  })
}

export function getCode(data) {
  return request({
    url: '/common/code/verify-code',
    method: 'get',
    data
  })
}

export function getInfo() {
  return request({
    url: '/system/auth/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
