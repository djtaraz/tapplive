import PropTypes from 'prop-types'

export const idProp = PropTypes.string.isRequired

export const imageProp = PropTypes.shape({
    _id: idProp,
    url: PropTypes.string.isRequired,
})

export const priceProp = PropTypes.shape({
    currency: PropTypes.oneOf(['usd']).isRequired,
    value: PropTypes.number.isRequired,
})

export const childrenProp = PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])

export const statusProp = PropTypes.oneOf([
    'live',
    'closed',
    'announcement',
    'archived',
    'suspended',
    'active',
    'pending',
])

export const refProp = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
])

export const streamProp = {
    _id: idProp,
    name: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    cover: imageProp,
    streamer: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        photo: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
        }),
    }).isRequired,
    tags: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        }),
    ).isRequired,
    status: statusProp.isRequired,
    price: priceProp.isRequired,
    viewerCount: PropTypes.number.isRequired,
    subscriberCount: PropTypes.number.isRequired,
    isPrivate: PropTypes.bool.isRequired,
}

export const orderProp = {
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        }),
    ).isRequired,
    cover: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
    }).isRequired,
    startDate: PropTypes.string.isRequired,
    user: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        photo: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
        }),
    }).isRequired,
    isPrivate: PropTypes.bool.isRequired,
    status: statusProp.isRequired,
    price: priceProp.isRequired,
    confirmedPerformers: PropTypes.arrayOf(
        PropTypes.shape({
            _id: idProp,
        }),
    ),
}

export const userProps = {
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    subscriberCount: PropTypes.number.isRequired,
    photo: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
    }),
}

export const chatMsgProps = PropTypes.shape({
    _id: idProp,
    body: PropTypes.string,
    chatId: PropTypes.string.isRequired,
    createDate: PropTypes.string,
    file: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
        }),
    ),
    product: PropTypes.shape({
        _id: idProp,
        name: PropTypes.string,
        price: priceProp,
        photos: PropTypes.arrayOf(imageProp),
    }),
    sender: PropTypes.shape({
        _id: PropTypes.string,
        photo: imageProp,
    }),
})
