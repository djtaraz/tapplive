import React, { memo } from 'react'
import { Link } from 'wouter'

const DescriptionLink = ({ link, text }) => {
    return (
        link ? (
            <Link to={link}>
                <a className='justify-self-start text-gray-standard text-s hover:underline truncate' title={text}>{text}</a>
            </Link>
        ) : <div className='text-gray-standard text-s truncate' title={text || 'Unknown'}>{text || 'Unknown'}</div>
    )
}

export default memo(DescriptionLink)