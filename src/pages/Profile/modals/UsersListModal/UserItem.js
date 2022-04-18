import { useState, memo } from 'react'
import cn from 'classnames'
import { get, postAuth, deleteAuth } from 'requests/axiosConfig'
import { useTranslation } from 'react-i18next'
import { Link } from 'wouter'
import { useSelector, useDispatch } from 'react-redux'
import { setFollowing } from 'slices/sidebarSlice'

import Avatar from 'components/Avatar'
import { routes } from 'routes'
import { formatCost } from 'utils/numberUtils'

const UserItem = ({ image, name, id, inMySubscriptions, userSpendings, onClick }) => {
    const { me } = useSelector((state) => state.root)
    const [subscribed, setSubscribed] = useState(inMySubscriptions)
    const { t } = useTranslation()

    const dispatch = useDispatch()

    const handlePersonFollow = async () => {
        if (subscribed === false) {
            await postAuth(`/users/${id}/subscriptions`, {})
            updateSidebar()

            onClick('SUBSCRIBE')
            setSubscribed(true)
        } else if (subscribed === true) {
            await deleteAuth(`/users/${id}/subscriptions`)
            updateSidebar()

            onClick('UNSUBSCRIBE')
            setSubscribed(false)
        }
    }

    const updateSidebar = () => {
        get(`/users/${me?._id}/subscriptions?_fields=items(name, photo)&limit=${4}`).then(({ data }) => {
            dispatch(setFollowing(data?.result?.items))
        })
    }

    return (
        <div className="flex py-2.5 items-center w-full">
            <Avatar size="xs" to={routes.userDetails.getLink(id)} photoUrl={image} alt="user profile" crop="32x32" />

            <div className="flex-1 truncate pr-2.5 ml-2.5">
                <Link to={routes.userDetails.getLink(id)}>
                    <a>
                        <span className="text-s hover:underline">{name || 'Unknown'}</span>
                    </a>
                </Link>
                <div className="text-s mt-0.5">${formatCost(userSpendings)}</div>
            </div>

            {id !== me?._id && (
                <button
                    onClick={handlePersonFollow}
                    style={{ borderRadius: '10px' }}
                    className={cn(
                        'focus:outline-none outline-none border transition-all text-s px-6 py-1.5',
                        subscribed ? 'text-black border-gray-light' : 'bg-violet-saturated text-white',
                    )}>
                    {subscribed ? t('cancel_track') : t('track')}
                </button>
            )}
        </div>
    )
}

export default memo(UserItem)
