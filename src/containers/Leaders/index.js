import React, { useEffect, memo, useState, useMemo } from 'react'
import { get } from 'requests/axiosConfig'
import { Link } from 'wouter'

import fields from './fields'
import FlashImg from 'assets/img/flash.png'
import FlashImg2x from 'assets/img/flash@2x.png'
import FlashImg3x from 'assets/img/flash@3x.png'
import LeaderFrame from './LeaderFrame'
import { formatCost } from 'utils/numberUtils'
import { useTranslation } from 'react-i18next'
import Skeleton from './Skeleton'
import Avatar from '../../components/Avatar'
import AuthLink from 'components/AuthLink'

function Leaders() {
    const [leaders, setLeaders] = useState()
    const { t } = useTranslation()
    const LoadingSkeleton = useMemo(() => <Skeleton />, [])

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const { data } = await get(`/leaders?_fields=${fields}&period=all&limit=3`)
    //         setLeaders(data.result.items)
    //     }
    //     fetchData()
    // }, [])

    const leadersTest = [
        {
            _id: '625c71c065aa45843e00286a',
            user: {
                _id: '6075da5389789ccc395d1870',
                photo: {
                    _id: '60892f587acfae7eb27e25e0',
                    url: 'https://api.tapplive.dev.cuberto.com:443/files/60892f587acfae7eb27e25e0',
                },
                tLevel: {
                    _id: 2,
                    misc: {
                        frameColors: ['#B2B2B2', '#E8E8E8'],
                        icon: 'none',
                    },
                },
                name: 'rakhimovkamran',
            },
            totalSpentAndEarned: 87052,
        },
        {
            _id: '625c71c065aa45843e00286a',
            user: {
                _id: '6075da5389789ccc395d1870',
                photo: {
                    _id: '60892f587acfae7eb27e25e0',
                    url: 'https://api.tapplive.dev.cuberto.com:443/files/60892f587acfae7eb27e25e0',
                },
                tLevel: {
                    _id: 1,
                    misc: {
                        frameColors: ['#CEB297', '#FBEDE2'],
                        icon: 'none',
                    },
                },

                name: 'rakhimovkamran',
            },
            totalSpentAndEarned: 87052,
        },
        {
            _id: '625c71c065aa45843e00286a',
            user: {
                _id: '6075da5389789ccc395d1870',
                photo: {
                    _id: '60892f587acfae7eb27e25e0',
                    url: 'https://api.tapplive.dev.cuberto.com:443/files/60892f587acfae7eb27e25e0',
                },
                tLevel: {
                    _id: 0,
                    misc: {
                        frameColors: ['#F6F6FC', '#F6F6FC'],
                        icon: 'none',
                    },
                },
                name: 'rakhimovkamran',
            },
            totalSpentAndEarned: 87052,
        },
    ]
    useEffect(() => {
        setLeaders(leadersTest)
    }, [])

    // properties: {
    //     _id: {
    //         type: 'objectId',
    //         default: ObjectId,
    //     },

    //     userId: {
    //         type: 'objectId',
    //         trim: true,
    //     },

    //     period: {
    //         type: 'string',
    //         enum: leaderPeriods,
    //     },

    //     table: {
    //         type: 'string',
    //         enum: leaderTables,
    //     },

    //     position: {
    //         type: 'number',
    //         default: 0,
    //     },

    //     totalSpentAndEarned: {
    //         type: 'number',
    //         default: 0,
    //     },
    // },

    return (
        <div>
            {leaders ? (
                <>
                    <div className="relative flex justify-between items-center bg-violet-pale rounded-3 pl-3 pr-5 py-3.5 lg:py-2.5 lg:pl-2.5 2xl:py-3.5 2xl:pl-3">
                        <div className="flex items-center justify-center bg-white rounded-3 w-90 h-90 lg:h-80 lg:w-80 2xl:h-90 2xl:w-90">
                            <img src={FlashImg} srcSet={`${FlashImg2x} 2x, ${FlashImg3x} 3x`} alt="" />
                        </div>
                        <Link className="text-base font-semibold text-violet-saturated" to="/leaders">
                            {t('seeAll')}
                        </Link>
                    </div>
                    <ul>
                        {leaders.map((leader, i) => (
                            <li
                                key={leader.user._id}
                                className="flex items-center py-2 mt-1 pl-3 rounded-2.5 pr-5 transition-colors duration-200 hover:bg-gray-pale">
                                <AuthLink to={`/user/${leader.user._id}`} className="w-full">
                                    <a className="flex items-center w-full">
                                        <LeaderFrame
                                            icon={leader.user.tLevel?.misc.icon}
                                            colors={leader.user.tLevel?.misc.frameColors}>
                                            <Avatar photoUrl={leader.user.photo?.url} crop="40x40" />
                                        </LeaderFrame>
                                        <div className="flex-1 text-s ml-5 pr-4 truncate">
                                            {i + 1}.{' '}
                                            <span to={`/user/${leader.user._id}`} className="text-violet-saturated">
                                                {leader.user.name}
                                            </span>
                                        </div>
                                        <div className="text-s font-bold">
                                            ${formatCost(leader.totalSpentAndEarned, true)}
                                        </div>
                                    </a>
                                </AuthLink>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                LoadingSkeleton
            )}
        </div>
    )
}

export default memo(Leaders)
