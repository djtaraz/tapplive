import { useEffect, useRef, useState } from 'react'
import ViewSelect from './ViewSelect'
import VideoContainer from 'pages/Streams/Content/components/VideoContainer'
import { useStream } from 'pages/Streams/StreamContext'
import { setStream } from 'pages/Streams/streamStorage'

const classes = {
    2: {
        sideContainer: 'grid flex-1 auto-rows-min auto-cols-min h-full max-h-full mx-auto',
        entire: '',
        card: '',
        paddingContainer: '',
    },
    0: {
        sideContainer: 'flex w-full mt-3.5 overflow-x-auto',
        entire: 'flex-col',
        card: ' flex flex-col flex-1 mr-3.5 last:mr-0',
        paddingContainer: '',
    },
    1: {
        sideContainer: 'flex flex-col ml-3.5 overflow-y-auto',
        entire: '',
        card: ' flex flex-col flex-1 mb-3.5 last:mb-0',
        paddingContainer: '',
    },
}
const StreamViews = () => {
    const [view, setView] = useState(0)
    const { isMe, state, streamDispatch } = useStream()
    const { stream, streams } = state
    const containerRef = useRef(null)
    const [height, setHeight] = useState()
    const [cols, setCols] = useState(3)

    useEffect(() => {
        function onResize() {
            const { height, width } = containerRef.current.getBoundingClientRect()
            let cols
            if (width > height) {
                setHeight((height - 40) / 0.5625)
                cols = 3
            } else {
                setHeight(1200)
                cols = 2
            }
            if (streams && streams.length === 1) {
                cols = 1
            }
            setCols(cols)
        }
        onResize()

        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [containerRef, state, streams])
    return (
        <section className="h-full flex flex-col overflow-y-auto remove-scrollbar relative pb-10">
            <div className="flex flex-col h-full min-h-full">
                <ViewSelect view={view} setView={setView} />

                <div
                    ref={containerRef}
                    className={`flex-1 relative w-full overflow-hidden flex ${classes[view].entire}`}>
                    {view !== 2 && (
                        <section className="bg-black-theme flex-1">
                            {stream && <VideoContainer stream={stream} isMe={isMe} closeStream={stream?.closeStream} />}
                        </section>
                    )}
                    <section
                        className={`${classes[view].sideContainer} grid-cols-${cols} customScrollBar`}
                        style={view === 2 && height ? { maxWidth: height } : undefined}>
                        {streams &&
                            streams.map((item) => (
                                <div
                                    key={item._id}
                                    className={`${classes[view].card} cursor-pointer`}
                                    style={view !== 2 ? { minWidth: 132, maxWidth: 132, maxHeight: 126 } : undefined}
                                    onClick={() => streamDispatch(setStream(item))}>
                                    <div
                                        className={`relative border-4 ${classes[view].paddingContainer} ${
                                            stream?._id === item._id ? 'border-pink-dark' : 'border-transparent'
                                        } rounded-2`}
                                        style={true ? { paddingBottom: '56.25%' } : undefined}>
                                        <div className="inset-0 absolute ">
                                            <VideoContainer
                                                stream={item}
                                                isMe={isMe}
                                                hideInfo={view !== 2}
                                                forceMuted={!(view === 2 && stream?._id === item._id)}
                                                isMinified={true}
                                                closeStream={item.closeStream}
                                            />
                                        </div>
                                    </div>
                                    {view !== 2 && (
                                        <>
                                            <span className="text-violet-saturated truncate text-xs mt-2">
                                                {item.streamer.name}
                                            </span>
                                            <span className="truncate text-xs leading-5">{item.name}</span>
                                        </>
                                    )}
                                </div>
                            ))}
                    </section>
                </div>
            </div>
        </section>
    )
}

export default StreamViews
