import { Link } from 'wouter'
import Avatar from 'components/Avatar'
import { ReactComponent as StarIcon } from 'assets/svg/review-star.svg'

const Review = ({ body, rating, user }) => {
    return (
        <div className="flex items-end mb-2.5">
            <div className="mr-2.5">
                <Avatar
                    size="sm"
                    alt="User Avatar"
                    to={`/user/${user?._id}`}
                    photoUrl={user?.photo?.url}
                    crop="40x40"
                />
            </div>
            <div className="p-5 bg-gray-pale flex w-64 flex-col rounded-t-5 rounded-br-5 rounded-bl-2.5 word-break">
                <p className="text-base flex-wrap">{body}</p>

                <div className="flex mt-3 items-center">
                    <StarIcon />
                    <span className="text-ms font-semibold ml-1.5">{(rating / 10).toString()[0]}</span>
                    <Link to={`/user/${user?._id}`}>
                        <span className="text-ms cursor-pointer font-semibold ml-2.5 text-gray-standard">
                            {user?.name}
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Review
