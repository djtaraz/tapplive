export const format = (value) => {
    return typeof value === "number" ? `${value}px` : value
}