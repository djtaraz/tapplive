import React, { useEffect, createContext, memo, useState, useContext } from 'react'
import io from 'socket.io-client'
import { receiveMessage, requestChats, requestMessages } from './slices/chatSlice'
import { useDispatch, useSelector } from 'react-redux'
import config from 'envConfig'

const SocketContext = createContext({ socket: null })
const SocketProvider = ({ children }) => {
    const dispatch = useDispatch()
    const { selectedChatId, startChat } = useSelector((state) => state.chat)
    const { isAuthenticated } = useSelector((state) => state.root)
    const [socketProvider, setSocketProvider] = useState()

    useEffect(() => {
        let socket
        if (isAuthenticated) {
            socket = io(config.socketUrl, {
                query: `sessionId=${localStorage.getItem('sessionId')}`,
                transports: ['websocket'],
            })
            socket.on('chats:newMessage', handleNewMessage)
            socket.on('reconnect', handleReconnect)
            setSocketProvider(socket)
        }

        return () => {
            if (socket) {
                socket.disconnect()
            }
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [isAuthenticated])

    const handleNewMessage = (msg) => {
        try {
            const message = JSON.parse(msg)
            dispatch(receiveMessage(message))
        } catch (error) {
            console.error(error)
        }
    }

    const handleReconnect = async () => {
        dispatch(requestChats({ startChat }))
        if (selectedChatId) {
            dispatch(requestMessages({ chatId: selectedChatId }))
        }
    }

    return <SocketContext.Provider value={{ socket: socketProvider }}>{children}</SocketContext.Provider>
}

export const useSocket = () => {
    const context = useContext(SocketContext)

    if (!context) {
        throw new Error('Component must be used inside the SocketProvider.')
    }

    return context.socket
}

export default memo(SocketProvider)
