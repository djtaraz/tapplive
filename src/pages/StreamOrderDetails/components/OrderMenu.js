import React, { memo, useContext, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'wouter'

import Button from 'components/Button'
import CloseOrderModal from './CloseOrderModal'
import Modal from 'components/Modal'
import { StreamOrderDetailsContext } from '../index'

const AuthorMenu = () => {
    const { isClosed, setIsClosed, streamOrderId } = useContext(StreamOrderDetailsContext)
    const { t } = useTranslation()
    const [, setLocation] = useLocation()
    const closeOrderModalRef = useRef()

    const openModal = () => {
        closeOrderModalRef.current.open()
    }

    const closeModal = () => {
        closeOrderModalRef.current.close()
    }

    const handleOrderClose = () => {
        setIsClosed(true)
    }

    const handleEdit = () => {
        setLocation(`/stream-orders/edit/${streamOrderId}`)
    }

    return (
        <div className="flex">
            <Button isDisabled={isClosed} type="primary" text={t('edit')} onClick={handleEdit} />
            <div className="ml-5">
                <Button
                    onClick={openModal}
                    type="secondary"
                    isDisabled={isClosed}
                    text={isClosed ? t('streamOrderDetails.orderClosed') : t('streamOrderDetails.closeOrder')}
                />
            </div>

            <Modal ref={closeOrderModalRef}>
                <CloseOrderModal streamOrderId={streamOrderId} onOrderClose={handleOrderClose} onClose={closeModal} />
            </Modal>
        </div>
    )
}

const VisitorMenu = () => {
    const { streamOrder, streamOrderId } = useContext(StreamOrderDetailsContext)
    const { t } = useTranslation()
    const [, setLocation] = useLocation()

    return (
        <div className="flex">
            <Button
                isDisabled={streamOrder.alreadyResponded}
                type="primary"
                text={
                    streamOrder.alreadyResponded
                        ? t('streamOrderDetails.alreadyResponded')
                        : t('streamOrderDetails.sendAnswer')
                }
                onClick={() => setLocation(`/streams/create?orderId=${streamOrderId}`)}
            />
        </div>
    )
}

const OrderMenu = () => {
    const { amIAuthor } = useContext(StreamOrderDetailsContext)

    return amIAuthor ? <AuthorMenu /> : <VisitorMenu />
}

export default memo(OrderMenu)
