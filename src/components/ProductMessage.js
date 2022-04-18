import React, { memo } from 'react'
import PropTypes from 'prop-types'

import { formatCost } from '../utils/numberUtils'
import { chatMsgProps } from '../common/propTypes'
import { cropImage } from '../utils/cropImage'

const ProductMessage = ({ msg, labelPosition }) => {
    const [img] = msg.product?.photos || []
    const productLink = `/product/${msg.sender._id}/${msg.product._id}`
    return (
        <div>
            <a
                href={productLink}
                target="_blank"
                rel="noreferrer"
                className={`relative block sq-100 bg-gray-pale rounded-2.5 ${
                    labelPosition === 'left' ? 'ml-2.5' : 'mr-2.5'
                }`}>
                <img className="h-full w-full object-cover rounded-2.5" src={cropImage(img?.url, 100)} alt="" />
                <div
                    className={`absolute bottom-0 ${labelPosition === 'left' ? '-left-2.5' : '-right-2.5'} rounded-5 ${
                        msg.product.price.value.toString().length === 3 ? 'w-9 h-9' : 'p-2.5'
                    } flex items-center justify-center bg-black-background text-ms text-white`}>
                    ${formatCost(msg.product.price.value)}
                </div>
            </a>
            <a
                title={msg.product.name}
                href={productLink}
                target="_blank"
                rel="noreferrer"
                className={`block ${
                    labelPosition === 'left' ? 'ml-2.5' : ''
                } mt-2 text-s font-bold line-clamp-3 hover:underline`}>
                {msg.product.name}
            </a>
        </div>
    )
}
ProductMessage.defaultProps = {
    labelPosition: `right`,
}
ProductMessage.propTypes = {
    msg: chatMsgProps.isRequired,
    labelPosition: PropTypes.oneOf([`left`, `right`]),
}

export default memo(ProductMessage)
