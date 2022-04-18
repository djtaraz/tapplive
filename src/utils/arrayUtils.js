export const array = (n, fill = 1) => Array(n).fill(fill)

export const uniqify = (array, key) =>
    array.reduce((prev, curr) => (prev.find((a) => a[key] === curr[key]) ? prev : prev.push(curr) && prev), [])
