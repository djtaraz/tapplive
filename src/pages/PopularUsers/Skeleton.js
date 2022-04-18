import React, { memo } from 'react';
import SkeletonWrapper from "../../components/Skeleton/SkeletonWrapper";
import CircleSkeleton from "../../components/Skeleton/CircleSkeleton";
import BarSkeleton from "../../components/Skeleton/BarSkeleton";

const Skeleton = () => {
    return (
        <SkeletonWrapper bg="bg-gray-pale">
            <div className="flex items-center">
                <div className="mr-3.5">
                    <CircleSkeleton bg="bg-gray-light" radius={60} />
                </div>
                <div className="flex-1">
                    <div className="mb-2">
                        <BarSkeleton bg="bg-gray-light" width={'70%'} />
                    </div>
                    <BarSkeleton bg="bg-gray-light" width={'30%'} />
                </div>
                <div>
                    <BarSkeleton width={138} height={32} />
                </div>
            </div>
        </SkeletonWrapper>
    )
}

Skeleton.defaultProps = {};
Skeleton.propTypes = {};

export default memo(Skeleton);