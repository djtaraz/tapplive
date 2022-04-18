import React, { memo, useCallback, useState } from 'react'
import { getRandomPlaceholder } from './Card/getPlaceholder'
import AuthLink from 'components/AuthLink'

const ImgObject = ({ id, link, url }) => {
    const [isPlaceholderVisible, setIsPlaceholderVisible] = useState()
    const placeholder = getRandomPlaceholder(id)

    const Wrapper = useCallback(
        ({ children }) => {
            return link ? (
                <AuthLink className="overflow-hidden h-full" href={link}>
                    <a className="relative inline-block w-full h-full">{children}</a>
                </AuthLink>
            ) : (
                <div className="relative h-full">{children}</div>
            )
        },
        [link],
    )

    return (
        <Wrapper>
            {!isPlaceholderVisible && url ? (
                <div className="absolute inset-0 z-20 flex">
                    <img
                        onError={() => {
                            setIsPlaceholderVisible(true)
                        }}
                        className="flex-1 w-full object-cover "
                        src={url}
                        alt=""
                    />
                </div>
            ) : (
                <div
                    style={{ background: `${placeholder.color}` }}
                    className="absolute z-10 inset-0 flex items-center justify-center pointer-events-none">
                    <img src={placeholder.img} alt="" className="w-1/2" />
                </div>
            )}
        </Wrapper>
    )
}

export default memo(ImgObject)
