import React, { memo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ReactComponent as CloseIcon } from '../assets/svg/close-circle.svg'
import { Slide, toast, ToastContainer } from 'react-toastify'
import { ReactComponent as WarnIcon } from '../assets/svg/warning.svg'
import { setError } from '../slices/rootSlice'

const ErrorToaster = () => {
    const dispatch = useDispatch()
    const { error } = useSelector((state) => state.root)

    useEffect(() => {
        if (error) {
            if (process.env.NODE_ENV === 'development') {
                console.log(error.instance)
            }

            toast.error(
                <div className="flex">
                    <WarnIcon className="mr-2" /> {error.message}
                </div>,
                {
                    onClose() {
                        dispatch(setError(null))
                    },
                    toastId: error.id,
                    autoClose: 2500,
                },
            )
        }
    }, [error, dispatch])

    return (
        <ToastContainer
            autoClose={2500}
            position="top-center"
            hideProgressBar={true}
            closeButton={<CloseIcon className="absolute top-0 right-0 -m-2" />}
            transition={Slide}
        />
    )
}

export default memo(ErrorToaster)
