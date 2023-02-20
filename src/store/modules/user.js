import { login, logout, getBaseInfo } from '@/api/user'
import { getToken, setToken, removeToken, setMenu } from '@/utils/auth'
import { resetRouter } from '@/router'
import router, { dynamicRoutes } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, uuid, code } = userInfo
    return new Promise((resolve, reject) => {
      const reqVO = { username: username.trim(), password: password, uuid: uuid, code: code }
      login(reqVO).then(response => {
        commit('SET_TOKEN', response.data.token)
        setToken(response.data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getBaseInfo({ commit }) {
    // 重置路由
    resetRouter()
    // 获取用户基本信息
    return new Promise((resolve, reject) => {
      getBaseInfo().then(response => {
        // 存储用户账号
        commit('SET_NAME', response.data.username)
        // 添加用户权限-动态路由
        const menuList = setMenu(dynamicRoutes, response.data.permissions)
        router.addRoutes([...menuList, { path: '*', redirect: '/404', hidden: true }])
        router.options.routes = router.options.routes.concat(menuList)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

