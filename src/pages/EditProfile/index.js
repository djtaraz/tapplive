import React, { useMemo, useRef, useState } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'

import Modal from 'components/Modal'
import Select from 'components/Select'
import EditProfileModals from './modals'

import EditMain from './EditMain'
import EditFavoriteTags from './EditFavoriteTags'
import EditBlockTags from './EditBlockTags'
import { useSelector } from 'react-redux'
import { screens } from 'common/screenResolutions'

function openInNewTab(url) {
    window.open(url, '_blank').focus()
}

function EditProfile() {
    const { t, i18n } = useTranslation()

    const modalRef = useRef(null)
    const [modalState, setModalState] = useState('')
    const [tabState, setTabState] = useState('edit-main')
    const { screen } = useSelector((state) => state.root)

    const handleModalOpen = (type) => {
        setModalState(type)
        modalRef.current.open()
    }

    const handleModalClose = () => {
        modalRef.current.close()
    }

    const selectMenuItems = [
        { value: 'edit-main', label: t('profileSettings') },
        { value: 'edit-favorite-tags', label: t('favoriteTags') },
        {
            value: 'edit-block-tags',
            label: t('blockedTagsList'),
        },
        {
            value: 'language',
            label: t('language'),
        },
        {
            value: 'privacy-policy',
            label: t('privacyPolicy'),
        },
        {
            value: 'user-agreement',
            label: t('userAgreement'),
        },
        {
            value: 'delete-profile',
            label: t('deleteAccount'),
        },
        {
            value: 'leave-profile',
            label: t('exit'),
        },
    ]
    const agreementLink = useMemo(() => `${process.env.PUBLIC_URL}/locales/${i18n.language}/userAgreement.pdf`, [
        i18n.language,
    ])
    const policyLink = useMemo(() => `${process.env.PUBLIC_URL}/locales/${i18n.language}/privacyPolicy.pdf`, [
        i18n.language,
    ])
    const handleSelectChange = (e) => {
        if (e.value === 'leave-profile' || e.value === 'delete-profile' || e.value === 'language') {
            handleModalOpen(e.value)
            return
        }
        if (e.value === 'user-agreement') {
            openInNewTab(agreementLink)
            return
        }
        if (e.value === 'privacy-policy') {
            openInNewTab(policyLink)
            return
        }
        setTabState(e.value)
    }

    return (
        <div className="flex w-full py-10" style={{ maxWidth: '1024px', margin: '0 auto' }}>
            {screen !== screens.sm && (
                <div className="flex w-auto h-full flex-col" style={{ width: '285px', minWidth: '180px' }}>
                    <a
                        onClick={() => setTabState('edit-main')}
                        className={cn(
                            'text-m font-bold mb-8 cursor-pointer transition-all',
                            tabState === 'edit-main' && 'text-violet-saturated',
                        )}>
                        {t('profileSettings')}
                    </a>
                    <a
                        onClick={() => setTabState('edit-favorite-tags')}
                        className={cn(
                            'text-m font-bold mb-8 cursor-pointer transition-all',
                            tabState === 'edit-favorite-tags' && 'text-violet-saturated',
                        )}>
                        {t('favoriteTags')}
                    </a>
                    <a
                        onClick={() => setTabState('edit-block-tags')}
                        className={cn(
                            'text-m font-bold mb-8 cursor-pointer transition-all',
                            tabState === 'edit-block-tags' && 'text-violet-saturated',
                        )}>
                        {t('blockedTagsList')}
                    </a>
                    <a className="text-m font-bold mb-8 cursor-pointer" onClick={() => handleModalOpen('language')}>
                        {t('language')}
                    </a>
                    <a
                        className="text-m font-bold mb-8 cursor-pointer"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={policyLink}>
                        {t('privacyPolicy')}
                    </a>
                    <a
                        className="text-m font-bold mb-8 cursor-pointer"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={agreementLink}>
                        {t('userAgreement')}
                    </a>
                    <a
                        className="text-m font-bold mb-8 cursor-pointer"
                        onClick={() => handleModalOpen('delete-profile')}>
                        {t('deleteAccount')}
                    </a>
                    <a
                        className="text-m font-bold mb-8 cursor-pointer"
                        onClick={() => handleModalOpen('leave-profile')}>
                        {t('exit')}
                    </a>
                </div>
            )}
            <div className={cn('flex w-full flex-col', screen !== screens.sm ? 'ml-24' : 'px-12')}>
                {screen === screens.sm && (
                    <div className="mb-10">
                        <Select
                            value={selectMenuItems.find((item) => item.value === tabState)}
                            onChange={handleSelectChange}
                            options={selectMenuItems}
                            isSearchable={false}
                        />
                    </div>
                )}
                {tabState === 'edit-main' && <EditMain />}
                {tabState === 'edit-favorite-tags' && <EditFavoriteTags />}
                {tabState === 'edit-block-tags' && <EditBlockTags />}
            </div>
            <Modal ref={modalRef}>
                <EditProfileModals onClose={handleModalClose} type={modalState} />
            </Modal>
        </div>
    )
}

export default EditProfile
