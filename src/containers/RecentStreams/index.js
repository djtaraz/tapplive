import React, { useMemo, useState, useEffect } from 'react'
import { Link } from 'wouter'

import Avatar from 'components/Avatar'
import CardPrice from 'components/Card/CardPrice'
import BarSkeleton from 'components/Skeleton/BarSkeleton'
import CircleSkeleton from 'components/Skeleton/CircleSkeleton'
import { useSelector } from 'react-redux'
import { screens } from 'common/screenResolutions'
import ImgObject from '../../components/ImgObject'
import { useTranslation } from 'react-i18next'
import { cropImage } from '../../utils/cropImage'

function useStreamsCount() {
    const { screen } = useSelector((state) => state.root)
    const memoCount = useMemo(() => {
        if (screen === screens['4xl']) {
            return 8
        } else if (screen === screens['2xl']) {
            return 6
        } else {
            return 4
        }
    }, [screen])
    const [count, setCount] = useState(memoCount)

    useEffect(() => {
        setCount(memoCount)
    }, [memoCount])

    return [count, setCount]
}

function RecentStreams({ streams }) {
    const [count] = useStreamsCount()
    const { t } = useTranslation()

    const LoadingSkeleton = useMemo(
        () =>
            Array(count)
                .fill(1)
                .map((_, i) => (
                    <div
                        key={`skeleton-${i}`}
                        style={{
                            gridTemplateColumns: 'auto 1fr',
                        }}
                        className="grid gap-4">
                        <div className="relative w-177 md:w-202 lg:w-177">
                            <div className="pb-2/3"></div>
                            <div className="absolute inset-0">
                                <BarSkeleton width="100%" height="100%" />
                            </div>
                        </div>
                        <div>
                            <div
                                style={{ gridTemplateColumns: 'auto 1fr' }}
                                className="grid gap-2 grid-flow-col items-center">
                                <CircleSkeleton radius={40} />
                                <BarSkeleton width="40%" />
                            </div>
                            <div className="mt-2">
                                <BarSkeleton width="40%" />
                            </div>
                            <div className="mt-2">
                                <BarSkeleton width="20%" />
                            </div>
                        </div>
                    </div>
                )),
        [count],
    )

    const data = useMemo(() => {
        if (!streams) {
            return null
        } else {
            return count < streams.length ? streams.slice(0, count) : streams
        }
    }, [count, streams])
    return (
        <div
            style={{
                gridTemplateColumns: Array(count / 2)
                    .fill(1)
                    .map(() => 'minmax(0,1fr)')
                    .join(' '),
                gridTemplateRows: 'auto auto',
            }}
            className="grid gap-5">
            {data
                ? data.map((stream) => (
                      <div
                          key={stream._id}
                          style={{
                              gridTemplateColumns: 'auto 1fr',
                          }}
                          className="grid gap-4">
                          <div className="relative w-177 md:w-202 lg:w-177 rounded-2.5 overflow-hidden">
                              <div className="pb-2/3"></div>
                              <div className="absolute inset-0 z-10">
                                  <ImgObject
                                      link={`/streams/${stream._id}`}
                                      url={cropImage(stream.thumbnailOrCoverUrl || stream.cover?.url, 300, 200)}
                                      id={stream._id}
                                  />
                              </div>
                              {!stream?.haveTicket && (
                                  <div className="absolute inset-0 z-20 p-3.5 flex items-end justify-end pointer-events-none">
                                      <CardPrice price={stream.price} type="stream" />
                                  </div>
                              )}
                          </div>
                          <div className="col-start-2 col-end-last truncate">
                              <div
                                  style={{ gridTemplateColumns: 'auto 1fr' }}
                                  className="grid gap-2 grid-flow-col items-center">
                                  <Avatar photoUrl={stream.streamer.photo?.url} to={`/user/${stream.streamer._id}`} />
                                  <Link to={`/user/${stream.streamer._id}`}>
                                      <a className="inline-block pr-6 truncate text-s text-violet-saturated">
                                          {stream.streamer.name}
                                      </a>
                                  </Link>
                              </div>
                              <div className="flex mt-2">
                                  <Link to={`/streams/${stream._id}`}>
                                      <a className="inline-block pr-2 truncate text-base font-bold hover:underline">
                                          {stream.name}
                                      </a>
                                  </Link>
                              </div>
                              <div className="text-s mt-1">{t('subs', { count: stream?.subscriberCount || 0 })}</div>
                          </div>
                      </div>
                  ))
                : LoadingSkeleton}
        </div>
    )
}

RecentStreams.defaultProps = {}
RecentStreams.propTypes = {}

export default RecentStreams
