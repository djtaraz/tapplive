import { forwardRef, memo } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'

const Scrollbar = forwardRef(({ ...props }, ref) => {
    const thumbView = ({ style, ...props }) => {
        return <div className="bg-violet-saturated rounded-full z-110" style={{ ...style }} {...props} />
    }

    return (
        <Scrollbars
            ref={ref}
            renderThumbVertical={thumbView}
            renderTrackHorizontal={() => <div className="hidden" />}
            {...props}
        />
    )
})

export default memo(Scrollbar)
