import React from 'react'
import PropTypes from 'prop-types'
import { childrenProp } from '../../common/propTypes'
import { ReactComponent as CrownIcon } from '../../assets/svg/crown.svg'

function LeaderFrame({ icon, colors, isBordered, children }) {
    return (
        <div className="relative flex z-50 rounded-full">
            {icon === 'crown' && (
                <div className="absolute z-30 -right-1 -bottom-1 flex items-center justify-center rounded-full w-5 h-5 border border-gray-light bg-white">
                    <CrownIcon />
                </div>
            )}
            <div
                className="absolute -inset-3p rounded-full -z-1"
                style={{
                    background: `linear-gradient(180deg, ${(colors?.length ? colors : ['transparent', '']).join(',')})`,
                }}></div>
            {isBordered && (
                <div
                    style={{
                        transform: 'scale(1.1)',
                    }}
                    className="absolute -inset-3p rounded-full -z-1 border-2 border-violet-saturated"></div>
            )}
            {children}
        </div>
    )
}

LeaderFrame.defaultTypes = {}
LeaderFrame.propTypes = {
    icon: PropTypes.oneOf(['none', 'crown']).isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    children: childrenProp.isRequired,
    isBordered: PropTypes.bool,
}

export default LeaderFrame
