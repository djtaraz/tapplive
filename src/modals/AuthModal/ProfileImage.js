import React, { memo, useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { nanoid } from 'nanoid'

import { ReactComponent as ImageEditIcon } from 'assets/svg/edit-image.svg'
import ProfileImagePlaceholder from 'assets/svg/profile-image.svg'
import Button from 'components/Button'
import { setError } from 'slices/rootSlice'
import { useDispatch } from 'react-redux'
import { post } from 'requests/axiosConfig'

import envConfig from 'envConfig'

const ProfileImage = ({ onNext, userData }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)
    const [image, setImage] = useState(userData.photoFile ? userData.photoFile : ProfileImagePlaceholder)
    const [formDataImage, setFormDataImage] = useState()
    const nextStepButtonRef = useRef(null)

    const [render, setRender] = useState(false)
    useEffect(() => setRender(true), [])

    useEffect(() => {
        document.addEventListener('keydown', handleFileInputKeyDown)
        return () => document.removeEventListener('keydown', handleFileInputKeyDown)
    }, [])

    const handleFileInputKeyDown = (e) => {
        if (e.keyCode === 13) {
            nextStepButtonRef.current.focus()
        }
    }

    const handleImageChange = async (event) => {
        if (event.target.files[0] !== undefined) {
            setImage(URL.createObjectURL(event.target.files[0]))
            setFormDataImage(event.target.files[0])
        }
    }

    const uploadFile = async (formData) => {
        const { data } = await post(`${envConfig.apiUrl}/files/upload`, formData, {
            headers: {
                'x-session-id': userData.sessionId,
            },
        })

        return data.result
    }

    const handleNextStep = async () => {
        setIsLoading(true)

        if (userData.photoFile === image) {
            onNext({ photoId: userData.photoId, photoFile: userData.photoFile })
        } else {
            let fd = new FormData()
            fd.append('file', formDataImage)

            try {
                const { _id } = await uploadFile(fd)
                onNext({ photoId: _id, photoFile: image })
            } catch (error) {
                if (error?.response?.status === 413) {
                    dispatch(setError({ message: t('imageUploadLimitMsg'), error, id: nanoid() }))
                }
            } finally {
                setIsLoading(false)
            }
        }
    }

    const isImageExist = useMemo(() => formDataImage || userData.photoFile, [formDataImage, userData.photoFile])
    return (
        <div
            className={cn(
                'w-full h-full flex flex-col px-14 pb-12.5 items-center transition-opacity duration-1000',
                render ? 'opacity-100' : 'opacity-0',
            )}>
            <input onChange={handleImageChange} className="invisible" accept="image/*" type="file" id="image" />
            <label htmlFor="image">
                <div className="relative w-37 h-37">
                    <img
                        className="rounded-4 cursor-pointer object-fit w-37 h-37"
                        alt="Profile"
                        height="152"
                        width="152"
                        src={image}
                    />
                    {(formDataImage || userData.photoFile) && <ImageEditIcon className="absolute top-2 right-2" />}
                </div>
            </label>

            <h1 className="text-xl font-semibold mt-8">{t('uploadPhoto')}</h1>
            <p className="text-s mt-4">{t('authDetails.changeProfilePhotoMsg')}</p>

            <div className="w-full self-end mt-15.5">
                {isImageExist ? (
                    <Button
                        text={t('continue')}
                        onClick={handleNextStep}
                        ref={nextStepButtonRef}
                        isLoading={isLoading}
                        fontWeight="bold"
                        isFull
                        isBig
                    />
                ) : (
                    <Button text={t('skip')} onClick={onNext} fontWeight="bold" isFull isBig />
                )}
            </div>
        </div>
    )
}

export default memo(ProfileImage)
