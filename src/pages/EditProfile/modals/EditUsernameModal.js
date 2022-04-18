import React, { memo, useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { putAuth } from 'requests/axiosConfig'
import { useDispatch, useSelector } from 'react-redux'

import Button from 'components/Button'
import { ReactComponent as Illustration } from 'assets/svg/illustrations/edit-profile-page/username-changed.svg'
import { setMe } from 'slices/rootSlice'

const EditProfileUsername = ({ onClose }) => {
    const { t } = useTranslation()
    const { me = {} } = useSelector((state) => state.root)
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)

    const [userName, setUserName] = useState('')
    const [error, setError] = useState('')

    const nextStepInputRef = useRef(null)

    const [step, setStep] = useState(0)

    const [render, setRender] = useState(false)
    useEffect(() => setRender(true), [])

    const handleUserNameChange = (e) => {
        e.target.value = e.target.value.replace(/ /g, '')
        setUserName(e.target.value.replace(/ /g, ''))
        setError('')
    }

    const handleInputKeyDown = (e) => {
        if (e.keyCode === 13) {
            nextStepInputRef.current.focus()
        }
    }

    const handleUpdateClick = () => {
        setIsLoading(true)

        putAuth(`/user/settings`, {
            name: userName,
        })
            .then(() => {
                setIsLoading(false)
                dispatch(setMe({ ...me, name: userName }))
                setStep(1)
            })

            .catch(() => {
                setError(t('notUniqueUsernameMsg'))
                setIsLoading(false)
            })
    }

    return (
        <div
            className={cn(
                'w-full h-full px-12 pb-12.5 flex flex-col items-center transition-opacity duration-1000 opacity-0',
                render && 'opacity-100',
            )}>
            {step === 0 && (
                <React.Fragment>
                    <h1 className="text-xl font-semibold">{t('changeUsername')}</h1>
                    <p className="text-s mt-3">{t('authDetails.letPeopleFindYouMsg')}</p>

                    <div className="flex flex-col gap-1.5">
                        <input
                            onKeyDown={handleInputKeyDown}
                            onChange={handleUserNameChange}
                            placeholder={t('username')}
                            className={cn(
                                'border border-gray-pale text-s font-semibold p-3.5 text-s rounded-2.5 mt-10 outline-none bg-gray-pale transition-all focus:bg-white border border-gray-pale',
                                userName && 'font-bold',
                                error && 'text-pink-dark border-pink-dark',
                            )}
                            style={{ width: '350px' }}
                            maxLength={20}
                        />

                        <span
                            className={cn(
                                'text-pink-dark py-2 text-ms transition-opacity duration-100 opacity-0',
                                error && 'opacity-100 visible',
                            )}>
                            {error}
                        </span>
                    </div>

                    <div className="w-full self-end mt-auto">
                        <Button
                            text={t('updateUsername')}
                            isDisabled={userName === '' ? true : false}
                            onClick={handleUpdateClick}
                            ref={nextStepInputRef}
                            isLoading={isLoading}
                            fontWeight="bold"
                            isFull
                            isBig
                        />
                    </div>
                </React.Fragment>
            )}

            {step === 1 && (
                <React.Fragment>
                    <Illustration className="mt-10" />
                    <h2 className="text-xl text-center font-semibold mt-5.5">
                        {t('settingsDetails.usernameHasChanged')}
                    </h2>
                    <div className="w-full self-end mt-auto">
                        <Button
                            text={t('settingsDetails.backToSettings')}
                            onClick={onClose}
                            fontWeight="bold"
                            isFull
                            isBig
                        />
                    </div>
                </React.Fragment>
            )}
        </div>
    )
}

export default memo(EditProfileUsername)
