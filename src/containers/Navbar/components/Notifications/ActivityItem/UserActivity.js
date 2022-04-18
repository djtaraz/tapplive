import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import ActivityItem from './index'
import Avatar from 'components/Avatar'
import DescriptionLink from '../../../../DescriptionLink'
import { routes } from '../../../../../routes'
import { dateFromString } from 'utils/dateUtils'

const UserActivity = ({ link, type, createDate, user }) => {
    const { t } = useTranslation()

    return (
        <ActivityItem
            link={link}
            name={t(`activityType.${type}`)}
            Description={<DescriptionLink text={user.name} link={routes.userDetails.getLink(user._id)} />}
            Cover={
                <Avatar photoUrl={user.photo?.url} to={routes.userDetails.getLink(user._id)} crop="40x40" size="sm" />
            }
            createDate={dateFromString(createDate)}
        />
    )
}

export default memo(UserActivity)
