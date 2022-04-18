import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from 'components/Button'
import QuestionImg from 'assets/svg/illustrations/question.svg'
import { useSelector } from 'react-redux'

const WarningModal = ({ onClose }) => {
    const { t } = useTranslation()
    const { warningModalState } = useSelector((state) => state.root)

    return (
        <div className="w-full h-full flex items-center flex-col pb-12 px-14.5">
            <img alt="" src={QuestionImg} />
            <h1 className="text-xl font-semibold mt-5 mb-3">{t('activityType.newWarning')}</h1>
            <div className="text-s text-center px-13.5">{warningModalState.content?.slice(0, 150)}</div>
            <div className="mt-auto w-full">
                <Button onClick={onClose} text={t('understand')} fontWeight="bold" isFull />
            </div>
        </div>
    )
}

export default memo(WarningModal)
