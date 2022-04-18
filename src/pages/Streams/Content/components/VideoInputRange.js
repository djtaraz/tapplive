import { forwardRef, memo, useCallback, useEffect, useState } from 'react'

const VideoInputRange = forwardRef(({ onChange, value, className, step, min, max }, ref) => {
    const [background, setVolumeBg] = useState()

    const handleValue = useCallback(
        (value) => {
            var percentage = ((value - min) / (max - min)) * 100

            setVolumeBg(
                'linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) ' +
                    percentage +
                    '%, rgba(255, 255, 255, 0.1) ' +
                    percentage +
                    '%, rgba(255, 255, 255, 0.1) 100%)',
            )
        },
        [max, min],
    )
    useEffect(() => {
        handleValue(value)
    }, [handleValue, value])

    const handleChange = (event) => {
        onChange(event)
        var value = ((event.target.value - event.target.min) / (event.target.max - event.target.min)) * 100
        handleValue(value)
    }

    return (
        <div className={className}>
            <input
                type="range"
                className="player-range cursor-pointer"
                ref={ref}
                onChange={handleChange}
                value={value}
                step={step}
                min={min}
                max={max}
                style={{ background }}
            />
        </div>
    )
})

export default memo(VideoInputRange)
