import React, { useState, useRef, memo, useMemo, useCallback, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'

import { ReactComponent as MerchIcon } from 'assets/svg/merch.svg'
import { ReactComponent as MediaIcon } from 'assets/svg/media.svg'
import { ReactComponent as ArrowUpIcon } from 'assets/svg/arrow-up.svg'
import { ReactComponent as AttachIcon } from 'assets/svg/attach.svg'
import { getSelectedChat, sendMessage } from 'slices/chatSlice'
import Popper from 'components/Popper'
import Modal from 'components/Modal'
import MyProductsModal from 'containers/MyProductsModal'

import EmptyStateImage from 'assets/svg/empty/3.svg'
import MessagesList from './MessagesList'

function Chat() {
    const messageRef = useRef()
    const productsModalRef = useRef()
    const dispatch = useDispatch()
    const selectedChat = useSelector(getSelectedChat)
    const { me } = useSelector((state) => state.root)
    const { t } = useTranslation()
    const [msgHistory, setMsgHistory] = useState({})

    /* Message sending */
    const handleSendMessage = useCallback(async () => {
        const message = messageRef.current.innerText
        if (!message) {
            return
        }
        const msg = {
            _id: nanoid(),
            body: message.trim(),
            sender: { _id: me._id },
            createDate: new Date().toISOString(),
            chatId: selectedChat._id,
            isPending: true,
        }
        dispatch(sendMessage(msg))
        messageRef.current.innerText = ''
        setMsgHistory((prev) => ({ ...prev, [selectedChat._id]: '' }))
    }, [dispatch, me?._id, selectedChat?._id])

    const handleUpload = async (event) => {
        const file = event.target.files[0]

        let msg = {
            _id: nanoid(),
            sender: { _id: me._id },
            createDate: new Date().toISOString(),
            chatId: selectedChat._id,
            files: [
                {
                    _id: nanoid(),
                    objectUrl: URL.createObjectURL(file),
                    type: file.type.split('/')[0],
                    isBlob: true,
                },
            ],
            isPending: true,
            messageId: nanoid(),
        }

        dispatch(sendMessage(msg))
        event.target.value = ``
    }

    const handleSendProduct = (productId) => {
        let msg = {
            _id: nanoid(),
            sender: { _id: me._id },
            createDate: new Date().toISOString(),
            chatId: selectedChat._id,
            isPending: true,
            product: { _id: productId },
        }
        dispatch(sendMessage(msg))
    }

    const handleEnterPress = useCallback(
        async (event) => {
            if (event.key === 'Enter') {
                event.preventDefault()
                await handleSendMessage()
            }
        },
        [handleSendMessage],
    )

    const handleInput = useCallback(
        (event) => {
            setMsgHistory((prev) => ({ ...prev, [selectedChat._id]: event.target.innerText }))
        },
        [selectedChat._id],
    )

    const AttachMenu = () => {
        const [referenceElement, setReferenceElement] = useState(null)

        return (
            <div>
                <input
                    onChange={handleUpload}
                    id="attach-file"
                    type="file"
                    accept=".mp4,video/mp4,.jpg,.png,image/jpg,image/png"
                    className="hidden w-0 h-0"
                />
                <div ref={setReferenceElement} className="flex items-center justify-center w-9 h-9 cursor-pointer">
                    <AttachIcon className="text-gray-standard" />

                    <Popper referenceElement={referenceElement}>
                        <div
                            onClick={() => {
                                productsModalRef.current.open()
                            }}
                            className="grid grid-flow-col gap-1  items-center cursor-pointer hover:bg-gray-pale py-1.5 px-6">
                            <MerchIcon className="text-gray-standard" />
                            <div className="text-s">{t('product.single')}</div>
                        </div>
                        <div className="py-1.5 px-6 cursor-pointer hover:bg-gray-pale">
                            <label
                                className="grid grid-flow-col gap-1 items-center cursor-pointer"
                                htmlFor="attach-file">
                                <MediaIcon className="text-gray-standard" />
                                <div className="text-s">{t('file')}</div>
                            </label>
                        </div>
                    </Popper>
                </div>
            </div>
        )
    }

    const EmptyState = useMemo(() => {
        return (
            <div className="text-center flex flex-col w-full items-center h-full justify-center ">
                <img className="sq-140 mx-auto" src={EmptyStateImage} alt="" />
                <div className="text-s w-full mt-4 mx-auto">{t('yourConversationWillBeShownHere')}</div>
            </div>
        )
    }, [t])

    useLayoutEffect(() => {
        if (msgHistory[selectedChat._id] !== messageRef.current.innerText) {
            msgHistory[selectedChat._id] === undefined && setMsgHistory((prev) => ({ ...prev, [selectedChat._id]: '' }))
            messageRef.current.innerText = msgHistory[selectedChat._id] || ''
        }
    }, [msgHistory, selectedChat._id])
    return (
        <div className="flex flex-col h-full overflow-hidden py-5 bg-gray-pale rounded-2.5">
            {selectedChat?.messages?.length === 0 ? EmptyState : <MessagesList chatId={selectedChat._id} />}
            <div className="px-5">
                {selectedChat.isBlocked ? (
                    <div className="text-s font-normal tracking-0.01 text-center mb-1 mt-11">{`${t(
                        'youHaveBlockedUser',
                    )} ${selectedChat.user.name}`}</div>
                ) : (
                    <div className="grid grid-cols-1-a gap-x-2 items-center mt-5">
                        <div
                            onKeyPress={handleEnterPress}
                            onInput={handleInput}
                            ref={messageRef}
                            className="text-area overflow-auto max-h-148p customScrollBar text-s bg-white rounded-2.5 break-word px-5 py-3.5 min-h-12 cursor-text"
                            contentEditable={true}
                            aria-multiline={true}
                            suppressContentEditableWarning={true}
                            data-placeholder={t('enterMessage')}
                        />
                        {msgHistory[selectedChat._id] ? (
                            <div
                                onClick={handleSendMessage}
                                className="flex items-center justify-center w-9 h-9 bg-black-background hover:bg-violet-saturated transition-colors rounded-full text-white cursor-pointer">
                                <ArrowUpIcon className="w-4 h-4 stroke-current" />
                            </div>
                        ) : (
                            <AttachMenu />
                        )}
                    </div>
                )}

                <Modal size="md" ref={productsModalRef}>
                    <MyProductsModal onSubmit={handleSendProduct} closeModal={() => productsModalRef.current.close()} />
                </Modal>
            </div>
        </div>
    )
}

export default memo(Chat)
