import React, { memo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { setError } from 'slices/rootSlice'
import { postAuth } from 'requests/axiosConfig'
import { useStream } from '../../../StreamContext'

const ChatControl = ({ children }) => {
    const dispatch = useDispatch()
    const { state } = useStream()
    const { stream } = state
    const [text, setText] = useState('')
    const [isMessageSending, setIsMessageSending] = useState(false)
    const messageBoxRef = useRef()
    const { t } = useTranslation()
    const inputCn = `flex-1 text-area customScrollBar text-s bg-white rounded-2.5 break-word px-5 py-3.5 min-h-12 cursor-text max-h-36 overflow-auto transition-all ease-in-out`

    const handleSendMessage = async () => {
        if (text) {
            const body = text.trim()
            if (body) {
                setIsMessageSending(true)
                try {
                    await postAuth(`/streams/${stream._id}/chat/messages`, {
                        body: text.trim(),
                    })
                    setText('')
                    messageBoxRef.current.innerText = ''
                } catch (error) {
                    dispatch(setError({ message: 'Failed to send the message.', error }))
                } finally {
                    setIsMessageSending(false)
                }
            }
        }
    }
    const handleEnterPress = async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            if (!isMessageSending) {
                handleSendMessage()
            }
        }
    }
    const handleInput = (event) => {
        setText(event.target.innerText)
    }

    const handleSendIcon = () => {
        if (!isMessageSending) {
            handleSendMessage()
        }
    }

    return (
        <div className="flex items-end p-5 pb-0">
            <div
                onKeyPress={handleEnterPress}
                onInput={handleInput}
                ref={messageBoxRef}
                className={inputCn}
                contentEditable={true}
                aria-multiline={true}
                suppressContentEditableWarning={true}
                data-placeholder={t('enterMessage')}
            />
            {children(text, handleSendIcon)}
        </div>
    )
}

export default memo(ChatControl)
