import {useEffect, useRef} from "react";
import throttle from "../utils/throttle";

export const useChildrenHide = () => {
    const containerRef = useRef()
    const childrenRefs = useRef({})

    useEffect(() => {
        function hide() {
            if(containerRef.current && childrenRefs.current) {
                const { height, y } = containerRef.current.getBoundingClientRect()

                Object.values(childrenRefs.current).forEach((el) => {
                    const rect = el.getBoundingClientRect()

                    if(Math.ceil(rect.y) >= Math.ceil(y + height)) {
                        el.style.visibility = 'hidden'
                    } else {
                        el.style.visibility = 'visible'
                    }
                })
            }
        }
        hide()

        const throttleHide = throttle(hide, 100)
        window.addEventListener('resize', throttleHide)
        return () => {
            window.removeEventListener('resize', throttleHide)
        }
    })

    return {
        containerRef: containerRef,
        childrenRefs
    }
}
