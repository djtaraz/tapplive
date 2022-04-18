import { memo } from 'react'

import RatingStar from 'components/RatingStar'
import BarSkeleton from 'components/Skeleton/BarSkeleton'

function ProfileSkeleton() {
    return (
        <div className="flex">
            <div className="sq-200 rounded-5 bg-gray-light relative">
                <div className="absolute bottom-0 right-0 bg-gray-standard w-10 h-10 rounded-full"></div>
            </div>

            <div className="flex flex-col ml-6">
                <div className="flex items-center">
                    <div className="font-bold mr-4">
                        <BarSkeleton />
                    </div>

                    <div className="px-3.5 py-2 mr-3.5 rounded-3 font-bold">
                        <BarSkeleton />
                    </div>
                </div>

                <div className="flex mt-3">
                    <div className="mr-6">
                        <BarSkeleton width="120px" bg="bg-gray-standard" />
                    </div>
                    <span>
                        <BarSkeleton width="190px" bg="bg-gray-standard" />
                    </span>
                </div>

                <div className="flex mt-6.5 items-center">
                    {Array(5)
                        .fill(0)
                        .map((percent, index) => (
                            <RatingStar percent={percent} key={index} />
                        ))}

                    <span className="ml-3.5 flex">
                        <BarSkeleton width="80px" />
                        <span className="ml-2">
                            <BarSkeleton width="20px" bg="bg-gray-standard" />
                        </span>
                    </span>
                </div>
                <div className="flex mt-auto">
                    <BarSkeleton width="160px" />
                </div>
            </div>
        </div>
    )
}

export default memo(ProfileSkeleton)
