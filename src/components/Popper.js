import React, { useState, memo, useEffect, useCallback } from 'react'

import { usePopper } from 'react-popper'

const showEvents = ['mouseenter', 'focus']
const hideEvents = ['mouseleave', 'blur']

const Popper = ({
    children,
    referenceElement,
    placement,
    disableArrow = false,
    offset = 5,
    styleClasses = 'shadow-lg py-2.5 rounded-2.5 border border-gray-light bg-white',
}) => {
    const [popperElement, setPopperElement] = useState(null)
    const { styles, attributes, update, state } = usePopper(referenceElement, popperElement, {
        strategy: 'fixed',
        placement,
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, offset],
                },
            },
            {
                name: 'arrow',
                options: {
                    element: document.querySelector('#popper-arrow'),
                    padding: 2 * offset, // 5px from the edges of the popper
                },
            },
        ],
    })

    const show = useCallback(() => {
        popperElement.setAttribute('data-show', '')

        update && update()
    }, [popperElement, update])
    const hide = useCallback(() => {
        popperElement.removeAttribute('data-show')
    }, [popperElement])
    useEffect(() => {
        if (referenceElement) {
            showEvents.forEach((event) => {
                referenceElement.addEventListener(event, show)
            })

            hideEvents.forEach((event) => {
                referenceElement.addEventListener(event, hide)
            })
        }

        return () => {
            if (referenceElement) {
                showEvents.forEach((event) => {
                    referenceElement.removeEventListener(event, show)
                })

                hideEvents.forEach((event) => {
                    referenceElement.removeEventListener(event, hide)
                })
            }
        }
    }, [hide, referenceElement, show])

    return (
        <div
            id="tooltip"
            role="tooltip"
            style={{ ...styles.popper, zIndex: 150 }}
            ref={setPopperElement}
            {...attributes.popper}
            onClick={(event) => event.stopPropagation()}>
            {!disableArrow && (
                <div id="popper-arrow" className={`${state?.placement} z-150`} data-popper-arrow={true}></div>
            )}

            <div className={styleClasses}>
                <div className="absolute inset-0 -z-1 " style={{ margin: -offset }} />
                {children}
            </div>
        </div>
    )
}

export default memo(Popper)
