export const delay = (interval) => {
    return new Promise((resolve) => {
        setTimeout(resolve, interval)
    })
}