import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { ReactComponent as ControlBarPause } from 'assets/svg/control-bar-pause.svg'
import { ReactComponent as ControlBarCog } from 'assets/svg/control-bar-cog.svg'
import { ReactComponent as ControlBarFullscreen } from 'assets/svg/control-bar-fullscreen.svg'
import { ReactComponent as ControlBarInFullscreen } from 'assets/svg/control-bar-in-fullscreen.svg'
import { ReactComponent as ControlBarPlay } from 'assets/svg/control-bar-play.svg'
import { ReactComponent as ControlBarVolumeUp } from 'assets/svg/control-bar-volume-up.svg'
import { ReactComponent as ControlBarVolumedown } from 'assets/svg/control-bar-volume-down.svg'
import ReportStreamBtn from './StreamControls/StreamControlBtns/ReportStreamBtn'
import VideoInputRange from './VideoInputRange'
import { toHHMMSS } from 'utils/numberUtils'
import Popper from 'components/Popper'
import { ReactComponent as Check } from 'assets/svg/quality-check.svg'
import { streamStatus } from 'common/entities/stream'
import { useTranslation } from 'react-i18next'

const VideoControlBar = ({ setFullscreen, setVideoControls, videoControls, stream, isMe, videoRef }) => {
    const volumeRef = useRef()
    const timeRef = useRef()
    const [length, setLength] = useState(1)
    const [formattedLength, setFormatedLength] = useState(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [formattedTime, setFormattedTime] = useState(null)
    const { t } = useTranslation()
    const duration = useCallback(() => {
        let duration = 0
        if (videoRef.current) {
            duration = videoRef.current.getDuration()

            if (duration === null) {
                return
            }

            const formattedLength = toHHMMSS(duration.toFixed())
            setLength(duration.toFixed())
            setFormatedLength(formattedLength)
            return duration
        }
        return duration
    }, [videoRef])
    const play = useCallback(() => {
        duration()
        if (videoControls.playing) {
            setVideoControls((prev) => ({ ...prev, playing: false }))
        } else {
            setVideoControls((prev) => ({ ...prev, playing: true }))
        }
        return !videoControls.playing
    }, [duration, setVideoControls, videoControls.playing])
    const getCurrentTime = useCallback(() => {
        let cur = videoRef.current.getCurrentTime()
        if (cur === null) {
            return
        }
        cur = cur.toFixed()
        let formattedTime = toHHMMSS(cur)

        setCurrentTime(cur)
        setFormattedTime(formattedTime)

        // if (parseInt(currentTime) === parseInt(length)) {
        //     setVideoControls((prev) => ({ ...prev, playing: false }))
        // }

        return cur
    }, [videoRef])

    const customTime = () => {
        const time_range = timeRef.current
        videoRef && videoRef.current.seekTo(time_range.value, 'seconds')

        setCurrentTime(time_range.value)
    }
    const mute = useCallback(() => {
        if (videoControls.muted) {
            setVideoControls((prev) => ({ ...prev, muted: false, volume: prev.volumeMemory }))
        } else {
            setVideoControls((prev) => ({ ...prev, muted: true, volumeMemory: prev.volume, volume: 0 }))
        }
    }, [setVideoControls, videoControls.muted])
    const onCustomVolumeChange = useCallback(
        (event) => {
            const volume_range = event.currentTarget
            setVideoControls((prev) => ({
                ...prev,
                volume: volume_range.value,
                volumeMemory: prev.volume,
                muted: volume_range.value === '0',
            }))
        },
        [setVideoControls],
    )

    useEffect(() => {
        const timer1 = setInterval(() => {
            videoRef && videoRef.current && setCurrentTime(getCurrentTime())
        }, 10)

        const timer2 = setInterval(() => {
            videoRef && videoRef.current && setLength(duration())
        }, 10)

        return () => {
            clearInterval(timer1)
            clearInterval(timer2)
        }
    }, [duration, getCurrentTime, videoRef])
    const onSpaceKeyDown = useCallback(
        (event) => {
            if (
                videoRef.current !== null &&
                stream.status === streamStatus.closed &&
                event.code === 'Space' &&
                event.target === document.body
            ) {
                event.preventDefault()
                play()
            }
        },
        [play, stream.status, videoRef],
    )
    const onDblClick = useCallback(
        (event) => {
            if (
                videoRef.current !== null &&
                event.target === videoRef.current.getInternalPlayer() &&
                !document.fullscreenElement
            ) {
                setFullscreen()
            }
        },
        [setFullscreen, videoRef],
    )
    useEffect(() => {
        window.addEventListener('keydown', onSpaceKeyDown)
        window.addEventListener('dblclick', onDblClick)
        return () => {
            window.removeEventListener('keydown', onSpaceKeyDown)
            window.removeEventListener('dblclick ', onDblClick)
        }
    }, [onDblClick, onSpaceKeyDown])
    const [referenceElement, setReferenceElement] = useState(null)

    const handleQuality = useCallback(
        (level) => {
            videoRef.current.getInternalPlayer('hls').currentLevel = level
        },
        [videoRef],
    )
    const hlsPlayer = videoRef && videoRef.current && videoRef.current.getInternalPlayer('hls')
    return (
        <div
            className="w-full h-10 px-4 flex justify-between bg-overlay absolute bottom-0 left-0 opacity-0 
        group-hover:opacity-100 transform-gpu transition-all duration-300 translate-y-10 group-hover:translate-y-0 ease-in-out">
            <div className="flex w-full items-center justify-start">
                {!videoControls.playing ? (
                    <ControlBarPlay className="cursor-pointer mr-5" onClick={play} />
                ) : (
                    <ControlBarPause className="cursor-pointer mr-5" onClick={play} />
                )}
                {videoControls.muted ? (
                    <ControlBarVolumedown className="cursor-pointer mr-3" onClick={mute} />
                ) : (
                    <ControlBarVolumeUp className="cursor-pointer mr-2" onClick={mute} />
                )}
                <VideoInputRange
                    ref={volumeRef}
                    onChange={onCustomVolumeChange}
                    value={videoControls.volume}
                    step={0.1}
                    min={0}
                    max={1}
                    className="flex items-center mr-2 flex-1 max-w-80p"
                />
                {stream.status === streamStatus.closed && (
                    <>
                        <div className="text-xs text-white flex-shrink-0">
                            {formattedTime} {formattedLength ? `/ ${formattedLength}` : ''}
                        </div>
                        <VideoInputRange
                            ref={timeRef}
                            className="flex items-center mx-2 absolute left-0 right-0 top-0"
                            onChange={customTime}
                            value={currentTime}
                            step={0.1}
                            min={0}
                            max={length || 1}
                        />
                    </>
                )}
            </div>
            <div className="flex ml-auto items-center justify-end">
                {!isMe && <ReportStreamBtn />}
                <div ref={setReferenceElement}>
                    <ControlBarCog className="mr-5 cursor-pointer" />
                    <Popper
                        referenceElement={referenceElement}
                        placement="top"
                        disableArrow={true}
                        offset={14}
                        styleClasses="py-2.5 rounded-2.5 border border-gray-medium border border-opacity-50 bg-black-theme bg-opacity-50 text-s font-bold tracking-0.01 text-white">
                        <div
                            onClick={() => handleQuality(-1)}
                            className="grid grid-flow-col gap-1 items-center justify-start cursor-pointer hover:bg-black-theme hover:bg-opacity-80 py-1.5 px-5">
                            <div className="w-3 h-3 flex items-center mr-3">
                                {(!hlsPlayer || hlsPlayer.autoLevelEnabled) && <Check />}
                            </div>
                            <div>{t('auto')}</div>
                        </div>
                        {hlsPlayer &&
                            hlsPlayer.levels &&
                            hlsPlayer.levels.length > 1 &&
                            hlsPlayer.levels.map((level, index) => {
                                const name = level.url[0].match(/\d{3,4}p/)
                                if (!name) {
                                    return null
                                }
                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleQuality(index)}
                                        className="grid grid-flow-col gap-1 items-center justify-start cursor-pointer hover:bg-black-theme hover:bg-opacity-80 py-1.5 px-5">
                                        <div className="w-3 h-3 flex items-center mr-3">
                                            {!hlsPlayer.autoLevelEnabled && hlsPlayer.currentLevel === index && (
                                                <Check />
                                            )}
                                        </div>
                                        <div>{name.toString()}</div>
                                    </div>
                                )
                            })}
                    </Popper>
                </div>
                {document.fullscreenElement || document.webkitIsFullScreen ? (
                    <ControlBarInFullscreen className="cursor-pointer" onClick={setFullscreen} />
                ) : (
                    <ControlBarFullscreen className="cursor-pointer" onClick={setFullscreen} />
                )}
            </div>
        </div>
    )
}

export default memo(VideoControlBar)
