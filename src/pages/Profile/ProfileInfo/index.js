import React, { memo, useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'wouter'
import axios from 'axios'
import cn from 'classnames'
import { routes } from 'routes'
import { useDispatch, useSelector } from 'react-redux'

import ProfileImagePlaceholder from 'assets/svg/profile-user-image.svg'
import { destructure } from 'utils/numberUtils'
import RatingStar from 'components/RatingStar'
import ProfileSkeleton from './ProfileSkeleton'
import { followUser, getReviews, getUserData, getUserSubscriptions, startNewChat } from 'requests/user-requests'
import { startChat } from 'slices/chatSlice'
import { deleteAuth } from 'requests/axiosConfig'
import { setFollowing } from 'slices/sidebarSlice'
import { ReactComponent as MessageIcon } from 'assets/interface-icons/message-icon.svg'
import UsersListModal from '../modals/UsersListModal'
import RatingModals from '../modals/Rating'
import Modal from 'components/Modal'
import { useTranslation } from 'react-i18next'
import SendMoneyModal from '../modals/SendMoneyModal'

import { screens } from 'common/screenResolutions'
import { useProfile } from '../ProfileContext'
import { currencyFormat } from 'utils/numberUtils'
import { cropImage } from '../../../utils/cropImage'

const ProfileInfo = () => {
    const dispatch = useDispatch()
    const { isAuthenticated, screen } = useSelector((state) => state.root)
    const { userId, isMe } = useProfile()
    const [user, setUser] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [reviews, setReviews] = useState()
    const [modalState, setModalState] = useState('')
    const modalRef = useRef()
    const { t } = useTranslation()
    const [, setLocation] = useLocation()
    const userRating = user?.rating ? user.rating / 10 : 0

    useEffect(() => {
        setIsLoading(true)
        if (userId) {
            axios
                .all([getUserData({ userId }), getReviews({ userId })])
                .then(([userData, reviews]) => {
                    setUser(userData)
                    setReviews(reviews)
                    setIsLoading(false)
                })
                .catch(() => {
                    setLocation(routes.feed.path)
                })
        }
    }, [setLocation, userId])

    const openModal = () => {
        modalRef.current.open()
    }

    const closeModal = () => {
        modalRef.current.close()
    }

    const handleModalAction = (type) => {
        setModalState(type)
        openModal()
    }

    const handleStartChat = async () => {
        const newChat = await startNewChat(userId)
        dispatch(startChat(newChat))
        setLocation(routes.chats.path)
    }

    const handlePersonFollow = async () => {
        if (user.inMySubscriptions === false) {
            await followUser({ userId })
            setUser({
                ...user,
                inMySubscriptions: true,
                subscriberCount: user.subscriberCount + 1,
            })
        } else {
            await deleteAuth(`/users/${userId}/subscriptions`)
            setUser({
                ...user,
                inMySubscriptions: false,
                subscriberCount: user.subscriberCount - 1,
            })
        }

        const subscriptions = await getUserSubscriptions({ userId })
        dispatch(setFollowing(subscriptions))
    }
    return isLoading ? (
        <ProfileSkeleton />
    ) : (
        <div className="flex">
            <div className="relative h-200p" onClick={() => handleModalAction('rating')}>
                <img
                    className="sq-200 object-cover rounded-5"
                    alt="streamer-profile-img"
                    src={user.photo?.url ? cropImage(user.photo?.url, 200) : ProfileImagePlaceholder}
                />
                {user.tLevel?.misc?.frameColors && (
                    <div
                        className="absolute -inset-1 -z-1"
                        style={{
                            borderRadius: '25px',
                            background: `linear-gradient(180deg, ${user.tLevel?.misc?.frameColors.join(',')})`,
                        }}></div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 bg-black-theme w-10 h-10 flex justify-center items-center text-white rounded-full text-ms font-medium">
                    {userRating}
                </div>
            </div>

            <div className="flex flex-col ml-8">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold mr-4">{user.name}</h1>

                    {isAuthenticated && screen > screens.sm ? (
                        isMe ? (
                            <Link to="/me/edit">
                                <a className="text-s border border-gray-light px-3.5 py-2 mr-3.5 rounded-3 font-bold focus:outline-none">
                                    {t('profilePage.editProfile')}
                                </a>
                            </Link>
                        ) : (
                            <>
                                <button
                                    onClick={handlePersonFollow}
                                    className={cn(
                                        'focus:outline-none text-s transition-all border border-gray-light px-3.5 py-2 rounded-3 font-bold mr-3.5',
                                        user.inMySubscriptions ? 'text-black' : 'bg-violet-saturated text-white',
                                    )}>
                                    {user.inMySubscriptions ? t('cancel_track') : t('track')}
                                </button>
                                <button
                                    onClick={() => handleModalAction('transfer_money')}
                                    className="focus:outline-none text-s border border-gray-light px-3.5 py-2 mr-3.5 rounded-3 font-bold">
                                    {t('profilePage.sendMoney')}
                                </button>
                                <div className="cursor-pointer" onClick={handleStartChat}>
                                    <MessageIcon />
                                </div>
                            </>
                        )
                    ) : null}
                </div>

                <div className="flex mt-3">
                    <span
                        onClick={() => handleModalAction('subscribers')}
                        className="font-bold text-s mr-6 cursor-pointer">
                        {t('subscribers')} {user.subscriberCount}
                    </span>
                    <span
                        onClick={() => handleModalAction('subscriptions')}
                        className="font-bold text-s cursor-pointer">
                        {t('following')} {user.subscriptionCount}
                    </span>
                </div>

                <div className="flex mt-6.5 items-center">
                    {destructure(userRating).map((percent, index) => (
                        <RatingStar percent={percent} key={index} />
                    ))}
                    <span className="text-s ml-3.5">
                        {t('profilePage.point', { count: reviews?.allReviewsCount || 0 })}
                    </span>
                </div>

                <div className="md:hidden mt-2.5 flex items-center">
                    {isAuthenticated ? (
                        isMe ? (
                            <Link to="/me/edit">
                                <a className="text-s border border-gray-light px-3.5 py-2 mr-3.5 rounded-3 font-bold focus:outline-none">
                                    {t('profilePage.editProfile')}
                                </a>
                            </Link>
                        ) : (
                            <>
                                <button
                                    onClick={handlePersonFollow}
                                    className={cn(
                                        'focus:outline-none text-s transition-all border border-gray-light px-3.5 py-2 rounded-3 font-bold mr-3.5',
                                        user.inMySubscriptions ? 'text-black' : 'bg-violet-saturated text-white',
                                    )}>
                                    {user.inMySubscriptions ? t('cancel_track') : t('track')}
                                </button>
                                <button
                                    onClick={() => handleModalAction('transfer_money')}
                                    className="focus:outline-none text-s border border-gray-light px-3.5 py-2 mr-3.5 rounded-3 font-bold">
                                    {t('profilePage.sendMoney')}
                                </button>
                                <div className="cursor-pointer" onClick={handleStartChat}>
                                    <MessageIcon />
                                </div>
                            </>
                        )
                    ) : null}
                </div>
                <div className="mt-auto font-bold text-lg -tracking-0.01">
                    <span className="text-gray-dark mr-1">{t('t-level')}:</span>
                    <span className="text-black-theme cursor-pointer" onClick={() => handleModalAction('Tlevel')}>
                        {currencyFormat.format((user.totalSpent + user.totalEarned) / 100)}
                    </span>
                </div>
            </div>

            <Modal size={modalState === 'rating' || modalState === 'Tlevel' ? 'unset' : 'sm'} ref={modalRef}>
                {modalState === 'transfer_money' && <SendMoneyModal userId={userId} handleClose={closeModal} />}
                {modalState === 'subscriptions' && (
                    <UsersListModal
                        type="subscriptions"
                        modalFor="profilePage"
                        userId={userId}
                        handleClose={closeModal}
                    />
                )}
                {modalState === 'subscribers' && (
                    <UsersListModal
                        type="subscribers"
                        modalFor="profilePage"
                        userId={userId}
                        handleClose={closeModal}
                    />
                )}

                {(modalState === 'rating' || modalState === 'Tlevel') && (
                    <RatingModals userId={userId} forceTLevel={modalState === 'Tlevel'} onClose={closeModal} />
                )}
            </Modal>
        </div>
    )
}

export default memo(ProfileInfo)
