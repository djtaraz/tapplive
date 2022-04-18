import React, { memo, useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import axios from 'axios'
import envConfig from 'envConfig'

import Button from 'components/Button'
import { nanoid } from 'nanoid'

const ProfileUsername = ({ onNext, userData }) => {
    const { t } = useTranslation()

    const [isLoading, setIsLoading] = useState(false)
    const [userName, setUserName] = useState('')
    const [error, setError] = useState('')
    const nextStepInputRef = useRef(null)

    const [render, setRender] = useState(false)
    useEffect(() => setRender(true), [])

    const handleInputKeyDown = (e) => {
        if (e.keyCode === 13) {
            nextStepInputRef.current.focus()
        }
    }

    const handleActivate = () =>
        axios.post(
            `${envConfig.apiUrl}/user/account`,
            { name: userName, photoId: userData.photoId },
            { headers: { 'x-session-id': userData.sessionId } },
        )

    const handleUserNameChange = (e) => {
        e.target.value = e.target.value.replace(/ /g, '')
        setUserName(e.target.value.replace(/ /g, ''))
        setError('')
    }

    const generateNickname = () => {
        const nickname = nanoid(12)
        setUserName(nickname)
        setError('')
    }

    const nextStepHandler = () => {
        setIsLoading(true)

        handleActivate()
            .then(() => {
                onNext(userName)
                setIsLoading(false)
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
            <h1 className="text-xl font-semibold mt-6 text-center">{t('authDetails.comeUpUsername')}</h1>
            <p className="text-s mt-3">{t('authDetails.letPeopleFindYouMsg')}</p>

            <div className="flex flex-col gap-1.5 w-full">
                <input
                    onChange={handleUserNameChange}
                    value={userName}
                    placeholder={t('username')}
                    className={cn(
                        'text-s font-semibold p-3.5 rounded-2.5 mt-10 outline-none bg-gray-pale transition-all focus:bg-white border border-gray-pale',
                        userName && 'font-bold',
                        error && 'text-pink-dark border-pink-dark',
                    )}
                    onKeyDown={handleInputKeyDown}
                    maxLength={20}
                />
                <section className="py-2 flex justify-between">
                    {error && (
                        <span
                            className={cn(
                                'text-pink-dark text-ms transition-opacity duration-100 opacity-0',
                                error && 'opacity-100 visible',
                            )}>
                            {error}
                        </span>
                    )}
                    <span
                        onClick={generateNickname}
                        className="text-violet-saturated hover:text-violet-dark text-ms cursor-pointer ml-auto">
                        {t('generate')}
                    </span>
                </section>
            </div>

            <div className="w-full self-end mt-32">
                <Button
                    text={t('continue')}
                    isDisabled={userName === '' ? true : false}
                    onClick={nextStepHandler}
                    ref={nextStepInputRef}
                    isLoading={isLoading}
                    fontWeight="bold"
                    isFull
                    isBig
                />
            </div>
        </div>
    )
}

export default memo(ProfileUsername)
