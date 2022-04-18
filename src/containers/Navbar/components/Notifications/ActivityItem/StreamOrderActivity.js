import React, { memo } from 'react'
import ActivityItem from './index'
import ImgObject from '../../../../../components/ImgObject'
import { useTranslation } from 'react-i18next'
import DescriptionLink from '../../../../DescriptionLink'
import { routes } from '../../../../../routes'
import { dateFromString } from 'utils/dateUtils'
import { cropImage } from '../../../../../utils/cropImage'

const StreamOrderActivity = ({ link, type, createDate, streamOrder }) => {
    const { t } = useTranslation()

    return (
        <ActivityItem
            link={link}
            name={t(`activityType.${type}`)}
            Description={
                <DescriptionLink text={streamOrder?.name} link={routes.streamOrderDetails.getLink(streamOrder._id)} />
            }
            Cover={
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <ImgObject
                        link={routes.streamOrderDetails.getLink(streamOrder._id)}
                        url={cropImage(streamOrder?.cover?.url, 40)}
                        id={streamOrder._id}
                    />
                </div>
            }
            createDate={dateFromString(createDate)}
        />
    )
}

export default memo(StreamOrderActivity)
