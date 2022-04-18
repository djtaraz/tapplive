import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { sendMsg } from 'requests/message-requests'
import { alterMessage } from 'slices/chatSlice'
import BarSkeleton from 'components/Skeleton/BarSkeleton'
import { chatMsgProps } from 'common/propTypes'
import { ReactComponent as WarnIcon } from 'assets/svg/warning.svg'
import ProductMessage from 'components/ProductMessage'

const ChatProduct = ({ msg, isMyMessage }) => {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(!Boolean(msg.product.photos))
    const { t } = useTranslation()

    useEffect(
        () => {
            if ((msg.isPending || msg.isRetry) && !msg.isError) {
                sendMsg(msg.chatId, { productId: msg.product._id })
                    .then((message) => {
                        dispatch(alterMessage({ id: msg._id, message }))
                        setIsLoading(false)
                    })
                    .catch((err) => {
                        dispatch(alterMessage({ id: msg._id, message: { ...msg, isError: true } }))
                        if (err && err.response.data.error && err.response.data.error.id === 400.117) {
                            const errMsg = t('userHasBlockYou')
                            toast.error(
                                <div className="flex">
                                    <WarnIcon className="mr-2" /> {errMsg}
                                </div>,
                                {
                                    toastId: msg.chatId,
                                    autoClose: 2500,
                                },
                            )
                        }
                    })
            }
        },
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
        [msg.isRetry, msg.isPending, msg.isError, msg.product._id],
    )

    if (isLoading) {
        return (
            <div
                style={{
                    gridTemplateRows: 'auto auto',
                }}
                className="grid grid-cols-1 gap-y-2">
                <div className={`relative sq-100 rounded-2.5 bg-gray-pale ${isMyMessage ? 'ml-2.5' : 'mr-2.5'}`}>
                    <div
                        className={`absolute bottom-0 ${
                            isMyMessage ? '-left-2.5' : '-right-2.5'
                        } h-8.5 w-14 rounded-5 bg-gray-light`}></div>
                </div>
                <div className={isMyMessage ? 'ml-2.5' : 'mr-2.5'}>
                    <BarSkeleton bg="bg-gray-pale" width={100} height={20} />
                </div>
            </div>
        )
    }

    return <ProductMessage msg={msg} labelPosition={isMyMessage ? 'left' : 'right'} />
}

ChatProduct.propTypes = {
    msg: chatMsgProps.isRequired,
    isMyMessage: PropTypes.bool.isRequired,
}

export default memo(ChatProduct)
