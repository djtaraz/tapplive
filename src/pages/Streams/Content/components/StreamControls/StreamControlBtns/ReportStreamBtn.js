import React, { memo, useRef } from 'react'

import Modal from 'components/Modal'
import ReportStream from '../../../modals/user/ReportStream'
import { ReactComponent as ControlBarReport } from 'assets/svg/control-bar-report.svg'

const ReportStreamBtn = () => {
    const modalRef = useRef()
    const openModal = () => modalRef.current.open()
    const closeModal = () => modalRef.current.close()
    return (
        <div>
            <ControlBarReport onClick={openModal} className="mr-5 cursor-pointer" />

            <Modal ref={modalRef}>
                <ReportStream closeModal={closeModal} />
            </Modal>
        </div>
    )
}

export default memo(ReportStreamBtn)
