import React, { memo, useCallback, useEffect, useReducer, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ReactComponent as NotificationIcon } from 'assets/interface-icons/notification-icon.svg'
import ActivityList from './ActivityList'
import StatusIndicator from 'components/StatusIndicator'
import PortalPopper from 'components/PortalPopper'
import { useClickOutside } from 'hooks/useClickOutside'
import { putAuth } from 'requests/axiosConfig'
import { setError } from 'slices/rootSlice'
import { useLocation } from 'wouter'
import { useSocket } from 'SocketProvider'
import notificationReducer, {
    closeNotifications,
    initialState,
    openNotifications,
    pushActivity,
    setNewNotifications,
} from './notificationsReducer'

const Notifications = () => {
    const dispatch = useDispatch()
    const { me } = useSelector((state) => state.root)
    const [location] = useLocation()
    const socket = useSocket()

    const [state, notificationsDispatch] = useReducer(notificationReducer, initialState)
    const { activities, haveNewNotifications, areNotificationsVisible } = state
    const notificationsRef = useRef(null)

    useEffect(() => {
        if (me) {
            notificationsDispatch(setNewNotifications(me.unreadActivityCount > 0))
        }
    }, [me])

    const handleNewActivity = useCallback(
        (d) => {
            try {
                const newActivity = JSON.parse(d)
                if (areNotificationsVisible) {
                    notificationsDispatch(pushActivity(newActivity))
                } else {
                    notificationsDispatch(setNewNotifications(true))
                }
            } catch (error) {
                dispatch(setError({ error }))
            }
        },
        [areNotificationsVisible, dispatch],
    )

    useEffect(() => {
        if (socket) {
            socket.on('user:newActivity', handleNewActivity)
        }

        return () => {
            if (socket) {
                socket.off('user:newActivity', handleNewActivity)
            }
        }
    }, [socket, handleNewActivity])

    useEffect(() => {
        notificationsDispatch(closeNotifications())
    }, [location])

    useEffect(() => {
        if (areNotificationsVisible && haveNewNotifications) {
            putAuth('/user/activities').then(() => {
                notificationsDispatch(setNewNotifications(false))
            })
        }
    }, [areNotificationsVisible, haveNewNotifications])

    const openMenu = async () => {
        notificationsDispatch(openNotifications())
    }

    const closeMenu = () => {
        notificationsDispatch(closeNotifications())
    }

    useClickOutside(notificationsRef, closeMenu)

    return (
        <div onClick={openMenu} ref={notificationsRef} className="h-full flex items-center cursor-pointer">
            <StatusIndicator isActive={haveNewNotifications}>
                <NotificationIcon />
            </StatusIndicator>

            {areNotificationsVisible && (
                <PortalPopper targetRef={notificationsRef}>
                    <ActivityList notificationsDispatch={notificationsDispatch} activities={activities} />
                </PortalPopper>
            )}
        </div>
    )
}

export default memo(Notifications)
