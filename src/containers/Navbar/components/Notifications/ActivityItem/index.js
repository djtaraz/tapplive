import React, { memo } from 'react'
import { format } from 'date-fns'
import { Link } from 'wouter'

const ActivityItem = ({ link, Cover, Description, name, createDate, onClick }) => {
    const handleActivityClick = () => {
        if (onClick) {
            onClick()
        }
    }

    return link ? (
        <Link to={link}>
            <a className="flex items-center px-5 py-2 hover:bg-gray-pale cursor-pointer">
                <div className="flex mr-3.5">{Cover}</div>
                <div className="flex-grow grid gap-1 pr-5 overflow-hidden">
                    <div className="text-s font-bold truncate">{name}</div>
                    {Description}
                </div>
                <div className="text-s font-bold">{format(createDate, 'HH:mm')}</div>
            </a>
        </Link>
    ) : (
        <div onClick={handleActivityClick} className="flex items-center px-5 py-2 hover:bg-gray-pale cursor-pointer">
            <div className="flex mr-3.5">{Cover}</div>
            <div className="flex-grow grid gap-1 pr-5 overflow-hidden">
                <div className="text-s font-bold truncate">{name}</div>
                {Description}
            </div>
            <div className="text-s font-bold">{format(createDate, 'HH:mm')}</div>
        </div>
    )
}

export default memo(ActivityItem)
