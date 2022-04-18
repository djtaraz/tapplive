import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import FormatAmount from 'components/FormatAmount'
import Button from 'components/Button'
import { useTranslation } from 'react-i18next'
import { idProp, imageProp } from 'common/propTypes'
import { useSelector } from 'react-redux'
import AuthLink from 'components/AuthLink'

import { formatCost } from '../../utils/numberUtils'
import { routes } from '../../routes'
import Avatar from '../../components/Avatar'

const Card = ({ user, onToggleSubscription, onClick, isBordered, padding, textSize }) => {
    const { t } = useTranslation()
    const { isAuthenticated } = useSelector((state) => state.root)
    const [subscriberCount, setSubscriberCount] = useState(user.subscriberCount)
    const [isSubscribing, setIsSubscribing] = useState(false)

    const { me } = useSelector((state) => state.root)
    useEffect(() => setSubscriberCount(user.subscriberCount), [user])

    const handleSubscription = async () => {
        setIsSubscribing(true)
        await onToggleSubscription(user._id)
        setSubscriberCount((prevSubs) => (user.inMySubscriptions ? prevSubs - 1 : prevSubs + 1))
        setIsSubscribing(false)
    }

    return (
        <div
            key={user._id}
            className={cn(
                'flex items-center rounded-2.5',
                isBordered && 'border border-gray-light',
                padding && `p-${padding}`,
            )}>
            <Avatar photoUrl={user.photo?.url} size="m" to={routes.userDetails.getLink(user._id)} crop="60x60" />

            <div className="flex-1 pr-4 truncate ml-3.5">
                {
                    <AuthLink
                        onClick={onClick}
                        to={routes.userDetails.getLink(user._id)}
                        title={user.name}
                        className={cn(
                            'align-bottom inline-block w-full truncate font-semibold',
                            textSize && `text-${textSize}`,
                        )}>
                        {user.name}
                    </AuthLink>
                }
                <div className="truncate text-s overflow-ellipsis overflow-hidden mt-0.5">
                    <span className="mr-1">{t('subscribers')}</span>
                    <FormatAmount amount={subscriberCount} />
                </div>
                <div className="mt-0.5 text-s">${formatCost(user.totalSpent + user.totalEarned)}</div>
            </div>
            {user._id !== me?._id && (
                <div>
                    <Button
                        onClick={handleSubscription}
                        isBig={false}
                        fontWeight="normal"
                        isDisabled={!isAuthenticated || isSubscribing}
                        text={user.inMySubscriptions ? t('cancel_track') : t('track')}
                        type={user.inMySubscriptions ? 'secondary' : 'primary'}
                    />
                </div>
            )}
        </div>
    )
}

Card.defaultProps = {
    isBordered: true,
    padding: '5',
    textSize: 'm',
}
Card.propTypes = {
    user: PropTypes.shape({
        _id: idProp,
        subscriberCount: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        photo: imageProp.isRequired,
    }),
    onToggleSubscription: PropTypes.func,
    onClick: PropTypes.func,
    isBordered: PropTypes.bool,
}

export default Card
