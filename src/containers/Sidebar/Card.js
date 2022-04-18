import React from 'react'
import { Link } from 'wouter'

import { streamProp } from 'common/propTypes'
import Status from 'components/Status'
import ViewsLabel from 'components/Card/ViewsLabel'
import SubscribersLabel from 'components/Card/SubscribersLabel'
import Avatar from 'components/Avatar'
import { getRandomPlaceholder } from '../../components/Card/getPlaceholder'
import { dateFromString } from 'utils/dateUtils'
import { cropImage } from '../../utils/cropImage'

const Card = ({ id, name, streamer, cover, startDate, viewerCount, subscriberCount, status }) => {
    const placeholder = getRandomPlaceholder(id)
    return (
        <div
            className="mb-5"
            style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr',
                gridTemplateRows: 'auto 1fr',
                rowGap: '20px',
                columnGap: '10px',
            }}>
            <div className="col-span-full relative">
                <div style={{ paddingBottom: '65%', width: '100%' }}></div>
                <Link to={`/streams/${id}`} className="cursor-pointer">
                    <a className="absolute inset-0">
                        {cover?.url ? (
                            <img
                                className="w-full h-full object-cover rounded-2.5"
                                src={cover?.url ? cropImage(cover?.url, 300, 200) : getRandomPlaceholder(id)}
                                alt=""
                            />
                        ) : (
                            <div
                                style={{ background: `${placeholder.color}` }}
                                className="absolute inset-0 flex items-center justify-center rounded-2.5">
                                <img src={placeholder.img} alt="" className="w-1/2" />
                            </div>
                        )}
                    </a>
                </Link>
                <div className="absolute inset-0 flex flex-col justify-between p-3.5 pointer-events-none">
                    <div className="flex w-full">
                        <Status status={status} startDate={dateFromString(startDate)} />
                    </div>
                    <div className="flex items-end w-full">
                        {status === 'live' || status === 'suspended' ? (
                            <ViewsLabel viewsCount={viewerCount} />
                        ) : (
                            <SubscribersLabel subscriberCount={subscriberCount} />
                        )}
                    </div>
                </div>
            </div>
            <div className="self-start col-start-1 col-end-2">
                <Avatar photoUrl={streamer.photo?.url} to={`/user/${streamer._id}`} crop="40x40" />
            </div>
            <div className="col-start-2 col-end-3 w-full overflow-hidden">
                <Link to={`/streams/${id}`}>
                    <a className="block text-base font-bold truncate" title={name}>
                        {name}
                    </a>
                </Link>
                <Link to={`/user/${streamer._id}`}>
                    <a title={streamer.name || 'Unknown'} className="block truncate text-s text-violet-saturated mt-1">
                        {streamer.name || 'Unknown'}
                    </a>
                </Link>
            </div>
        </div>
    )
}

Card.defaultProps = {}
Card.propTypes = {
    ...streamProp,
}

export default Card
