import React, { useState, useEffect } from 'react'
import { childrenProp } from '../../common/propTypes'
import { ReactComponent as ArrowUpIcon } from 'assets/svg/arrow-up.svg'

function Content({ children }) {
    const [isGoTopVisible, setIsGoTopVisible] = useState()

    useEffect(() => {
        const onScroll = () => {
            if(document.documentElement.scrollTop > 40 && !isGoTopVisible) {
                setIsGoTopVisible(true)
            } else if (document.documentElement.scrollTop <= 40 && isGoTopVisible) {
                setIsGoTopVisible(false)
            }
        }

        window.addEventListener('scroll', onScroll)

        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [isGoTopVisible, setIsGoTopVisible])

    return (
        <div className="h-full">
            {children}
            {isGoTopVisible && (
                <div
                    className="fixed z-200 flex items-center justify-center bottom-4 right-4 w-15 h-15 cursor-pointer"
                    onClick={() => {
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                    }}>
                    <div className="absolute inset-0 rounded-full bg-black-background opacity-30 cursor-pointer -z-1"></div>
                    <ArrowUpIcon />
                </div>
            )}
        </div>
    )
}

Content.propTypes = {
    children: childrenProp.isRequired,
}

export default Content
