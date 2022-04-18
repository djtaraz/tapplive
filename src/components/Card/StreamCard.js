import React, { memo } from 'react'
import PropTypes from 'prop-types'

import Status from '../Status'
import PrivateLabel from './PrivateLabel'
import ViewsLabel from './ViewsLabel'
import SubscribersLabel from './SubscribersLabel'
import Avatar from '../Avatar'
import TagList from '../TagList'
import { streamProp } from 'common/propTypes'
import PriceLabel from '../PriceLabel'
import ImgObject from '../ImgObject'
import AuthLink from 'components/AuthLink'
import Checkbox from 'components/Checkbox'
import { useTranslation } from 'react-i18next'
import { activeStream } from 'common/entities/stream'
import { dateFromString } from '../../utils/dateUtils'
import { cropImage } from '../../utils/cropImage'

const StreamCard = ({ stream, onClick, selected, handleCheckboxClick, showTags }) => {
    const isPriceVisible = !stream.haveTicket // && (stream.streamer._id !== me?._id)
    const { t } = useTranslation()

    return (
        <div className="inline-block" onClick={onClick}>
            <div className="relative bg-gray-pale rounded-2 overflow-hidden">
                <div className="pb-2/3"></div>
                <div className="absolute inset-0 inline-block h-full w-full">
                    <ImgObject
                        id={stream._id}
                        link={`/streams/${stream._id}`}
                        url={cropImage(stream.thumbnailOrCoverUrl || stream.cover?.url, 300, 200)}
                    />
                </div>
                <div className="absolute z-30 inset-0 flex flex-col justify-between p-3.5 pointer-events-none">
                    <div className="flex justify-between">
                        <Status status={stream.status} startDate={dateFromString(stream.startDate)} />
                        {stream.isPrivate && <PrivateLabel />}
                    </div>
                    <div className="flex items-end justify-between w-full">
                        {['live', 'suspended'].includes(stream.status) ? (
                            <ViewsLabel viewsCount={stream.viewerCount} />
                        ) : (
                            <SubscribersLabel subscriberCount={stream.subscriberCount} />
                        )}
                        {isPriceVisible && <PriceLabel price={stream?.price?.value ?? 0} type="primary" />}
                    </div>
                </div>
                {activeStream.includes(stream?.status) && handleCheckboxClick && (
                    <div
                        className="absolute z-30 right-3.5 bottom-3.5 bg-black-theme bg-opacity-60 opacity-90 rounded-1.5 p-0.5 flex items-center cursor-pointer"
                        onClick={handleCheckboxClick}>
                        <span className="text-white px-2 text-xs">{t('addToView')}</span>
                        <Checkbox value={selected} onChange={() => handleCheckboxClick()} />
                    </div>
                )}
            </div>
            <div className="grid grid-cols-a-1 row-auto gap-x-2.5 mt-4">
                <Avatar photoUrl={stream.streamer.photo?.url} crop="40x40" to={`/user/${stream.streamer._id}`} />
                <div className="overflow-hidden pr-2.5">
                    <AuthLink href={`/streams/${stream._id}`} className="block max-w-full text-base font-bold truncate">
                        {stream.name}
                    </AuthLink>
                    <AuthLink
                        className="block text-s text-violet-saturated mt-1 truncate"
                        href={`/user/${stream.streamer._id}`}>
                        {stream.streamer.name || 'Unknown'}
                    </AuthLink>
                </div>
                {showTags && (
                    <div className="row-start-2 col-start-2 text-black-theme mt-1">
                        <TagList tags={stream.tags} />
                    </div>
                )}
            </div>
        </div>
    )
}

StreamCard.defaultProps = {
    stream: {
        isPrivate: false,
        subscriberCount: null,
        tags: [],
        streamer: {},
        cover: {},
    },
    showTags: true,
}
StreamCard.propTypes = {
    stream: PropTypes.shape(streamProp),
    onClick: PropTypes.func,
    selected: PropTypes.bool,
    showTags: PropTypes.bool,
}

export default memo(StreamCard)
