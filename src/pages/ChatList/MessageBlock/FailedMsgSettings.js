import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as ExclamationIcon } from 'assets/svg/exclamation-outlined.svg'
import Popper from 'components/Popper'

const settingsContainerStyle = {
    right: 'calc(100% + 8px)',
}
const settingsItemCn = 'py-1.5 px-6 cursor-pointer hover:bg-gray-pale whitespace-nowrap'
const settingsContainerCn = 'cursor-pointer absolute top-1/2 transform -translate-y-2/3'
const FailedMsgSettings = ({ items }) => {
    const [referenceElement, setReferenceElement] = useState(null)

    const handleMenuClick = (event) => {
        event.stopPropagation()
        referenceElement && referenceElement.focus()
    }

    return (
        <div
            style={settingsContainerStyle}
            ref={setReferenceElement}
            className={settingsContainerCn}
            onClick={handleMenuClick}>
            <ExclamationIcon className="text-pink-dark" />

            <Popper referenceElement={referenceElement}>
                {items.map((item) => (
                    <div key={item.title} onClick={item.onClick} className={settingsItemCn}>
                        {item.title}
                    </div>
                ))}
            </Popper>
        </div>
    )
}

FailedMsgSettings.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
        }),
    ),
}

export default memo(FailedMsgSettings)
