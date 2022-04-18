import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from 'components/Button'
import { deleteAuth } from 'requests/axiosConfig'
import { formatDate } from 'utils/dateUtils'
import { useStream } from '../../../StreamContext'
import QuestionImg from 'assets/svg/illustrations/question.svg'
import { updateStream } from '../../../streamStorage'

const UnsubscribeModal = ({ onClose }) => {
    const { state, streamDispatch } = useStream()
    const { stream } = state
    const { t } = useTranslation()

    const handleUnsubscribe = async () => {
        await deleteAuth(`/streams/${stream._id}/tickets`)
        streamDispatch(updateStream({ haveTicket: false }))
        onClose()
    }

    return (
        <div className="w-full h-full flex items-center flex-col pb-12 px-14.5">
            <img alt="" src={QuestionImg} />
            <h1 className="text-xl font-semibold mt-5 mb-3">{t('cancelSubscribtion')} ?</h1>
            <p className="text-s text-center">
                {t('youCanCancelSubscribtionUntil')}
                <span className="font-bold"> {formatDate(new Date(`${stream.refundableDate}`))} г.</span>
            </p>
            <div className="mt-auto w-full">
                <Button onClick={handleUnsubscribe} text={t('cancelSubscribtion')} fontWeight="bold" isFull />
            </div>
        </div>
    )
}

export default memo(UnsubscribeModal)
