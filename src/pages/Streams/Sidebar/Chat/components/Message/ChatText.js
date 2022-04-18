import React, { memo } from 'react'
import Linkify from 'linkifyjs/react'

const ChatText = ({ text }) => {

    return (
        <span className='text-xs break-word'>
            <Linkify
                options={{
                    format: (value, type) => {
                        if (type === 'url' && value.length > 50) {
                            value = value.slice(0, 50) + '…'
                        }
                        return value
                    },
                    className: 'text-violet-saturated hover:underline',
                }}>
                {text}
            </Linkify>
        </span>
    )
}

export default memo(ChatText)