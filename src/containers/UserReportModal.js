import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import Button from '../components/Button'
import { useTranslation } from 'react-i18next'
import Radio from '../components/Radio'
import EmptyImg from 'assets/svg/illustrations/bell.svg'
import { postAuth } from '../requests/axiosConfig'

const UserReportModal = ({ userId, onClose }) => {
    const { t } = useTranslation()
    const [step, setStep] = useState(1)
    const [reason, setReason] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const handleSetReason = (reason) => () => setReason(reason)

    const options = useMemo(
        () => [
            { title: t('threats'), value: 'threats' },
            { title: t('spam'), value: 'spam' },
            { title: t('misleading'), value: 'misleading' },
            { title: t('fraud'), value: 'fraud' },
            { title: t('lawBreaking'), value: 'lawBreaking' },
            { title: t('unacceptable'), value: 'unacceptable' },
        ],
        [t],
    )

    const handleSubmitComplaint = async () => {
        setIsLoading(true)
        await postAuth(`/users/${userId}/reports`, { reason })
        setStep((s) => s + 1)
        setIsLoading(false)
    }

    return (
        <div className="px-14.5 pb-12 w-460p">
            {step === 1 && (
                <>
                    <div className="mb-10 text-xl font-semibold text-center">{t('reportReason')}</div>
                    <div className="mb-12 text-s">
                        {options.map(({ title, value }) => (
                            <div key={value} className="mt-5 first:mt-0">
                                <Radio label={title} name="reason" onClick={handleSetReason(value)} />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <Button type="secondary" text={t('cancel')} onClick={onClose} />
                        <div className="ml-5">
                            <Button
                                isDisabled={reason === undefined}
                                onClick={handleSubmitComplaint}
                                type="primary"
                                text={t('send')}
                            />
                        </div>
                    </div>
                </>
            )}
            {step === 2 && (
                <div className="text-center animate-appear">
                    <img src={EmptyImg} alt="" className="mb-5 mx-auto" />
                    <div className="text-xl font-semibold tracking-tight mb-3">{t('thanksForReport')}</div>
                    <div className="text-s mb-12 ">{t('yourReportIsHelpful')}</div>
                    <Button type="primary" isLoading={isLoading} onClick={onClose} isFull={true} text={t('continue')} />
                </div>
            )}
        </div>
    )
}
UserReportModal.propTypes = {
    userId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default UserReportModal
