import reduceFields from 'utils/reduceFields'

export const phoneCodesList = (lang) =>
    reduceFields({
        items: ['code', { country: [{ name: [lang] }, 'flag', 'iso'] }],
    })
