import React, { memo, useRef, useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import Button from 'components/Button'
import Modal from 'components/Modal'
import SendDonate from '../../../modals/user/SendDonation'
import { useStream } from 'pages/Streams/StreamContext'
import { streamStatus } from 'common/entities/stream'
import { dateFromString } from 'utils/dateUtils'

const SendDonationBtn = ({ text }) => {
    const modalRef = useRef()
    const { t } = useTranslation()
    const { state, isAnswerForMe, isMe } = useStream()
    const { stream } = state

    const openModal = () => modalRef.current.open()
    const closeModal = () => modalRef.current.close()
    const [currentTime, setCurrentTime] = useState(Date.now())
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(Date.now()), 1000)
        return () => clearInterval(interval)
    }, [])

    const Btn = useCallback(() => <Button isFull={true} text={text || `${t('sendDonation')}`} onClick={openModal} />, [
        t,
        text,
    ])
    const isRefundable = currentTime < dateFromString(stream.refundableDate)
    const announcementRules = !isMe &&
        stream.haveTicket &&
        !isRefundable &&
        stream.status === streamStatus.announcement &&
        !isAnswerForMe && <Btn />
    const liveRules = !isMe &&
        stream.haveTicket &&
        (stream.status === streamStatus.live || stream.status === streamStatus.suspended) && <Btn />

    if (announcementRules || liveRules) {
        return (
            <div className="w-full h-10">
                {announcementRules}
                {liveRules}
                <Modal ref={modalRef}>
                    <SendDonate closeModal={closeModal} />
                </Modal>
            </div>
        )
    }
    return null
}

export default memo(SendDonationBtn)
