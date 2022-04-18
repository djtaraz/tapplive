export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export const getLocationParam = (param) => {
    let params = new URL(document.location).searchParams
    return params.get(param)
}

export const setLocationParam = (key, value) => {
    const url = new URL(window.location.href)
    url.searchParams.set(key, value)
    window.history.replaceState(null, null, url)
}

export const deleteLocationParam = (key) => {
    const url = new URL(window.location.href)
    url.searchParams.delete(key)
    window.history.replaceState(null, null, url)
}
