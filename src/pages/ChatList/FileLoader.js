import React, { memo } from 'react'
import PropTypes from 'prop-types'
import ProgressRing from 'components/ProgressRing'
import { childrenProp } from 'common/propTypes'

const FileLoader = ({ progress, onCancel, isVisible, children }) => {
    return (
        <div className='relative'>
            {children}
            {
                isVisible && (
                    <div className='absolute-center cursor-pointer' onClick={onCancel}>
                        <div
                            className='absolute -z-1 inset-0 opacity-50 bg-black-background rounded-full'></div>
                        <ProgressRing radius={18} stroke={2} progress={progress} />
                    </div>
                )
            }
        </div>
    )
}

FileLoader.propTypes = {
    progress: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired,
    children: childrenProp.isRequired,
}

export default memo(FileLoader)