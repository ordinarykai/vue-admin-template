import request from '@/utils/request'

export function page(params) {
  return request({
    url: '/system/channel/page',
    method: 'get',
    params
  })
}

export function list(params) {
  return request({
    url: '/system/channel/list',
    method: 'get',
    params
  })
}

export function get(params) {
  return request({
    url: '/system/channel/get',
    method: 'get',
    params
  })
}

export function update(data) {
  return request({
    url: '/system/channel/update',
    method: 'post',
    data
  })
}

export function updateTimeShift(params) {
  return request({
    url: '/system/channel/update-time-shift',
    method: 'post',
    params
  })
}

export function updateSchedule(params) {
  return request({
    url: '/system/channel/update-schedule',
    method: 'post',
    params
  })
}

export function updateEnable(params) {
  return request({
    url: '/system/channel/update-enable',
    method: 'post',
    params
  })
}
