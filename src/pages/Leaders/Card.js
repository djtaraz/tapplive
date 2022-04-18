import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import LeaderFrame from 'containers/Leaders/LeaderFrame'
import { formatCost } from 'utils/numberUtils'
import { idProp, imageProp } from 'common/propTypes'
import Avatar from 'components/Avatar'
import AuthLink from 'components/AuthLink'
import cn from 'classnames'

function Card({ id, name, tLevel, photo, totalSpentAndEarned, position, isMe }) {
    const { t } = useTranslation()

    const cardClasses = cn('px-10 py-3 border rounded-2.5 flex items-center border-gray-pale', isMe && 'bg-gray-pale')
    const linkClasses = cn(
        'flex-1 flex text-m font-medium truncate pr-4',
        isMe ? 'text-black-theme' : 'text-violet-saturated',
    )

    return (
        <div className={cardClasses}>
            <div className="w-6 text-center text-m">{position}</div>
            <div className="mx-4">
                <LeaderFrame icon={tLevel?.misc.icon} colors={tLevel?.misc.frameColors}>
                    <Avatar size="m" photoUrl={photo?.url} to={`/user/${id}`} crop="60x60" />
                </LeaderFrame>
            </div>
            <AuthLink title={name} to={`/user/${id}`} className={linkClasses}>
                {name} {isMe && <span className="ml-1 text-gray-medium">({t('you')})</span>}
            </AuthLink>
            <div className="text-ml font-bold">${formatCost(totalSpentAndEarned, true)}</div>
        </div>
    )
}

Card.defaultProps = {}
Card.propTypes = {
    id: idProp,
    name: PropTypes.string.isRequired,
    tLevel: PropTypes.shape({
        misc: PropTypes.shape({
            icon: PropTypes.oneOf(['none', 'crown']).isRequired,
            frameColors: PropTypes.arrayOf(PropTypes.string).isRequired,
        }),
    }).isRequired,
    photo: imageProp.isRequired,
    totalSpentAndEarned: PropTypes.number.isRequired,
    position: PropTypes.number.isRequired,
    isMe: PropTypes.bool,
}

export default Card
