import { useEffect, memo, useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import StreamContent from './Content'
import Loader from 'components/Loader'
import Sidebar from './Sidebar'
import { getStreamDetails } from 'requests/stream-requests'
import { useServerSettings } from 'hooks/useServerSettings'
import { StreamContext } from './StreamContext'
import streamReducer, { initialState, setStream, toggleSidebar, updateStream, resetStorage } from './streamStorage'
import { useSocket } from 'SocketProvider'
import { ReactComponent as CollapseIcon } from '../../assets/svg/collapse.svg'
import { postAuth } from '../../requests/axiosConfig'
import { setError, setFooterVisibility } from '../../slices/rootSlice'
import { useLocation } from 'wouter'
import { streamStatus } from 'common/entities/stream'
import { routes } from 'routes'
import { nanoid } from 'nanoid'

function Stream({ params }) {
    const socket = useSocket()
    const dispatch = useDispatch()
    const { me } = useSelector((state) => state.root)
    const [state, streamDispatch] = useReducer(streamReducer, initialState)
    const { t } = useTranslation()
    const [, setLocation] = useLocation()
    const serverSettings = useServerSettings()
    const { isLoading } = useQuery({
        queryKey: ['stream', params.id],
        queryFn: ({ queryKey }) => {
            const [, streamId] = queryKey
            return getStreamDetails({ streamId })
        },
        onSuccess: (data) => streamDispatch(setStream(data)),
        onError: (error) => {
            setLocation(routes.feed.path)
            dispatch(setError({ message: t('objectNotFound'), error, id: nanoid() }))
        },
        retry: 1,
        refetchOnWindowFocus: false,
    })
    const queryClient = useQueryClient()
    useEffect(() => {
        return () => {
            resetStorage()
        }
    }, [])
    useEffect(() => {
        dispatch(setFooterVisibility(false))
        return () => {
            dispatch(setFooterVisibility(true))
        }
    }, [dispatch])
    useEffect(() => {
        // refetch if last videoUrl is null
        if (state && state.stream) {
            if (state.stream.videoUrl === null && state.stream.status === streamStatus.live) {
                queryClient.refetchQueries(['stream', params.id], { active: true })
            }
        }
    }, [params.id, queryClient, state])

    useEffect(() => {
        if (
            !(me?._id === state.stream?.streamOrder?.user?._id) &&
            !(me?._id === state.stream?.streamer?._id) &&
            state.stream?.status === streamStatus.pending &&
            state.stream?.streamOrder
        ) {
            setLocation('/recommendations')
        }
    }, [me?._id, setLocation, state.stream?.status, state.stream?.streamOrder, state.stream?.streamer?._id])

    useEffect(() => {
        if (socket) {
            socket.on('streams:status', (d) => {
                try {
                    const newStatus = JSON.parse(d)
                    if (newStatus._id === params.id) {
                        streamDispatch(updateStream(newStatus))
                    }
                } catch (error) {
                    dispatch(setError({ error }))
                }
            })
        }

        return () => {
            if (socket) {
                socket.off('streams:status')
                postAuth(`/streams/${params.id}/chat/disconnect`)
            }
        }
    }, [socket, params.id, dispatch])

    if (!serverSettings || isLoading || !state.stream) {
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
                isMe: me?._id === state.stream.streamer._id,
                isAnswerForMe: me?._id === state.stream?.streamOrder?.user?._id,
                serverSettings,
            }}>
            <div className="relative h-full overflow-hidden z-10">
                <CollapseIcon
                    onClick={handleSidebarCollapse}
                    className={`absolute z-100 top-13 right-4 cursor-pointer transition-all duration-500 stroke-current transform ${
                        state.isSidebarCollapsed ? 'opacity-50 text-white rotate-180' : ''
                    }`}
                />
                <div
                    style={{
                        willChange: 'right',
                        right: state.isSidebarCollapsed ? '-20px' : '321px',
                        transition: 'right 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    className="absolute h-full top-5 left-0 pr-5">
                    <StreamContent serverSettings={serverSettings} />
                </div>
                <div
                    style={{
                        willChange: 'transform',
                        width: '321px',
                        transitionDelay: state.isSidebarCollapsed ? '0s' : '0.015s',
                    }}
                    className={`absolute bottom-5 top-5 right-0 max-w-xs transform transition-transform duration-700 ease-in-out ${
                        state.isSidebarCollapsed ? 'translate-x-full' : 'translate-x-0'
                    }`}>
                    <Sidebar streamContext={StreamContext} />
                </div>
            </div>
        </StreamContext.Provider>
    )
}

export default memo(Stream)
