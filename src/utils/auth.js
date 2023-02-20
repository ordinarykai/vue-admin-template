import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setMenu(menu = [], menuList = []) {
  const routeList = []
  if(!menuList){
    return routeList
  }
  menu.map((item) => {
    if (menuList.includes(item.name)) {
      const number = routeList.push(item)
      routeList[number - 1]['children'] = setMenu(item.children, menuList)
    }
  })
  return routeList
}
