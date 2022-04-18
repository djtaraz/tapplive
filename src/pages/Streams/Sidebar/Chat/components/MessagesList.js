import React, { memo, useLayoutEffect, useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useInfiniteQuery } from 'react-query'

import { useIntersect } from 'hooks/useIntersect'
import Loader from 'components/Loader'
import { getStreamMessages } from 'requests/stream-requests'
import { setError } from 'slices/rootSlice'
import { useSocket } from 'SocketProvider'
import { postAuth } from 'requests/axiosConfig'
import { isStreamActive } from '../../../helpers'
import { useStream } from '../../../StreamContext'
import Message from './Message'

import { useTranslation } from 'react-i18next'
import EmptyStateImage from 'assets/svg/empty/3.svg'
import Scrollbar from 'components/Scrollbar'

const limit = 30
const MessagesList = () => {
    const dispatch = useDispatch()
    const socket = useSocket()
    const { state } = useStream()
    const { stream } = state
    const messagesContainerRef = useRef()
    const [more, setMore] = useState(false)
    const { setNode } = useIntersect(() => setMore(true))
    const [messages, setMessages] = useState([])
    const newMessage = useRef(false)
    const firstLoad = useRef(true)
    const { t } = useTranslation()

    const scroll = useRef({
        value: null,
        restore() {
            if (messagesContainerRef.current) {
                messagesContainerRef.current.scrollTop(this.value)
            }
        },
        save() {
            if (messagesContainerRef.current) {
                this.value = messagesContainerRef.current.getScrollTop()
            }
        },
    })
    const { isIdle, isLoading, hasNextPage, fetchNextPage, data, refetch } = useInfiniteQuery(
        ['chatMessages', stream._id],
        async function () {
            const { queryKey, pageParam } = arguments[0]
            const [, id] = queryKey
            const { thresholdMark, skip } = pageParam || {}

            return await getStreamMessages({ streamId: id, skip, limit, thresholdMark })
        },
        {
            getNextPageParam(fromQueryFn, pages) {
                return (
                    fromQueryFn.hasMore && {
                        thresholdMark: fromQueryFn.thresholdMark,
                        skip: pages?.length * limit || 0,
                    }
                )
            },
            onError(error) {
                dispatch(setError({ message: 'Failed to fetch messages.', error }))
            },
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            enabled: false,
            cacheTime: 0,
        },
    )

    useEffect(() => {
        if (data?.pages) {
            const pagesCopy = [...data.pages]
            pagesCopy.reverse()
            setMessages(
                pagesCopy.flatMap((page) => {
                    const i = [...page.items]
                    i.reverse()
                    return i
                }),
            )
        }
    }, [data?.pages])
    const handleNewMessage = useCallback(
        (newMsg) => {
            try {
                newMessage.current = true
                const parsedMsg = JSON.parse(newMsg)
                if (parsedMsg.streamId === stream._id) {
                    setMessages((prevMessages) => [...prevMessages, parsedMsg])
                }
            } catch (error) {
                dispatch(setError({ error }))
            }
        },
        [stream._id, dispatch],
    )
    useEffect(() => {
        socket && socket.on('streamChats:newMessage', handleNewMessage)
        if (isStreamActive(stream.status)) {
            postAuth(`/streams/${stream._id}/chat/connect`).then(() => {
                return refetch()
            })
            socket && socket.on('reconnect', refetch)
        } else {
            refetch()
        }

        return () => {
            socket && socket.off('streamChats:newMessage', handleNewMessage)
            if (isStreamActive(stream.status)) {
                socket && socket.off('reconnect', refetch)
                // postAuth(`/streams/${stream._id}/chat/disconnect`)
            }
        }
    }, [stream._id, stream.status, refetch, socket, handleNewMessage])

    useEffect(() => {
        if (more) {
            scroll.current.save()
            fetchNextPage().then(() => {
                setMore(false)
            })
        }
    }, [more, fetchNextPage])
    useLayoutEffect(() => {
        if ((firstLoad.current || newMessage.current) && messages.length) {
            if (messagesContainerRef.current) {
                messagesContainerRef.current.scrollToBottom()
            }

            newMessage.current = false
            if (firstLoad.current) {
                firstLoad.current = false
            }
        } else {
            scroll.current.restore()
        }
    }, [messages.length])

    const EmptyState = useMemo(() => {
        return (
            <div className="text-center flex flex-1 flex-col w-full items-center justify-center ">
                <img className="sq-140 mx-auto" src={EmptyStateImage} alt="" />
                <div className="text-s w-full mt-4 mx-auto">
                    {t('welcomeToChat')} ! <br />
                    {t('messageWillBeShownHere')}
                </div>
            </div>
        )
    }, [t])

    if (isLoading || isIdle) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader theme="violet" />
            </div>
        )
    }

    return (
        <Scrollbar
            ref={messagesContainerRef}
            renderView={({ style, ...props }) => {
                return <div className="px-5 py-3.5 flex flex-col" style={{ ...style }} {...props} />
            }}>
            {hasNextPage && messages.length && <div ref={setNode}></div>}
            {messages.map((msg) => (
                <Message key={msg._id} msg={msg} />
            ))}

            {messages.length === 0 && EmptyState}
        </Scrollbar>
    )
}

export default memo(MessagesList)
