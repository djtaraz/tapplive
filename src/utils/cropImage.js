export const cropImage = (url, width, height = width) => {
    const pixelRatio = Math.round(window.devicePixelRatio)
    return `${url}/${width * pixelRatio}x${height * pixelRatio}`
}
