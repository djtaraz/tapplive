import React, { useState, useEffect, memo, useCallback, useMemo } from 'react'
import SearchInput from 'components/SearchInput'
import { useTranslation } from 'react-i18next'

import ChatItem from './ChatItem'
import Chat from './Chat'
import { useDispatch, useSelector } from 'react-redux'
import { clearChat, requestChats, requestChatsByThreshold, setUserOnlineStatus } from 'slices/chatSlice'
import { useSocket } from 'SocketProvider'
import CircleSkeleton from 'components/Skeleton/CircleSkeleton'
import BarSkeleton from 'components/Skeleton/BarSkeleton'
import EmptyStateImage from 'assets/svg/empty/3.svg'
import Scrollbar from '../../components/Scrollbar'

function ChatList() {
    const socket = useSocket()
    const dispatch = useDispatch()
    const { chats, areChatsLoading, selectedChatId, chatThreshold, startChat } = useSelector((state) => {
        return state.chat
    })
    const [searchInput, setSearchInput] = useState('')
    const { t } = useTranslation()

    useEffect(() => {
        dispatch(requestChats({ startChat }))

        return () => {
            dispatch(clearChat())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    useEffect(() => {
        dispatch(requestChatsByThreshold({ chatThreshold: { ...chatThreshold }, startChat }))
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [chatThreshold])

    useEffect(() => {
        if (socket) {
            socket.on('chatUsers:online', (d) => {
                try {
                    dispatch(setUserOnlineStatus(JSON.parse(d)))
                } catch (error) {
                    console.error(error)
                }
            })
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [socket])

    const ChatItemsSkeleton = useMemo(
        () =>
            Array(3)
                .fill(1)
                .map((_, i) => (
                    <div
                        key={`skeleton-chat-item[${i}`}
                        style={{ gridTemplateColumns: 'auto 1fr' }}
                        className="grid grid-rows-2 items-center gap-x-3.5 pl-3 pr-5 py-3">
                        <div className="row-span-full">
                            <CircleSkeleton bg="bg-gray-pale" radius={60} />
                        </div>
                        <BarSkeleton bg="bg-gray-pale" width="100%" />
                        <BarSkeleton bg="bg-gray-pale" width="60%" />
                    </div>
                )),
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
        [],
    )

    const handleSearch = useCallback((event) => {
        setSearchInput(event.target.value)
    }, [])

    const filteredChats = useMemo(() => {
        if (!searchInput) {
            return chats?.length > 0 ? (
                chats.map((chat) => <ChatItem chat={chat} key={chat._id} isActive={chat._id === selectedChatId} />)
            ) : (
                <div className="text-s text-center">{t('youHaveNoConversation')}</div>
            )
        } else {
            const filteredChats = chats.filter((chat) =>
                chat.user.name?.toLowerCase().includes(searchInput?.toLowerCase()),
            )

            return filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                    <ChatItem chat={chat} key={chat._id} isActive={chat._id === selectedChatId} />
                ))
            ) : (
                <div className="text-gray-dark py-2">{t('notFoundMsg')}</div>
            )
        }
    }, [searchInput, chats, selectedChatId, t])

    return (
        <div className="h-full py-10">
            <div style={{ maxWidth: '840px' }} className="relative h-full mx-auto overflow-hidden">
                <div className="absolute w-2/5 h-full flex flex-col">
                    <SearchInput placeholder={t('searchUsers')} value={searchInput} onChange={handleSearch} />
                    <Scrollbar>
                        <div className="mt-3 pr-2.5">
                            <div>{!areChatsLoading ? filteredChats : ChatItemsSkeleton}</div>
                        </div>
                    </Scrollbar>
                </div>
                <div className="absolute right-0 w-3/5 pl-3 h-full self-stretch">
                    {selectedChatId ? (
                        <Chat />
                    ) : (
                        <div className="bg-gray-pale rounded-2.5 text-s h-full flex flex-col items-center justify-center">
                            <img className="sq-140 mx-auto" src={EmptyStateImage} alt="" />
                            <div className="w-3/4 text-center mt-4">{t('noChatSelected')}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default memo(ChatList)
