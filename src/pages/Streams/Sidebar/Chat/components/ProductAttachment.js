import React, { memo, useRef } from 'react'

import { ReactComponent as ProductIcon } from 'assets/svg/attach.svg'
import MyProductsModal from 'containers/MyProductsModal'
import Modal from 'components/Modal'
import { postAuth } from 'requests/axiosConfig'

const ProductAttachment = ({ streamId }) => {
    const modalRef = useRef()

    const openModal = () => modalRef.current.open()
    const closeModal = () => modalRef.current.close()

    const handleProductSending = async (productId) => {
        await postAuth(`/streams/${streamId}/chat/messages`, { productId })
    }

    return (
        <div className='text-gray-standard self-end'>
            <ProductIcon onClick={openModal} className='cursor-pointer stroke-current' />

            <Modal size='md' ref={modalRef}>
                <MyProductsModal onSubmit={handleProductSending} closeModal={closeModal} />
            </Modal>
        </div>
    )
}

export default memo(ProductAttachment)