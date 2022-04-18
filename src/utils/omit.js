export const omit = (target, fields) => {
    const entries = Object.entries(target)

    return Object.fromEntries(entries.filter(([key]) => !fields.includes(key)))
}