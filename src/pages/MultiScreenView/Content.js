import { memo, useReducer, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { StreamContext } from '../Streams/StreamContext'
import Sidebar from '../Streams/Sidebar'
import { useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import { setError } from '../../slices/rootSlice'
import { useDispatch } from 'react-redux'
import Loader from 'components/Loader'
import SendDonationBtn from '../Streams/Content/components/StreamControls/StreamControlBtns/SendDonationBtn'
import StreamLabel from './StreamLabel'
import StreamViews from './StreamContent/StreamViews'
import streamReducer, { initialState, toggleSidebar, setStreams, updateMultiscreen } from 'pages/Streams/streamStorage'
import { ReactComponent as CollapseIcon } from 'assets/svg/collapse.svg'
import { useSocket } from 'SocketProvider'
import { postAuth } from '../../requests/axiosConfig'
import { streamStatus } from 'common/entities/stream'
import Modal from 'components/Modal'
import StreamEndedModal from '../Streams/Content/modals/user/StreamEndedModal'

const Content = ({ data }) => {
    const [state, streamDispatch] = useReducer(streamReducer, initialState)
    const dispatch = useDispatch()
    const { me } = useSelector((state) => state.root)
    const socket = useSocket()
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (data.every((r) => r.isSuccess === true)) {
            streamDispatch(setStreams(data.map((item) => item.data)))
        }
    }, [data])
    useEffect(() => {
        // refetch if last videoUrl is null
        if (state.streams !== null) {
            const badStream = state.streams.find((item) => item.videoUrl === null && item.status === streamStatus.live)
            badStream && queryClient.refetchQueries(['stream', badStream._id], { active: true })
        }
    }, [queryClient, state.streams])

    useEffect(() => {
        const currentStream = state && state.stream && state.stream._id
        if (socket) {
            socket.on('streams:status', (d) => {
                try {
                    const newStatus = JSON.parse(d)
                    streamDispatch(updateMultiscreen(newStatus))
                } catch (error) {
                    dispatch(setError({ error }))
                }
            })
        }

        return () => {
            if (socket && currentStream) {
                socket.off('streams:status')
                postAuth(`/streams/${currentStream}/chat/disconnect`)
            }
        }
    }, [socket, dispatch, state.stream, state])

    if (!state.stream || !state.streams) {
        return (
            <div className="h-full flex justify-center items-center">
                <Loader theme="violet" />
            </div>
        )
    }
    const handleSidebarCollapse = () => {
        streamDispatch(toggleSidebar())
    }
    return (
        <StreamContext.Provider
            value={{
                state,
                streamDispatch,
                isMe: me?._id === state.stream?.streamer._id,
                isAnswerForMe: me?._id === state.stream?.streamOrder?.user?._id,
            }}>
            <div className="relative h-full overflow-hidden z-10">
                <CollapseIcon
                    onClick={handleSidebarCollapse}
                    className={`absolute z-100 top-13 mt-12 right-4 cursor-pointer transition-all duration-500 stroke-current transform ${
                        state.isSidebarCollapsed ? 'opacity-50 rotate-180' : ''
                    }`}
                />
                <div
                    style={{
                        willChange: 'right',
                        right: state.isSidebarCollapsed ? '-20px' : '321px',
                        transition: 'right 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    className="absolute h-full top-5 left-0 pr-5">
                    <StreamViews />
                </div>

                <div
                    style={{
                        willChange: 'transform',
                        width: '321px',
                        transitionDelay: state.isSidebarCollapsed ? '0s' : '0.015s',
                    }}
                    className={`absolute bottom-5 top-5 right-0 max-w-xs transform transition-transform duration-700 flex flex-col ease-in-out ${
                        state.isSidebarCollapsed ? 'translate-x-full' : 'translate-x-0'
                    }`}>
                    <div className="flex justify-between w-full mb-3.5">
                        <StreamLabel />
                        <SendDonationBtn text={t('donation')} />
                    </div>
                    <div className="flex-1">
                        <Sidebar shouldChangeColor={false} />
                    </div>
                </div>
            </div>
            {state.stream?.haveTicket && state.stream?.closeStream && me?._id !== state.stream?.streamer._id && (
                <Modal isOpened={true}>
                    <StreamEndedModal />
                </Modal>
            )}
        </StreamContext.Provider>
    )
}

export default memo(Content)
