import React, { memo, useState, useEffect } from 'react'
import { useLocation } from 'wouter'

import { Trans, useTranslation } from 'react-i18next'
import cn from 'classnames'
import { deleteAuth } from 'requests/axiosConfig'

import Loader from 'components/Loader'

import { useDispatch } from 'react-redux'
import { setIsAuthenticated } from 'slices/rootSlice'

import CryImg from 'assets/img/cry.png'

const DeleteProfile = ({ onClose }) => {
    const [render, setRender] = useState(false)
    useEffect(() => setRender(true), [])

    const { t } = useTranslation()
    const dispatch = useDispatch()
    const [, setLocation] = useLocation()
    const [isLoading, setIsLoading] = useState(false)

    const handleDeleteButton = () => {
        setIsLoading(true)

        deleteAuth(`/user/account`).then(() => {
            setIsLoading(false)

            localStorage.clear()
            dispatch(setIsAuthenticated(false))
            onClose()

            setLocation('/')
            // window.location.reload()
        })
    }

    return (
        <div
            className={cn(
                'w-full h-full px-7 pb-12.5 flex flex-col items-center transition-opacity duration-1000 opacity-0',
                render && 'opacity-100',
            )}>
            <img src={CryImg} alt="" />
            <h2 className="text-xl text-center font-semibold mt-5.5">{t('settingsDetails.deleteProfileTitle')} </h2>
            <p className="text-s text-center mt-3">
                <Trans i18nKey="settingsDetails.profileDeleteMsg" />
            </p>
            <div className="w-full self-end mt-auto flex justify-center">
                <button
                    onClick={onClose}
                    className="w-28 h-10 text-s font-bold flex justify-center outline-none focus:outline-none items-center rounded-2.5 cursor-pointer bg-violet-saturated text-white">
                    {t('back')}
                </button>
                <button
                    onClick={handleDeleteButton}
                    className="outline-none focus:outline-none w-24 h-10 text-s font-bold ml-3 flex justify-center items-center text-black rounded-2.5 cursor-pointer border border-gray-light">
                    {isLoading ? <Loader theme="violet" width={32} height={12} /> : t('delete')}
                </button>
            </div>
        </div>
    )
}

export default memo(DeleteProfile)
