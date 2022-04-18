import React, { memo } from 'react'
import { Link } from 'wouter'

import PropTypes from 'prop-types'
import ImgObject from '../../components/ImgObject'
import { cropImage } from '../../utils/cropImage'

const StreamPreview = ({ stream, type }) => {
    return (
        <Link to={`/streams/${stream._id}`}>
            <div className="w-full flex px-12 py-2.5 items-center transition-all cursor-pointer hover:bg-gray-pale">
                <div className="relative w-20 h-12.5 mr-4 overflow-hidden rounded-2.5">
                    <ImgObject
                        url={cropImage(stream.thumbnailOrCoverUrl || stream.cover?.url, 300, 200)}
                        id={stream._id}
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-base font-bold">{stream.name}</span>
                    <span className="text-s mt-1.5 text-violet-saturated">
                        {(type === 'stream' ? stream.streamer.name : stream.user.name) || 'Unknown'}
                    </span>
                </div>
            </div>
        </Link>
    )
}
StreamPreview.propTypes = {
    stream: PropTypes.object,
}

export default memo(StreamPreview)
