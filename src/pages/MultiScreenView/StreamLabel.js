import { memo } from 'react'
import { useStream } from '../Streams/StreamContext'

const StreamLabel = () => {
    const { state } = useStream()
    const { stream } = state
    return (
        <div className="mr-3.5 truncate w-full">
            <div className="text-s font-bold tracking-0.01 truncate">{stream?.streamer.name}</div>
            <span className="text-m -tracking-0.2p font-bold truncate">{stream?.name}</span>
        </div>
    )
}

export default memo(StreamLabel)
