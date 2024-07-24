export const clearCache = () => {
    JSON.parse(localStorage.vuex).showMenus = []
}
