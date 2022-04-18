import React, { memo } from 'react'
import PropTypes from 'prop-types'

import Status from '../Status'
import PrivateLabel from './PrivateLabel'
import Avatar from '../Avatar'
import ViewsLabel from './ViewsLabel'
import SubscribersLabel from './SubscribersLabel'
import TagList from '../TagList'
import { streamProp } from 'common/propTypes'
import PriceLabel from '../PriceLabel'
import ImgObject from '../ImgObject'
import AuthLink from 'components/AuthLink'
import { dateFromString } from '../../utils/dateUtils'
import { cropImage } from '../../utils/cropImage'

const StreamMajorCard = ({ stream, wide }) => {
    const generateStreamLink = () =>
        stream?.type === 'streamOrder' ? `/stream-orders/${stream._id}` : `/streams/${stream._id}`

    return (
        <div className="relative main-card w-full">
            <div
                style={{
                    gridTemplateColumns: wide ? '1fr 1fr' : '1fr',
                }}
                className="grid gap-5">
                <div style={{ paddingBottom: '132%' }}></div>
            </div>
            <div className="absolute inset-0 z-10 rounded-3 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black-background via-transparent opacity-50 pointer-events-none z-10"></div>
                <div className="relative z-0 h-full">
                    <ImgObject
                        link={generateStreamLink()}
                        url={cropImage(
                            stream.thumbnailOrCoverUrl || stream.cover?.url,
                            ...(wide ? [728, 467] : [264, 350]),
                        )}
                        id={stream._id}
                    />
                </div>
            </div>
            <div className="absolute z-20 inset-0 w-full h-full flex flex-col justify-between p-5 pointer-events-none">
                <div className="flex justify-between items-start">
                    <div>
                        <Status status={stream?.status} startDate={dateFromString(stream.startDate)} />
                        {stream.isPrivate && (
                            <div className="mt-2 ml-auto self-start">
                                <PrivateLabel />
                            </div>
                        )}
                    </div>
                    {!stream.haveTicket && <PriceLabel price={stream?.price.value ?? 0} type="primary" />}
                </div>
                <div>
                    <div className="relative z-10">
                        <div className="pointer-events-auto">
                            <Avatar
                                photoUrl={(stream.streamer || stream.user)?.photo?.url}
                                crop="40x40"
                                to={`/user/${(stream.streamer || stream.user)?._id}`}
                            />
                        </div>
                        <div className="flex items-center text-s">
                            <AuthLink
                                href={`/user/${(stream.streamer || stream.user)?._id}`}
                                className="truncate max-w-3/4 text-white mr-1.5 pointer-events-auto hover:underline">
                                {(stream.streamer || stream.user).name || 'Unknown'}
                            </AuthLink>
                            {['live', 'suspended'].includes(stream.status) ? (
                                <ViewsLabel viewsCount={stream.viewerCount} />
                            ) : (
                                <SubscribersLabel subscriberCount={stream.subscriberCount} />
                            )}
                        </div>
                        <div className="truncate pr-2.5 text-white">
                            <AuthLink href={generateStreamLink()} className="text-m font-medium pointer-events-auto">
                                {stream.name}
                            </AuthLink>
                        </div>
                        <div className="text-white">
                            <TagList tags={stream.tags} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

StreamMajorCard.defaultProps = {
    stream: {
        viewerCount: null,
        subscriberCount: null,
    },
    wide: false,
}
StreamMajorCard.propTypes = {
    stream: PropTypes.shape(streamProp),
    wide: PropTypes.bool,
}

export default memo(StreamMajorCard)
