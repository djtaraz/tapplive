import React, { memo, useRef, useMemo, useState, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { useDispatch, useSelector } from 'react-redux'

import Avatar from 'components/Avatar'
import { alterChat, readChat, selectChat } from 'slices/chatSlice'
import { ReactComponent as InfoIcon } from 'assets/svg/info.svg'
import Popper from 'components/Popper'
import { chatMsgProps, idProp, imageProp } from 'common/propTypes'
import { blockChat, disableNotifications, enableNotifications, unblockChat } from 'requests/chat-requests'
import UserReportModal from 'containers/UserReportModal'
import Modal from 'components/Modal'

const settingsItemCn = cn('text-s py-1.5 px-6')
function ChatItem({ chat, isActive }) {
    const dispatch = useDispatch()
    const { me } = useSelector((state) => state.root)
    const userReportModalRef = useRef()
    const [areSettingsVisible, setAreSettingsVisible] = useState(false)
    const { t } = useTranslation()
    const isLastMessageUnread = chat.unreadCount > 0
    const [file] = chat.lastMessage?.files || []
    const chatClasses = cn(
        'relative grid grid-cols-a-1 cursor-pointer grid grid-rows-2 items-center gap-x-3.5 pl-3 pr-14 py-3',
        { 'rounded-2.5 bg-gray-pale': isActive },
    )
    const lastMessageCn = cn('text-s truncate self-start', { 'font-bold': isLastMessageUnread })
    const chatRef = useRef()

    useLayoutEffect(() => {
        if (isActive && chatRef.current) {
            queueMicrotask(() => chatRef.current?.scrollIntoView({ block: 'center' }))
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [])

    const type = useMemo(() => {
        if (chat.lastMessage?.files?.length) {
            return 'file'
        } else if (chat.lastMessage?.product) {
            return 'product'
        } else {
            return 'text'
        }
    }, [chat.lastMessage])

    const settingsItems = useMemo(
        () => [
            {
                title: chat.settings.showNotifications ? t('disableNotifications') : t('enableNotifications'),
                action: !chat.isBlocked
                    ? async () => {
                          let newChat
                          if (chat.settings.showNotifications) {
                              newChat = await disableNotifications(chat._id)
                          } else {
                              newChat = await enableNotifications(chat._id)
                          }
                          dispatch(alterChat(newChat))
                      }
                    : null,
                cn: cn(settingsItemCn, {
                    'text-gray-standard ': chat.isBlocked,
                    'cursor-pointer hover:bg-gray-pale': !chat.isBlocked,
                }),
            },
            {
                title: chat.isBlocked ? t('unblock') : t('block'),
                action: async () => {
                    let newChat
                    if (chat.isBlocked) {
                        newChat = await unblockChat(chat._id)
                    } else {
                        newChat = await blockChat(chat._id)
                    }
                    dispatch(alterChat(newChat))
                },
                cn: cn('cursor-pointer hover:bg-gray-pale', settingsItemCn),
            },
            {
                title: t('report'),
                action: () => {
                    userReportModalRef.current.open()
                    setAreSettingsVisible(false)
                },
                cn: cn('cursor-pointer hover:bg-gray-pale', settingsItemCn),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [t, chat._id, chat.isBlocked, chat.settings.showNotifications],
    )

    const handleClick = async () => {
        if (chat.unreadCount > 0) {
            dispatch(readChat(chat._id))
        }
        dispatch(selectChat(chat._id))
    }
    const [referenceElement, setReferenceElement] = useState(null)

    const Settings = useMemo(
        () => (
            <div ref={setReferenceElement} className="absolute right-6.5 cursor-pointer pb-2 z-150">
                <InfoIcon />

                <Popper referenceElement={referenceElement}>
                    {settingsItems.map((item) => (
                        <div onClick={item.action} key={item.title} className={item.cn}>
                            {item.title}
                        </div>
                    ))}
                </Popper>
            </div>
        ),
        [referenceElement, settingsItems],
    )

    const getFileMessage = (sender, type) => {
        const isMyMessage = sender?._id === me?._id
        if (type === 'image') {
            return isMyMessage ? t('youSentImage') : t('imageSentToYouBy')
        } else {
            return isMyMessage ? t('youSentVideo') : t('videoSentToYouBy')
        }
    }

    const LastMessage = useMemo(() => {
        const isMyMessage = chat.lastMessage?.sender?._id === me?._id
        if (type === 'file') {
            return getFileMessage(chat.lastMessage.sender, file.type)
        } else if (type === 'product') {
            return isMyMessage ? t('youSentProduct') : t('productSentToYouBy')
        } else {
            return chat.lastMessage?.body || ''
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [type, chat.lastMessage, t])

    return (
        <div
            ref={chatRef}
            // ref={el => {
            //     if (isActive && el) {
            //         el.scrollIntoView({ block: 'center' })
            //     }
            // }}
            onMouseEnter={() => setAreSettingsVisible(true)}
            onMouseLeave={() => setAreSettingsVisible(false)}
            onClick={handleClick}
            className={chatClasses}>
            <div className="inline-block row-span-full">
                <Avatar
                    to={`/user/${chat.user._id}`}
                    size="m"
                    photoUrl={chat.user.photo?.url}
                    crop="60x60"
                    isOnline={chat.user.isOnline}
                />
            </div>
            <div className="text-s font-bold truncate">{chat.user.name}</div>
            <div className={lastMessageCn}>{LastMessage}</div>
            {isLastMessageUnread && <div className="absolute right-3 w-2 h-2 rounded-full bg-pink-dark"></div>}
            {areSettingsVisible && Settings}
            <Modal ref={userReportModalRef}>
                <UserReportModal userId={chat.user._id} onClose={() => userReportModalRef.current?.close()} />
            </Modal>
        </div>
    )
}

ChatItem.propTypes = {
    chat: PropTypes.shape({
        _id: idProp,
        lastMessage: chatMsgProps.isRequired,
        unreadCount: PropTypes.number.isRequired,
        updateDate: PropTypes.string.isRequired,
        user: PropTypes.shape({
            isOnline: PropTypes.bool,
            name: PropTypes.string,
            photo: imageProp,
            _id: idProp,
        }),
    }),
}

export default memo(ChatItem)
