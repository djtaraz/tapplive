import React, { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { sendMsg } from 'requests/message-requests'
import { alterMessage } from 'slices/chatSlice'
import { useDispatch } from 'react-redux'
import { chatMsgProps } from 'common/propTypes'
import { setError } from 'slices/rootSlice'
import Linkify from 'linkifyjs/react'

const ChatText = ({ msg }) => {
    const dispatch = useDispatch()
    const { t } = useTranslation()

    useEffect(
        () => {
            if (msg.body && (msg.isPending || msg.isRetry) && !msg.isError) {
                sendMsg(msg.chatId, { body: msg.body, messageId: msg.messageId })
                    .then((message) => {
                        dispatch(alterMessage({ id: msg._id, message }))
                    })
                    .catch((error) => {
                        dispatch(alterMessage({ id: msg._id, message: { ...msg, isError: true } }))
                        if (error && error.response?.data.error && error.response.data.error.id === 400.117) {
                            dispatch(setError({ message: t('userHasBlockYou'), error }))
                        }
                    })
            }
        },
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
        [msg.isRetry, msg.isPending, msg.isError],
    )

    return (
        <div className='text-s break-word'>
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
                {msg.body}
            </Linkify>
        </div>
    )
}

ChatText.propTypes = {
    msg: chatMsgProps.isRequired,
}

export default memo(ChatText)
