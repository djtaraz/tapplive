import React, { memo, useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import parsePhoneNumber, { formatIncompletePhoneNumber } from 'libphonenumber-js'
import cn from 'classnames'
import { nanoid } from 'nanoid'

import { post } from 'requests/axiosConfig'

import { userSessionID } from './fields'

import Button from 'components/Button'

import { secondsToTime } from 'utils/numberUtils'
import { setError } from 'slices/rootSlice'
import { useDispatch } from 'react-redux'
import PhoneInput from 'components/PhoneInput'
import { useMutation } from 'react-query'
import { ReactComponent as PayCashLogo } from 'assets/svg/paycash-logo.svg'

const PhoneAuth = ({ onNext, onAppLogin }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const [userData, setUserData] = useState({
        countryCode: '+7',
        countryISO: 'RU',

        phoneNumber: '',
        authCode: '',

        api: {
            token: '',
            code: '',
        },
    })

    const [errors, setErrors] = useState({
        phoneField: '',
        codeField: '',
    })

    const [isLoading, setIsLoading] = useState(false)

    const phoneInputRef = useRef(null),
        codeInputRef = useRef(null),
        sendCodeInputRef = useRef(null),
        nextStepInputRef = useRef(null)

    const [timer, setTimer] = useState(0)

    const [isValid, setIsValid] = useState(false)

    /* Initial Animation */
    const [render, setRender] = useState(false)
    useEffect(() => setRender(true), [])

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) {
                if (phoneInputRef.current === document.activeElement) {
                    sendCodeInputRef.current.focus()
                } else if (codeInputRef.current === document.activeElement) {
                    nextStepInputRef.current.focus()
                }
            }
        })
    }, [])

    useEffect(() => {
        if (timer !== 0) {
            const interval = setInterval(() => {
                setTimer(timer - 1)
            }, 1000)

            return () => clearInterval(interval)
        } else if (timer === 0) {
            setErrors({ phoneField: '', codeField: '' })
            codeInputRef.current.value = ''
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timer])

    const phoneNumberInputHandler = (e, iso) => {
        setErrors({ phoneField: '' })

        let patt = /(.?\d){4,}/

        if (patt.test(e.target.value)) {
            e.target.value = formatIncompletePhoneNumber(e.target.value, iso)
        } else {
            return 0
        }

        const number = parsePhoneNumber(e.target.value, iso)

        if (number.isValid() === true) {
            setIsValid(true)
        } else {
            setIsValid(false)
        }

        setUserData({ ...userData, phoneNumber: e.target.value, countryISO: iso })
    }

    const authCodeInputHandler = (e) => {
        setErrors({ codeField: '' })
        setUserData({ ...userData, authCode: e.target.value })
    }

    const sendCodeHandler = () => {
        const number = parsePhoneNumber(userData.phoneNumber, userData.countryISO)
        /* Errors case */
        if (userData.phoneNumber.length === 0) {
            setErrors({ phoneField: t('enterPhoneNumber') })
            phoneInputRef.current.focus()
        } else if (number.isValid() === false) {
            setErrors({ phoneField: t('wrongPhoneNumberMsg') })
            phoneInputRef.current.focus()
        } else {
            /* Focus on Auth code input */
            codeInputRef.current.value = ''
            codeInputRef.current.focus()

            post(`/user/request-signin`, {
                phone: number.number,
            })
                .then(({ data }) => {
                    setUserData({
                        ...userData,
                        api: {
                            code: data.result.code,
                            token: data.result.token,
                        },
                    })

                    /* DEBUG */
                    data?.result?.code &&
                        window.alert(
                            t('enterDebugCode', {
                                code: data.result.code,
                            }),
                        )
                    setTimer(data.result.timeout)
                })
                .catch((error) => {
                    if (error?.response.data.error && error.response.data.error.id === 400.106) {
                        dispatch(setError({ message: t('tooOftenErrorMessage'), error, id: nanoid() }))
                    } else if (error?.response.data.error && error.response.data.error.id === 400.102) {
                        dispatch(setError({ message: t('notUniqueNumberMsg'), error, id: nanoid() }))
                    }
                })
        }
    }

    const nextStepHandler = async () => {
        setIsLoading(true)

        post(`/user/session/?_fields=${userSessionID}`, {
            token: userData.api.token,
            code: userData.authCode,
        })
            .then(({ data }) => {
                let phoneNumber = `${userData.countryCode}${userData.phoneNumber}`,
                    sessionId = data.result.sessionId,
                    token = userData.api.token,
                    status = data.result.user.status

                setIsLoading(false)
                onNext({ phoneNumber, sessionId, token, status })
            })
            .catch(() => {
                setErrors({ codeField: t('wrongCodeMsg') })
                codeInputRef.current.focus()
                setIsLoading(false)
            })
    }
    const { mutate } = useMutation({
        mutationKey: 'withdraw',
        mutationFn: () => post(`/user/session/eos`),
        onSuccess: ({ data }) => onAppLogin(data.result),
    })

    return (
        <div
            className={`w-full h-full px-14 pb-12.5 flex flex-col transition-opacity duration-1000 text-center ${
                render ? 'opacity-100' : 'opacity-0'
            }`}>
            <h3 className="w-full text-xl font-semibold">{t('enter')}</h3>
            <p className="text-s tracking-0.01 mt-3">{t('LoginWithPayCashApp')}</p>
            <div onClick={mutate} className="mt-5 border border-gray-light rounded-2.5 p-2.5 cursor-pointer">
                <PayCashLogo className="mx-auto" />
            </div>
            <p className="text-s tracking-0.01 my-5">{t('or').toLowerCase()}</p>

            <PhoneInput
                inputRef={phoneInputRef}
                phoneNumberInputHandler={phoneNumberInputHandler}
                value={userData.phoneNumber}
            />
            <span
                className={`text-pink-dark text-ms transition-all duration-100 opacity-0 ${
                    errors.phoneField ? 'opacity-100 visible mb-4' : ''
                }`}>
                {errors.phoneField}
            </span>
            <div className="grid grid-cols-2 gap-8 justify-between">
                <div className="flex flex-col gap-3">
                    <input
                        placeholder={t('enterCode')}
                        className={`font-primary ${
                            userData.authCode ? 'font-bold' : 'font-semibold'
                        } pl-4 h-12  w-full text-base rounded-2.5 bg-gray-pale border border-white transition-all outline-none ${
                            errors.codeField ? 'text-pink-dark border-pink-dark' : ''
                        } transition-all focus:bg-white border border-gray-pale`}
                        maxLength="4"
                        onChange={authCodeInputHandler}
                        ref={codeInputRef}
                    />

                    <span
                        className={`text-pink-dark text-ms transition-opacity duration-100 opacity-0 ${
                            errors.codeField ? 'opacity-100 visible' : ''
                        }`}>
                        {errors.codeField}
                    </span>
                </div>
                <div>
                    <button
                        ref={sendCodeInputRef}
                        onClick={sendCodeHandler}
                        disabled={timer !== 0}
                        className={`h-12 px-5 w-full rounded-2.5 text-s transition-all focus:outline-none  ${cn(
                            isValid
                                ? 'bg-pink-dark text-white'
                                : 'bg-button-disabled text-button-disabledFont cursor-default',

                            timer > 0 ? `bg-button-disabled text-button-disabledFont cursor-default` : '',
                        )} `}>
                        {timer <= 0 ? (
                            <span className="font-bold">{t('sendCode')}</span>
                        ) : (
                            <span className="text-xs font-bold">
                                {t('sendAgain')} {secondsToTime(timer)}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <Button
                ref={nextStepInputRef}
                fontWeight="bold"
                text={t('login')}
                isDisabled={userData.authCode !== '' ? false : true}
                onClick={nextStepHandler}
                isLoading={isLoading}
                isFull
                isBig
                className="w-full mt-18"
            />
        </div>
    )
}

export default memo(PhoneAuth)
