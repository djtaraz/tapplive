import React, { useRef, useState } from 'react'
import { putAuth } from 'requests/axiosConfig'
import { Trans, useTranslation } from 'react-i18next'
import { nanoid } from 'nanoid'

import ProfileImagePlaceholder from 'assets/svg/profile-user-image.svg'
import { useDispatch, useSelector } from 'react-redux'
import EditProfileModals from './modals'
import { setError, setMe } from 'slices/rootSlice'
import Modal from 'components/Modal'
import { cropImage } from '../../utils/cropImage'
import { uploadFile } from 'requests/file-requests'

function EditMain() {
    const { me = {} } = useSelector((state) => state.root)
    const dispatch = useDispatch()

    const { t } = useTranslation()

    const modalRef = useRef(null)
    const [modalState, setModalState] = useState('')

    const handleModalOpen = (type) => {
        setModalState(type)
        modalRef.current.open()
    }

    const handleModalClose = () => {
        modalRef.current.close()
    }

    const handleProfileImageChange = async (e) => {
        let imageData = e.target.files[0]

        if (imageData) {
            const formData = new FormData()
            formData.append('file', imageData)

            try {
                const { _id, url } = await uploadFile(formData)

                await putAuth(`/user/settings`, {
                    photoId: _id,
                })
                dispatch(setMe({ ...me, photo: { url, _id } }))
            } catch (error) {
                if (error?.response?.status === 413) {
                    dispatch(setError({ message: t('imageUploadLimitMsg'), error, id: nanoid() }))
                }
                console.log({ error })
            }
        } else {
            return false
        }
    }

    return (
        <React.Fragment>
            <div className="flex">
                <div className="relative">
                    <img
                        src={`${(me?.photo?.url && cropImage(me?.photo?.url, 200)) || ProfileImagePlaceholder}`}
                        alt="user-profile"
                        style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '20px' }}
                        className="object-cover"
                    />
                    {me?.tLevel?.misc?.frameColors && (
                        <div
                            className="absolute -inset-3 -z-1"
                            style={{
                                transform: 'scale(.87)',
                                borderRadius: '25px',
                                background: `linear-gradient(180deg, ${me?.tLevel?.misc?.frameColors.join(',')})`,
                            }}></div>
                    )}
                </div>
                <div className="flex flex-col ml-6">
                    <h4 className="text-base font-semibold mb-2">{t('settingsDetails.uploadNewProfilePhotoMsg')} </h4>
                    <p className="text-s mb-3">
                        <Trans i18nKey="availableImageFormatsMsg" />
                    </p>

                    <input
                        className="invisible w-0 h-0"
                        onChange={handleProfileImageChange}
                        accept="image/*"
                        type="file"
                        id="profile-image"
                        name="profile-image"
                    />

                    <div className="flex">
                        <label
                            htmlFor="profile-image"
                            className="w-36 h-10 text-s font-bold flex justify-center items-center bg-violet-saturated text-white rounded-2.5 cursor-pointer">
                            {t('chooseFile')}
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex mt-20 flex-col">
                <h2 className="text-lg font-bold mb-10">{t('personalData')}</h2>
                <div className="flex flex-col w-full" style={{ maxWidth: '516px' }}>
                    <div className="flex w-full">
                        <span className="text-s w-36">{t('name')}</span>
                        <span className="text-base font-bold justify-center flex-1">{me?.name}</span>
                        <span
                            onClick={() => handleModalOpen('username')}
                            className="text-s font-semibold text-violet-saturated cursor-pointer">
                            {t('change')} {'>'}
                        </span>
                    </div>
                    <div className="flex w-full mt-8">
                        <span className="text-s w-36">{me?.registerBySocNet ? 'EOSAccount' : t('phone')}</span>
                        <span className="text-base font-bold justify-center flex-1">{me?.login}</span>
                        {!me?.registerBySocNet && (
                            <span
                                onClick={() => handleModalOpen('number')}
                                className="text-s font-semibold text-violet-saturated cursor-pointer">
                                {t('change')} {'>'}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <Modal ref={modalRef}>
                <EditProfileModals type={modalState} onClose={handleModalClose} />
            </Modal>
        </React.Fragment>
    )
}

export default EditMain
