import React, { memo, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const PortalPopper = ({ children, targetRef }) => {
    const [boundings, setBoundings] = useState()

    useLayoutEffect(() => {
        if (targetRef?.current) {
            setBoundings(targetRef.current.getBoundingClientRect())
        }
    }, [targetRef])

    return boundings
        ? createPortal(
              <div
                  onClick={(event) => {
                      event.stopPropagation()
                  }}
                  style={{
                      position: 'absolute',
                      top: boundings.top + boundings.height + 10,
                      left: boundings.left + boundings.width / 2,
                      transform: 'translateX(-50%)',
                      zIndex: 1000,
                  }}
                  className="shadow-lg py-2.5 rounded-2.5 border border-gray-light bg-white"
                  onMouseLeave={(event) => event.preventDefault()}>
                  <div className="absolute bg-white w-3 h-3 top-0 left-1/2 border-t border-l border-gray-light rounded-0.5 transform -translate-y-1/2 -translate-x-1/2 rotate-45 "></div>
                  <div className="absolute bottom-full left-0 right-0 h-4"></div>
                  {children}
              </div>,
              document.body,
          )
        : null
}

export default memo(PortalPopper)
