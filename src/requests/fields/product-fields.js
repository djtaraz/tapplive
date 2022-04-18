import reduceFields from 'utils/reduceFields'

const productFields = {
    items: [
        'photos',
        'name',
        'price'
    ]
}

export default reduceFields(productFields)