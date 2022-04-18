import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import StreamOrderCard from 'components/Card/StreamOrderCard'
import { getAuth } from 'requests/axiosConfig'
import { reviewFields } from '../fields'
import { useStream } from '../StreamContext'
import Feedback from './components/Feedback'
import VideoContainer from './components/VideoContainer'
import { statusWithReview } from 'common/entities/stream'
import Modal from 'components/Modal'
import StreamEndedModal from './modals/user/StreamEndedModal'
import { useSelector } from 'react-redux'
import { useQuery } from 'react-query'

import UnderPlayerPanel from './components/UnderPlayerPanel'
import Footer from 'containers/Footer'

const StreamContent = () => {
    const { state, isMe } = useStream()
    const { me } = useSelector((state) => state.root)

    const { stream } = state
    const { t } = useTranslation()

    const { data } = useQuery(
        ['review', stream._id],
        async () => {
            const { data } = await getAuth(`/streams/${stream._id}/reviews?_fields=${reviewFields}`)
            return data.result.items
        },
        {
            refetchOnWindowFocus: false,
            enabled: statusWithReview.includes(stream.status) && !isMe,
        },
    )

    return (
        <>
            <div className="h-full flex flex-col overflow-y-auto remove-scrollbar relative pb-10">
                <div className="flex flex-col h-full min-h-full">
                    <div className="flex-1">
                        <VideoContainer stream={stream} isMe={isMe} closeStream={stream.closeStream} />
                    </div>
                    <UnderPlayerPanel />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1-a mt-9">
                    <div className="flex flex-col w-full">
                        {stream.description && (
                            <div className="w-full">
                                <h3 className="text-m font-bold mb-3">{t('description')}</h3>
                                <p className="text-s">{stream.description}</p>
                            </div>
                        )}
                        <table className="mt-5 w-full">
                            {stream.location && (
                                <tr>
                                    <td className="align-top pb-5 w-32 md:w-52">
                                        <span className="text-s pr-2">{t('location')}:</span>
                                    </td>
                                    <td className="pb-5">
                                        <span className="text-base font-bold">{stream.location.name}</span>
                                    </td>
                                </tr>
                            )}

                            <tr>
                                <td className="align-top w-32 md:w-52">
                                    <span className="text-s">{t('type')}:</span>
                                </td>
                                <td>
                                    <span className="text-base font-bold pb-5">
                                        {stream.isPrivate ? t('privateStream') : t('publicStream')}
                                    </span>
                                </td>
                            </tr>
                        </table>

                        {data && data.length > 0 && (
                            <div className="mt-8 w-full flex flex-col">
                                <h1 className="text-m font-bold mb-5">{t('viewersReview')}</h1>
                                {data.map(
                                    (review, index) =>
                                        review.body && (
                                            <Feedback
                                                key={index}
                                                body={review?.body}
                                                rating={review?.rating}
                                                user={review?.user}
                                            />
                                        ),
                                )}
                            </div>
                        )}
                    </div>

                    {stream.streamOrder && (
                        <div className="ml-0 md:ml-5 mt-10 md:mt-0 sm:min-w-264p">
                            <h1 className="text-m font-bold mb-3">{t('replyToOrder')}</h1>
                            <StreamOrderCard order={stream.streamOrder} />
                        </div>
                    )}
                </div>
                <Footer isStreamFooter={true} />
            </div>
            {state.stream?.haveTicket && state.stream?.closeStream && me?._id !== state.stream?.streamer._id && (
                <Modal isOpened={true}>
                    <StreamEndedModal />
                </Modal>
            )}
        </>
    )
}

export default memo(StreamContent)
