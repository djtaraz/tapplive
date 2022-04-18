import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from 'components/Button'
import { deleteAuth } from 'requests/axiosConfig'
import { useStream } from 'pages/Streams/StreamContext'
import QuestionImg from 'assets/svg/illustrations/question.svg'
import { streamStatus } from 'common/entities/stream'

const DeleteAnnounceModal = ({ onClose, type }) => {
    const { t } = useTranslation()
    const { state } = useStream()
    const { stream } = state

    const handleDelete = () => {
        deleteAuth(`/streams/${stream._id}`).then(() => {
            onClose()
            window.history.back()
        })
    }

    return (
        <div className="w-full h-full flex items-center flex-col pb-12 px-14.5">
            <img alt="" src={QuestionImg} />
            <h1 className="text-xl font-semibold mt-5 mb-3 text-center">
                {type === streamStatus.announcement && `${t('deleteAnnounce')} ?`}
                {type === streamStatus.archived && `${t('deleteArchive')} ?`}
                {type === streamStatus.pending && `${t('deleteAnswerForOrder')} ?`}
            </h1>
            <p className="text-s text-center">
                {type === streamStatus.announcement && t('streamDetails.youCantRestoreAnnouncedStream')}
                {type === streamStatus.archived && t('streamDetails.youCantRestoreArchivedStream')}
                {type === streamStatus.pending && t('streamDetails.youCantRestorePendingStream')}
            </p>
            <div className="mt-auto w-full flex items-center justify-center gap-4">
                <Button onClick={onClose} text={t('back')} fontWeight="bold" />
                <Button onClick={handleDelete} text={t('delete')} type="secondary" fontWeight="bold" />
            </div>
        </div>
    )
}

export default memo(DeleteAnnounceModal)
