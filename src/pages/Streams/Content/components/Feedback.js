import { memo } from 'react'
import { Link } from 'wouter'
import Avatar from 'components/Avatar'
import { ReactComponent as StarFilled } from 'assets/svg/star-lg-filled.svg'
import { ReactComponent as StarStroked } from 'assets/svg/star-lg-stroked.svg'

import { useSelector } from 'react-redux'

const Feedback = ({ body, rating = 0, user }) => {
    const { me } = useSelector((state) => state.root)

    return (
        <div className="flex w-full items-end mb-2.5">
            <div className="mr-2.5">
                <Avatar
                    size="sm"
                    alt="User Avatar"
                    photoUrl={user?.photo?.url}
                    to={me?._id === user?._id ? `/me` : `/user/${user?._id}`}
                    crop="40x40"
                />
            </div>
            <div className="p-5 bg-gray-pale flex w-full flex-col rounded-t-5 rounded-br-5 rounded-bl-2.5 word-break">
                <div className="mb-5">
                    <Link to={me?._id === user?._id ? `/me` : `/user/${user?._id}`}>
                        <span className="text-s cursor-pointer font-bold text-violet-saturated">{user?.name}</span>
                    </Link>
                </div>

                <div className="flex">
                    {new Array(rating / 10).fill(1).map((k, i) => (
                        <StarFilled key={i} className="w-3 h-3 mr-1" />
                    ))}

                    {new Array(5 - rating / 10).fill(0).map((k, i) => (
                        <StarStroked key={i} className="w-3 h-3 mr-1" />
                    ))}
                </div>

                <p className="text-s mt-2 flex-wrap">{body}</p>
            </div>
        </div>
    )
}

export default memo(Feedback)
