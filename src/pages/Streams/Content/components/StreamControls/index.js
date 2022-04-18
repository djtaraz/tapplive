import React, { memo, useMemo, useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import {
    SubscribeBtn,
    UnsubscribeBtn,
    StartStreamBtn,
    DeleteAnnounceBtn,
    PostponeStreamBtn,
    FinishStreamBtn,
    PauseStreamBtn,
    WatchRecordingBtn,
    LeaveFeedbackBtn,
    DeleteArchivedBtn,
    EditStreamBtn,
    AcceptOrderBtn,
    SettingsBtn,
    DeletePendingBtn,
} from './StreamControlBtns'
import { streamStatus } from 'common/entities/stream'
import { useStream } from '../../../StreamContext'
import SendDonationBtn from './StreamControlBtns/SendDonationBtn'
import { dateFromString } from 'utils/dateUtils'
import Modal from 'components/Modal'
import { FinishStream } from '../../modals/streamer'

const StreamControls = () => {
    const { t } = useTranslation()
    const { isMe, state, serverSettings, isAnswerForMe } = useStream()
    const { stream } = state

    const [currentTime, setCurrentTime] = useState(Date.now())
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(Date.now()), 1000)
        return () => clearInterval(interval)
    }, [])
    const modalRef = useRef()

    const openFinishModal = () => modalRef.current.open()
    const closeModal = () => modalRef.current.close()
    const UserAnnouncementControls = useMemo(() => {
        const isRefundable = currentTime < dateFromString(stream.refundableDate)
        return (
            <>
                {!stream.haveTicket && <SubscribeBtn />}

                {stream.haveTicket && isRefundable && <UnsubscribeBtn />}

                {stream.haveTicket && !isRefundable && <SendDonationBtn />}
            </>
        )
    }, [currentTime, stream.refundableDate, stream.haveTicket])

    const StreamerAnnouncementControls = useMemo(() => {
        const isEditable = dateFromString(stream.editableDate) > currentTime
        const isStartable = dateFromString(stream.startDate) <= currentTime
        return (
            <>
                <StartStreamBtn text={t('startStream')} isDisabled={!isStartable} />

                {isEditable && (
                    <>
                        <DeleteAnnounceBtn />
                        <EditStreamBtn />
                    </>
                )}

                {!isEditable && stream.canDelay && (
                    <PostponeStreamBtn delayInterval={serverSettings.delayInterval} isDisabled={!isStartable} />
                )}
            </>
        )
    }, [stream.editableDate, stream.startDate, stream.canDelay, currentTime, t, serverSettings.delayInterval])

    const UserSuspendedControls = useMemo(() => {
        return (
            <>
                {!stream.haveTicket && <SubscribeBtn />}
                {stream.haveTicket && <SendDonationBtn />}
                {stream.haveTicket && <LeaveFeedbackBtn />}
            </>
        )
    }, [stream.haveTicket])

    const StreamerSuspendedControls = useMemo(() => {
        return (
            <>
                <FinishStreamBtn openFinishModal={openFinishModal} />
                {stream.status === streamStatus.live ? (
                    <PauseStreamBtn />
                ) : (
                    <StartStreamBtn isContinue text={t('continueStream')} />
                )}
                <SettingsBtn />
            </>
        )
    }, [t, stream.status])

    const UserClosedControls = useMemo(() => {
        return <>{!stream.haveTicket ? <WatchRecordingBtn /> : <LeaveFeedbackBtn />}</>
    }, [stream.haveTicket])

    const StreamerArchivedControls = useMemo(() => {
        return <DeleteArchivedBtn />
    }, [])

    const UserArchivedControls = useMemo(() => {
        return <> {stream.haveTicket && <LeaveFeedbackBtn />}</>
    }, [stream.haveTicket])

    const StreamerPendingControls = useMemo(() => {
        return (
            <>
                <EditStreamBtn isPrimary />
                <DeletePendingBtn />
            </>
        )
    }, [])

    const OrderAuthorPendingControls = useMemo(() => {
        return <AcceptOrderBtn />
    }, [])
    return (
        <div className="inline-grid md:grid-flow-col grid-flow-row gap-3">
            {stream.status === streamStatus.announcement && !isAnswerForMe && (
                <>{isMe ? StreamerAnnouncementControls : UserAnnouncementControls}</>
            )}
            {(stream.status === streamStatus.live || stream.status === streamStatus.suspended) && (
                <>{isMe ? StreamerSuspendedControls : UserSuspendedControls}</>
            )}

            {stream.status === streamStatus.closed && !isMe && UserClosedControls}
            {stream.status === streamStatus.archived && isMe && StreamerArchivedControls}
            {stream.status === streamStatus.archived && !isMe && UserArchivedControls}

            {stream.status === streamStatus.pending && isMe && StreamerPendingControls}
            {stream.status === streamStatus.pending && isAnswerForMe && OrderAuthorPendingControls}
            {isMe && (
                <Modal ref={modalRef}>
                    <FinishStream onClose={closeModal} />
                </Modal>
            )}
        </div>
    )
}

export default memo(StreamControls)
