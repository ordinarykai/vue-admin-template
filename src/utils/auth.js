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

export function treeToList(tree) {
  const temp = []
  tree.forEach(item => {
    const children = item['children']
    if(item.checkArr == 1){
      delete item['children']
      temp.push(item, ...treeToList(children))
    }
  });
  return temp
}

export function setMenu(menu = [], menuList = []) {
  const routeList = []
  const menuListTemp = []
  menuList.forEach(item => {
    menuListTemp.push(item.name)
  })
  menu.map((item, index) => {
    if (menuListTemp.includes(item.name)) {
      const number = routeList.push({ ...item, children: [] })
      item?.children?.map(it => {
        menuListTemp.includes(it.name) && routeList[number - 1]['children'].push(it)
      })
    }
  })
  return routeList
}