import React, { memo } from 'react'
import { closeNotifications } from '../notificationsReducer'
import DescriptionLink from '../../../../DescriptionLink'
import { ReactComponent as Logo } from 'assets/svg/logo.svg'
import { useTranslation } from 'react-i18next'
import ActivityItem from './index'
import { useDispatch } from 'react-redux'
import { setWarningModalState } from 'slices/rootSlice'
import { dateFromString } from 'utils/dateUtils'

const WarningActivity = ({ type, createDate, body, notificationsDispatch }) => {
    const { t } = useTranslation()

    const dispatch = useDispatch()

    const handleActivityClick = () => {
        notificationsDispatch(closeNotifications())

        dispatch(
            setWarningModalState({
                isOpened: true,
                content: body,
            }),
        )
    }

    return (
        <ActivityItem
            onClick={handleActivityClick}
            name={t(`activityType.${type}`)}
            Description={<DescriptionLink text="Tapplive" />}
            Cover={
                <div className="w-10 h-10 bg-violet-saturated flex items-center justify-center rounded-full overflow-hidden">
                    <Logo />
                </div>
            }
            createDate={dateFromString(createDate)}
        />
    )
}

export default memo(WarningActivity)
