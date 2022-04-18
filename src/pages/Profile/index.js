import React, { memo } from 'react'

import ProfileContent from './ProfileContent'
import ProfileInfo from './ProfileInfo'
import { ProfileContext } from './ProfileContext'
import { useSelector } from 'react-redux'

function Profile({ params }) {
    const { me } = useSelector(state => state.root)
    const isMe = me?._id === params.id
    return (
        <ProfileContext.Provider value={{ userId: params.id, isMe }}>
            <div className='py-10'>
                <ProfileInfo />

                <div className='mt-14.5'>
                    <ProfileContent />
                </div>
            </div>
        </ProfileContext.Provider>
    )
}

export default memo(Profile)
