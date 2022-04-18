import React, { memo } from 'react';
import SkeletonBar from "./BarSkeleton";
import CircleSkeleton from "./CircleSkeleton";
import {ReactComponent as LogoIcon} from "../../assets/svg/logo.svg";

function NavbarSkeleton() {
    return (
        <div className='grid grid-cols-3 items-center p-5 border-b border-gray-light'>
            <div className="flex items-center">
                <div className='py-2.5 px-3 w-10 h-10 bg-violet-saturated rounded-2'>
                    <LogoIcon />
                </div>
                {/*<ul className='flex ml-8'>*/}
                {/*    <li className='ml-10.5 first:ml-0'><SkeletonBar /></li>*/}
                {/*    <li className='ml-10.5 first:ml-0'><SkeletonBar /></li>*/}
                {/*</ul>*/}
            </div>
            <div className='justify-self-center'>
                <SkeletonBar bg='bg-gray-pale' height={40} width={216} />
            </div>
            <div className='flex justify-self-end'>
                {
                    Array(4).fill(1).map((_, i) => (
                        <div key={`circle-${i}`} className='ml-3 first:ml-0'>
                            <CircleSkeleton />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default memo(NavbarSkeleton);