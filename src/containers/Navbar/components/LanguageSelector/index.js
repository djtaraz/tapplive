import Modal from 'components/Modal'
import LanguageModal from 'pages/EditProfile/modals/LanguageModal'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

export const LanguageSelector = () => {
    const { i18n } = useTranslation()
    const modalRef = useRef(null)
    const handleModalOpen = () => {
        modalRef.current.open()
    }

    const handleModalClose = () => {
        modalRef.current.close()
    }
    return (
        <>
            <span onClick={handleModalOpen} className="text-s font-semibold text-violet-saturated cursor-pointer">
                {i18n.language.toUpperCase()}
            </span>
            <Modal ref={modalRef}>
                <LanguageModal onClose={handleModalClose} />
            </Modal>
        </>
    )
}
