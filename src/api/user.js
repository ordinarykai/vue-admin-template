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

export function getBaseInfo() {
  return request({
    url: '/system/auth/base-info',
    method: 'get'
  })
}

export function getMenuTree() {
  return request({
    url: '/system/permission/get-login-tree',
    method: 'get'
  })
}


export function logout() {
  return request({
    url: '/system/auth/out',
    method: 'post'
  })
}

export function updatePwd(data) {
  return request({
    url: '/system/auth/update-pwd',
    method: 'post',
    data
  })
}
