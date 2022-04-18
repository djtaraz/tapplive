import React, { memo } from 'react'
import PropTypes from 'prop-types'
import AuthLink from 'components/AuthLink'
import cn from 'classnames'

import AvatarPlaceholderImg from 'assets/img/avatar-palceholder.png'

import { ReactComponent as UserIcon } from 'assets/svg/user.svg'
import { cropImage } from '../utils/cropImage'

function AvatarPlaceholder({ size }) {
    const classes = cn('flex justify-center items-center bg-gray-pale text-gray-light rounded-full', {
        'min-w-10 w-10 h-10': size === 'sm',
        'min-w-15 w-15 h-15': size === 'm',
        'min-w-20 w-20 h-20': size === 'lg',
    })

    return (
        <div className={classes}>
            <UserIcon className="w-1/2" />
        </div>
    )
}

AvatarPlaceholder.propTypes = {
    to: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'm', 'lg']),
}

function Avatar({ to, photoUrl, alt = ' ', size, crop, isOnline }) {
    const classes = cn('relative inline-flex', {
        'min-w-8 w-8 h-8': size === 'xs',
        'min-w-10 w-10 h-10': size === 'sm',
        'min-w-15 w-15 h-15': size === 'm',
        'min-w-20 w-20 h-20': size === 'lg',
    })

    const Content = photoUrl ? (
        <div
            style={{
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundImage: 'url(' + AvatarPlaceholderImg + ')',
            }}
            className="rounded-full overflow-hidden w-full h-full">
            <img
                onError={(event) => {
                    event.currentTarget.classList.add('hidden')
                }}
                className="w-full h-full object-cover rounded-full"
                src={crop ? cropImage(photoUrl, ...crop.split('x')) : photoUrl}
                alt={alt}
            />
        </div>
    ) : (
        <AvatarPlaceholder to={to} size={size} />
    )

    const Container = to ? (
        <AuthLink to={to} className="h-15">
            <a className={classes}>
                {Content}
                {isOnline && (
                    <div className="w-2.5 h-2.5 border-2 box-content border-white bg-green-light absolute right-0.5 bottom-0.5 rounded-full"></div>
                )}
            </a>
        </AuthLink>
    ) : (
        <div className={classes}>{Content}</div>
    )

    return Container
}

Avatar.defaultProps = {
    alt: '',
    size: 'sm',
    isOnline: false,
}
Avatar.propTypes = {
    to: PropTypes.string,
    photoUrl: PropTypes.string,
    alt: PropTypes.string,
    size: PropTypes.oneOf(['xs', 'sm', 'm', 'lg']),
    isOnline: PropTypes.bool,
}

export default memo(Avatar)
