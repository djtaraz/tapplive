const concatSegment = (value, isLast) => (isLast ? value : `${value},`)

export function reduceList(fieldList) {
    return fieldList.reduce((result, value, index, list) => {
        if (typeof value === 'string' || value instanceof String) {
            result += value
        } else {
            result += reduceFields(value)
        }
        return concatSegment(result, index === list.length - 1)
    }, '')
}

function reduceFields(fields) {
    if ({}.toString.call(fields) !== '[object Object]') {
        throw new Error('Provide an object')
    }
    if (Object.keys(fields).length === 0) {
        return ''
    }

    return Object.entries(fields).reduce((result, [key, value], index, list) => {
        result += `${key}(${reduceList(value)})`
        return concatSegment(result, index === list.length - 1)
    }, '')
}

reduceFields({
    items: [
        {
            user: [
                'name',
                'photo',
                {
                    tLevel: [
                        {
                            misc: ['icon', 'frameColors'],
                        },
                    ],
                },
            ],
        },
        'totalSpentAndEarned',
    ],
})

export default reduceFields
