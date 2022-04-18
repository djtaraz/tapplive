import React, { memo, useState, useEffect } from 'react'
import { ReactComponent as ChevronLeftIcon } from 'assets/svg/chevron-left.svg'
import InitialScreen from './InitialScreen'
import PhoneAuth from './PhoneAuth'
import ProfileImage from './ProfileImage'
import ProfileUsername from './ProfileUsername'
import FavoriteTags from './FavoriteTags'
import BlockTags from './BlockTags'
import { useDispatch } from 'react-redux'
import { setIsAuthenticated } from 'slices/rootSlice'
import { setModalState } from 'slices/rootSlice'
import PayCashLogin from './PayCashLogin'

const Auth = () => {
    const dispatch = useDispatch()
    const handleClose = () => dispatch(setModalState(false))
    const [userData, setUserData] = useState({
        phoneNumber: '',
        sessionId: '',
        token: '',
        photoId: '',
        photoFile: '',
        userName: '',
        status: '',

        excludeIds: '',
    })
    const [payCashLoginData, setPayCashLogin] = useState()
    const [step, setStep] = useState(-1)

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.keyCode === 27) {
                if (step < 3) {
                    handleClose()
                } else {
                    return false
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => document.removeEventListener('keydown', handleKeyDown)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step])

    const handlePhoneAuth = (data) => {
        setUserData({ ...userData, ...data })

        /* Login Case */
        if (data.status === 'active') {
            localStorage.setItem('sessionId', data.sessionId)
            dispatch(setIsAuthenticated(true))
            handleClose()
            // window.location.reload()
        } else {
            /* Registration Case */
            setStep(1)
        }
    }

    const onAppLogin = (data) => {
        setPayCashLogin(data)
        setStep(5)
    }

    // ProfileImage Screen
    const handleProfileImage = ({ photoId, photoFile }) => {
        setUserData({ ...userData, photoId, photoFile })
        setStep(step + 1)
    }

    // ProfileUsername Screen
    const handleProfileUsername = (data) => {
        setUserData({ ...userData, userName: data })

        /* Add auth status to local storage */
        localStorage.setItem('sessionId', userData.sessionId)

        /* Next step */
        setStep(step + 1)
    }

    // FavoriteTags Screen
    const handleFavoriteTags = (excludeIds) => {
        setStep(step + 1)
        setUserData({ ...userData, excludeIds })
    }

    // BlockTags Screen
    const handleBlockTags = () => {
        handleClose()
        dispatch(setIsAuthenticated(true))
        // window.location.reload()
    }

    const goBack = () =>
        setStep((prev) => {
            if (prev === 5) {
                return 0
            }
            return step - 1
        })

    return (
        <div className="w-460p">
            <div className="items-center h-0 ju flex z-50 absolute top-9 px-7.5 w-full">
                <ChevronLeftIcon
                    onClick={goBack}
                    className={`cursor-pointer ${step !== 2 && step !== 5 ? 'invisible' : ''}`}
                />

                {step > 0 && step !== 5 && (
                    <div className="mx-auto">
                        <span className="text-violet-saturated text-lg font-bold">{step}</span>
                        <span className="text-gray-light text-base">/4</span>
                    </div>
                )}
                <div></div>
            </div>
            {step === -1 && (
                <InitialScreen
                    onNext={() => {
                        setStep(step + 1)
                    }}
                />
            )}
            {step === 0 && <PhoneAuth onNext={handlePhoneAuth} onAppLogin={onAppLogin} />}
            {step === 1 && <ProfileImage userData={userData} onNext={handleProfileImage} />}
            {step === 2 && <ProfileUsername userData={userData} onNext={handleProfileUsername} />}
            {step === 3 && <FavoriteTags userData={userData} onNext={handleFavoriteTags} />}
            {step === 4 && <BlockTags onNext={handleBlockTags} userData={userData} />}
            {step === 5 && <PayCashLogin onNext={handlePhoneAuth} payCashLoginData={payCashLoginData} />}
        </div>
    )
}

export default memo(Auth)
