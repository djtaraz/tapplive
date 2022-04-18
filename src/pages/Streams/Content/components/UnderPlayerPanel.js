import { useStream } from 'pages/Streams/StreamContext'
import { memo, useLayoutEffect, useRef, useState } from 'react'
import StreamControls from './StreamControls'
import { formatCost } from 'utils/numberUtils'
import { statusWithBalance } from 'common/entities/stream'
import { useTranslation } from 'react-i18next'
import Modal from 'components/Modal'
import UsersListModal from '../modals/UsersListModal'
import BalanceModal from 'pages/Streams/Sidebar/Goals/components/BalanceModal'
import { FinishStream } from '../modals/streamer'
import StreamHeading from './StreamHeading'

const UnderPlayerPanel = () => {
    const { state, isMe } = useStream()
    const { stream } = state
    const { t } = useTranslation()
    const headingRef = useRef()
    const textRef = useRef()
    const [resizeWidth, setWidth] = useState()
    const modalRef = useRef()
    const balanceModalRef = useRef()
    const finishModalRef = useRef()

    const openModal = () => {
        modalRef.current.open()
    }
    const openBalance = () => {
        if (isMe) {
            statusWithBalance.includes(stream.status) ? balanceModalRef.current.open() : finishModalRef.current.open()
        }
    }

    const closeModal = () => {
        modalRef.current.close()
    }

    useLayoutEffect(() => {
        const node = headingRef.current
        const getWidth = () => {
            const width = headingRef.current.clientWidth
            const textWidth = textRef.current.clientWidth
            if (width < textWidth) {
                setWidth(window.innerWidth)
            }

            if (window.innerWidth > resizeWidth) {
                setWidth(undefined)
            }
        }

        window.addEventListener('resize', getWidth)
        const ro = new ResizeObserver(() => {
            headingRef.current !== null && getWidth()
        })
        ro.observe(node)
        return () => {
            ro.unobserve(node)

            window.removeEventListener('resize', getWidth)
        }
    }, [resizeWidth])
    return (
        <div
            className="flex flex-col md:flex-row justify-between mt-5"
            style={{ flexDirection: resizeWidth ? 'column' : undefined }}>
            <div ref={headingRef} className="flex overflow-hidden">
                <StreamHeading ref={textRef} />
            </div>
            <div className="flex flex-col md:items-end flex-shrink-0">
                <div className="text-s tracking-0.01 my-3 md:mt-0">
                    <span className="mr-5 cursor-pointer" onClick={() => openModal()}>
                        {t('streamSubscribers')}: <b>{stream.subscriberCount || 0}</b>
                    </span>
                    <span className={isMe ? 'cursor-pointer' : ''} onClick={openBalance}>
                        {t('collected')}: <b>${formatCost(stream.totalEarned || 0)}</b>
                    </span>
                </div>
                <div className="w-full flex flex-col sm:flex whitespace-nowrap md:mt-0">
                    <StreamControls />
                </div>
            </div>
            <Modal size={'sm'} ref={modalRef}>
                <UsersListModal streamId={stream._id} handleClose={closeModal} />
            </Modal>
            <Modal ref={balanceModalRef}>
                <BalanceModal />
            </Modal>
            <Modal ref={finishModalRef}>
                <FinishStream onClose={() => finishModalRef.current.close()} initialStep={2} />
            </Modal>
        </div>
    )
}

export default memo(UnderPlayerPanel)
