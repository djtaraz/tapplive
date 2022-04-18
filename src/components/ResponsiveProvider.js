import React, { useEffect, memo } from 'react'
import { useDispatch } from 'react-redux'

import { useMediaQuery } from 'react-responsive'
import { screenResolution, screens } from '../common/screenResolutions'
import { setScreen } from 'slices/rootSlice'

function ResponsiveProvider() {
    const dispatch = useDispatch()

    const isSm = useMediaQuery({ query: `(min-width: ${screenResolution.sm}px)` })
    const isMd = useMediaQuery({ query: `(min-width: ${screenResolution.md}px)` })
    const isLg = useMediaQuery({ query: `(min-width: ${screenResolution.lg}px)` })
    const isXl = useMediaQuery({ query: `(min-width: ${screenResolution.xl}px)` })
    const is2Xl = useMediaQuery({ query: `(min-width: ${screenResolution['2xl']}px)` })
    const is3Xl = useMediaQuery({ query: `(min-width: ${screenResolution['3xl']}px)` })
    const is4Xl = useMediaQuery({ query: `(min-width: ${screenResolution['4xl']}px)` })

    useEffect(() => {
        if (is4Xl) {
            dispatch(setScreen(screens['4xl']))
        } else if (is3Xl) {
            dispatch(setScreen(screens['3xl']))
        } else if (is2Xl) {
            dispatch(setScreen(screens['2xl']))
        } else if (isXl) {
            dispatch(setScreen(screens.xl))
        } else if (isLg) {
            dispatch(setScreen(screens.lg))
        } else if (isMd) {
            dispatch(setScreen(screens.md))
        } else {
            dispatch(setScreen(screens.sm))
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [isSm, isMd, isLg, isXl, is2Xl, is3Xl, is4Xl])

    return <div></div>
}

export default memo(ResponsiveProvider)
