import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import VideoControlBar from './VideoControlBar'

import { getRandomPlaceholder } from 'components/Card/getPlaceholder'
import StatusCard from './StatusCard'
import { statusWithControls, statusWithThumbnail, streamStatus } from 'common/entities/stream'
import ReactPlayer from 'react-player/file'
import Loader from 'components/Loader'
import SubscribeToView from './SubscribeToView'
import PlayerCover from './PlayerCover'
import { cropImage } from '../../../../utils/cropImage'

var hidden, visibilityChange
if (typeof document.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden'
    visibilityChange = 'visibilitychange'
} else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden'
    visibilityChange = 'msvisibilitychange'
} else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden'
    visibilityChange = 'webkitvisibilitychange'
}

const setFullscreen = (ref) => {
    if (document.fullscreenElement || document.webkitIsFullScreen) {
        if (document.webkitIsFullScreen) {
            document.webkitExitFullscreen()
        } else {
            document.exitFullscreen()
        }
    } else {
        const el = ref.current
        if (el.requestFullscreen) {
            el.requestFullscreen()
        } else if (el.msRequestFullscreen) {
            el.msRequestFullscreen()
        } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen()
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen()
        }
    }
}

const VideoContainer = ({ stream, isMe, hideInfo, forceMuted, isMinified = false }) => {
    const url = useMemo(() => stream.videoUrl, [stream.videoUrl])
    const videoRef = useRef()
    const videoContainerRef = useRef()
    const [debug, setDebug] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [isPlayable, setPlayable] = useState(false)
    const [shouldHaveControls, setShouldHaveControls] = useState(false)

    const [videoControls, setVideoControls] = useState({
        muted: true,
        volume: 0,
        volumeMemory: 0.5,
        playing: false,
    })

    const haveAccess = useMemo(() => {
        return (stream && stream.haveTicket) || isMe
    }, [isMe, stream])

    const syncLiveStream = useCallback(() => {
        // setLoading(false)
        if (videoRef && videoRef.current && stream.status === streamStatus.live) {
            const hls = videoRef.current.getInternalPlayer('hls')
            if (hls) {
                const currentLive = videoRef.current.getInternalPlayer('hls').liveSyncPosition
                currentLive && videoRef.current.seekTo(currentLive, 'seconds')
            }
        }
    }, [stream.status])

    useEffect(() => {
        if (statusWithThumbnail.includes(stream.status)) {
            setVideoControls((prev) => ({ ...prev, playing: false }))
        }
        if (statusWithControls.includes(stream.status)) {
            isPlayable && setVideoControls((prev) => ({ ...prev, playing: true }))
            setShouldHaveControls(true)
            stream.status === streamStatus.live && syncLiveStream()
        } else {
            setShouldHaveControls(false)
        }
    }, [haveAccess, isLoading, isPlayable, stream.status, syncLiveStream])

    const placeholder = getRandomPlaceholder(stream._id)
    const cover =
        stream.thumbnailOrCoverUrl !== null ? cropImage(stream.thumbnailOrCoverUrl, 1024, 768) : placeholder.img
    const handleLiveVisibility = useCallback(() => {
        isPlayable && stream.status === streamStatus.live && setVideoControls((prev) => ({ ...prev, playing: true }))
    }, [isPlayable, stream.status])

    useEffect(() => {
        if (forceMuted !== undefined) {
            forceMuted && setVideoControls((prev) => ({ ...prev, muted: forceMuted, volume: 0 }))
            !forceMuted && setVideoControls((prev) => ({ ...prev, muted: forceMuted, volume: prev.volumeMemory }))
        }
    }, [forceMuted])

    useEffect(() => {
        if (typeof document.addEventListener === 'undefined' || hidden === undefined) {
            console.log("Browser doesn't supports the Page Visibility API.")
        } else {
            // Handle page visibility change
            document.addEventListener(visibilityChange, handleLiveVisibility, false)
        }
        return () => {
            window.removeEventListener(visibilityChange, handleLiveVisibility)
        }
    }, [handleLiveVisibility])

    function onError(e, data, hlsInstance, hlsGlobal) {
        if (!hlsGlobal) {
            // Probably not a HLS error
            return
        }

        if (data.details === window.Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
            setLoading(true)
        }

        switch (data.type) {
            case hlsGlobal.ErrorTypes.NETWORK_ERROR:
                console.error('fatal network error encountered, try to recover', data)
                hlsInstance.startLoad()
                break
            case hlsGlobal.ErrorTypes.MEDIA_ERROR:
                console.error('fatal media error encountered, try to recover', data)
                hlsInstance.recoverMediaError()
                break
            default:
                console.error('cannot recover', data)
                hlsInstance.startLoad()
                break
        }
    }
    const onReady = () => {
        // calls only once
        setLoading(false)
        setPlayable(true)
        setVideoControls((prev) => ({ ...prev, playing: true }))
    }
    const onEnded = () => {
        setVideoControls((prev) => ({ ...prev, playing: false }))
    }
    useEffect(() => {
        if (stream.closeStream) {
            setLoading(false)
            setVideoControls((prev) => ({ ...prev, playing: false }))
            setPlayable(false)
        }
    }, [stream.closeStream])

    return (
        <div className="relative h-full w-full group overflow-hidden">
            {!hideInfo && <StatusCard stream={stream} isMe={isMe} isMinified={isMinified} />}
            {!isMinified && debug && (
                <>
                    <div
                        className="absolute top-0 right-0 z-50 text-pink-dark break-all max-w-lg "
                        onClick={() => setDebug(false)}>
                        <div className="">{JSON.stringify(videoControls)}</div>
                        <div className=" text-pink-dark ">
                            {JSON.stringify({
                                isLoading,
                                isPlayable,
                                isClosed: stream.closeStream,
                                url: typeof stream.videoUrl === 'string',
                                access: haveAccess,
                                controls: shouldHaveControls,
                                cover: !videoControls.playing && !isPlayable,
                            })}
                        </div>
                    </div>
                </>
            )}
            <div
                ref={videoContainerRef}
                className="absolute inset-0 bg-black-theme"
                style={{
                    background:
                        !videoControls.playing && !stream.thumbnailOrCoverUrl ? `${placeholder.color}` : undefined,
                }}>
                <ReactPlayer
                    ref={videoRef}
                    onReady={onReady}
                    onError={onError}
                    onPlay={syncLiveStream}
                    onEnded={onEnded}
                    onBufferEnd={() => setLoading(false)}
                    volume={videoControls.volume}
                    muted={videoControls.muted}
                    playing={videoControls.playing}
                    url={haveAccess && url}
                    width="100%"
                    height="100%"
                    className="object-contain bg-contain"
                    config={{
                        file: {
                            attributes: { playsInline: true },
                        },
                        hlsOptions: {
                            // liveSyncDurationCount: 1,
                            liveDurationInfinity: true,
                            lowLatencyMode: true,
                            debug,
                        },
                    }}
                />
                {!videoControls.playing && !isPlayable && (
                    <PlayerCover
                        isPlaying={videoControls.playing}
                        cover={cover}
                        needPlaceholder={!stream.thumbnailOrCoverUrl}
                    />
                )}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center bg-black-theme bg-opacity-50 z-0">
                        <Loader width={20} height={10} />
                    </div>
                )}
                {!haveAccess && stream.status === streamStatus.live && <SubscribeToView />}
                {isPlayable && shouldHaveControls && !hideInfo && haveAccess && (
                    <VideoControlBar
                        stream={stream}
                        isMe={isMe}
                        videoControls={videoControls}
                        setFullscreen={() => setFullscreen(videoContainerRef)}
                        setVideoControls={setVideoControls}
                        videoRef={videoRef}
                    />
                )}
            </div>
        </div>
    )
}

export default memo(VideoContainer)
