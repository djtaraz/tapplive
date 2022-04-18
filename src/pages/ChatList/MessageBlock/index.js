import React, { memo, useRef, useMemo, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import Avatar from 'components/Avatar'
import { ReactComponent as ClockIcon } from 'assets/svg/clock.svg'
import { removeMessage, sendMessage } from 'slices/chatSlice'
import { omit } from 'utils/omit'
import { chatMsgProps } from 'common/propTypes'
import { localTimeFormat, dateFromString } from 'utils/dateUtils'
import FileMsg from './ChatFile'
import TextMsg from './ChatText'
import ProductMsg from './ChatProduct'
import FailedMsgSettings from './FailedMsgSettings'

function MessageBlock({ msg, isMyMessage, isLast }) {
    const dispatch = useDispatch()
    const ref = useRef()
    const { t } = useTranslation()

    const type = useMemo(() => {
        if (msg?.files?.length) {
            return 'file'
        } else if (msg?.product) {
            return 'product'
        } else {
            return 'text'
        }
    }, [msg.files, msg.product])

    const msgContainerClasses = cn('items-end', {
        'w-full flex justify-end': isMyMessage,
        'w-full grid grid-flow-col gap-x-2 grid-cols-a-1 justify-start': !isMyMessage,
    })
    const msgClasses = cn('relative bg-white p-3.5 rounded-t-3', {
        'rounded-bl-3 rounded-br-1 justify-self-end': isMyMessage,
        'rounded-bl-1 rounded-br-3 justify-self-start': !isMyMessage,
    })
    const timeClasses = cn(
        'absolute bottom-0 leading-none grid gap-1 grid-flow-col items-center text-xxs transform text-gray-medium whitespace-nowrap',
        {
            'right-full -translate-x-2': isMyMessage,
            'left-full translate-x-2': !isMyMessage,
        },
    )

    useLayoutEffect(() => {
        if (isLast) {
            ref.current.scrollIntoView(false)
        }
    }, [isLast])

    const failedMsgSettings = useMemo(
        () => [
            {
                title: t('retryMsg'),
                onClick: () => {
                    dispatch(
                        sendMessage(
                            omit(
                                {
                                    ...msg,
                                    createDate: new Date(),
                                    isRetry: true,
                                },
                                ['isCancelled', 'isError'],
                            ),
                        ),
                    )
                },
            },
            {
                title: t('cancelMsg'),
                onClick: () => {
                    dispatch(removeMessage({ chatId: msg.chatId, msgId: msg._id }))
                },
            },
        ],
        [t, dispatch, msg],
    )

    const Message = useMemo(() => {
        if (type === 'file') {
            return <FileMsg msg={msg} />
        } else if (type === 'product') {
            return <ProductMsg isMyMessage={isMyMessage} msg={msg} />
        } else {
            return <TextMsg msg={msg} />
        }
    }, [type, msg, isMyMessage])

    return (
        <div ref={ref} className={msgContainerClasses}>
            {!isMyMessage && (
                <Avatar photoUrl={msg.sender.photo?.url} size="xs" to={`/user/${msg.sender._id}`} crop="50x50" />
            )}
            <div className={msgClasses} style={{ maxWidth: '85%' }}>
                {Message}
                {isMyMessage && (msg.isError || msg.isCancelled) && <FailedMsgSettings items={failedMsgSettings} />}
                <div className={timeClasses}>
                    <div>{localTimeFormat(dateFromString(msg.createDate))}</div>
                    {!(msg.isError || msg.isCancelled) && msg.isPending && <ClockIcon />}
                </div>
            </div>
        </div>
    )
}

MessageBlock.defaultProps = {
    isMyMessage: false,
    isLast: false,
}
MessageBlock.propTypes = {
    msg: chatMsgProps.isRequired,
    isMyMessage: PropTypes.bool,
    isLast: PropTypes.bool,
}

export default memo(MessageBlock)
