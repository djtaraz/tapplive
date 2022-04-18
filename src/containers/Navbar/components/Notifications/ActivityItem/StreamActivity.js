import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import ActivityItem from './index'
import ImgObject from '../../../../../components/ImgObject'
import { activityType } from '../../../../../common/entities/activity'
import DescriptionLink from '../../../../DescriptionLink'
import { routes } from '../../../../../routes'
import { cropImage } from '../../../../../utils/cropImage'
import { dateFromString } from 'utils/dateUtils'

const StreamActivity = ({ link, type, createDate, stream }) => {
    const { t } = useTranslation()

    return (
        <ActivityItem
            link={link}
            name={t(`activityType.${type}`, type === activityType.streamSoon && { count: 10 })} // TODO
            Description={<DescriptionLink text={stream.name} link={routes.stream.getLink(stream.id)} />}
            Cover={
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <ImgObject
                        link={routes.stream.getLink(stream._id)}
                        url={cropImage(stream?.thumbnailOrCoverUrl || stream?.cover?.url, 40)}
                        id={stream._id}
                    />
                </div>
            }
            createDate={dateFromString(createDate)}
        />
    )
}

export default memo(StreamActivity)
