import reduceFields, { reduceList } from '../../utils/reduceFields'

export const phoneCodesList = (lang) =>
    reduceFields({
        items: ['code', { country: [{ name: [lang || 'ru'] }, 'flag', 'iso'] }],
    })

export const userSessionID = reduceList(['sessionId', { user: ['status'] }])

export const tagsList = reduceFields({
    items: ['name', 'postCount'],
})

export const userFavoriteTags = reduceList(['favoriteTags'])
