import React, { Fragment, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { isToday, isYesterday } from 'date-fns'

import MessageBlock from './MessageBlock'
import { getSelectedChat, setChatMessages } from 'slices/chatSlice'
import { useIntersect } from 'hooks/useIntersect'
import { useDateDelimiter } from 'hooks/useDateDelimiter'
import { getFullDateFormat, dateFromString } from 'utils/dateUtils'
import Loader from 'components/Loader'
import { usePrevious } from 'hooks/usePreviousValues'
import { listMessages } from 'requests/message-requests'
import Scrollbar from '../../components/Scrollbar'

const MessagesList = ({ chatId }) => {
    const dispatch = useDispatch()
    const { me } = useSelector((state) => state.root)
    const { areMessagesLoading, startChat } = useSelector((state) => state.chat)
    const { t } = useTranslation()
    const messageContainer = useRef()
    const [more, setMore] = useState(false)
    const { setNode } = useIntersect(() => setMore(true))
    const prevChatId = usePrevious(chatId)
    const scroll = useRef({
        value: null,
        isDisabled: true,
        restore(target) {
            if (target) {
                target.scrollTop = target.scrollHeight - this.value
            }
        },
        save(target) {
            if (target) {
                this.value = target.scrollHeight - target.scrollTop
            }
        },
    })
    const { isDelimited } = useDateDelimiter()
    const selectedChat = useSelector(getSelectedChat)
    const [isLoading, setIsLoading] = useState(false)
    const [isRefetching, setIsRefetching] = useState(false)
    const fetchMessages = useCallback(
        async ({ threshold, skip = 0, limit = 30 } = {}) => {
            const { items, thresholdMark, hasMore } = await listMessages({ chatId, skip, limit, threshold })

            dispatch(
                setChatMessages({
                    messages: items,
                    threshold: thresholdMark,
                    hasMore: hasMore,
                }),
            )
        },
        [chatId, dispatch],
    )

    useEffect(() => {
        if (more && !isRefetching) {
            scroll.current.save(messageContainer.current)
            scroll.current.isDisabled = false
            setIsRefetching(true)
            fetchMessages({
                skip: selectedChat.messages.length,
                threshold: selectedChat.threshold,
            }).then(() => {
                setMore((prev) => {
                    return prev && false
                })
                setIsRefetching(false)
            })
        }
    }, [more, selectedChat?.threshold, selectedChat.messages?.length, isRefetching, fetchMessages])

    useEffect(() => {
        if (!selectedChat.messages?.length) {
            if (startChat && startChat._id === selectedChat._id) {
                return
            }
            setIsLoading(true)
            fetchMessages().then(() => {
                setIsLoading(false)
            })
        }
    }, [chatId, selectedChat, fetchMessages, startChat])

    useLayoutEffect(() => {
        if (chatId !== prevChatId) {
            scroll.current.isDisabled = true
        }
    }, [chatId, prevChatId])

    useLayoutEffect(() => {
        if (!scroll.current.isDisabled) {
            scroll.current.restore(messageContainer.current)
        }
    }, [selectedChat.messages?.length])

    const formatDate = (date) => {
        if (isToday(date)) {
            return t('today')
        } else if (isYesterday(date)) {
            return t('yesterday')
        } else {
            return getFullDateFormat(date)
        }
    }

    const LoadDetector = useMemo(() => {
        if (selectedChat.hasMore) {
            return <div className="h-4" ref={(el) => setNode(el)}></div>
        } else {
            return null
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [selectedChat.hasMore])

    return !isLoading && !areMessagesLoading ? (
        <Scrollbar>
            <div ref={messageContainer} className="mt-auto px-5">
                {LoadDetector}
                {selectedChat.messages?.map((msg, i, list) => {
                    const createDate = dateFromString(msg.createDate)
                    return (
                        <Fragment key={msg._id}>
                            {isDelimited(createDate) && (
                                <div className="my-5 text-center text-xs text-gray-medium uppercase">
                                    {formatDate(createDate)}
                                </div>
                            )}
                            <div key={msg._id} className="mt-3 first:mt-0 pb-0.5">
                                <MessageBlock
                                    msg={msg}
                                    isMyMessage={me?._id === msg.sender?._id}
                                    isLast={i === list.length - 1}
                                />
                            </div>
                        </Fragment>
                    )
                })}
            </div>
        </Scrollbar>
    ) : (
        <div className="h-full flex items-center justify-center">
            <Loader theme="violet" />
        </div>
    )
}

export default memo(MessagesList)
