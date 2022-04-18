import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { ReactComponent as CheckIcon } from 'assets/svg/check.svg'
import { formatCost } from 'utils/numberUtils'

const TLevelItem = ({ level, index, total }) => {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col mb-10">
            <div className="flex items-center">
                <div
                    className="w-5 h-5 rounded-2 flex items-center justify-center"
                    style={{
                        background: `linear-gradient(180deg, ${(level?.misc?.frameColors.length
                            ? level?.misc?.frameColors
                            : ['#fff', '#fff']
                        ).join(',')})`,
                    }}>
                    <div className="bg-white w-3.5 h-3.5 rounded-1.5"></div>
                </div>

                <span
                    className={cn(
                        'ml-3 font-semibold text-base',
                        level?.percentage ? 'text-black' : 'text-gray-standard',
                    )}>
                    {index + 1} {t('level')}
                </span>

                <span className={cn('text-s ml-1', level?.percentage ? 'text-black' : 'text-gray-standard')}>
                    {level?.percentage === 100
                        ? `$${formatCost(level?.threshold)}`
                        : level?.percentage === 0
                        ? `$0`
                        : `$${formatCost(total)}`}
                </span>
            </div>

            <div className="flex mt-3 items-center">
                <div className="w-full bg-gray-pale rounded-full flex-1 h-3 overflow-hidden">
                    <div
                        style={{
                            width: `${level?.percentage}%`,
                        }}
                        className="bg-violet-saturated h-3 rounded-full"></div>
                </div>

                <div
                    className={cn(
                        'text-s w-20 flex items-center justify-end',
                        level?.percentage ? 'text-black' : 'text-gray-standard',
                    )}>
                    {total >= level?.threshold ? <CheckIcon className="ml-6" /> : `$${formatCost(level?.threshold)}`}
                </div>
            </div>
        </div>
    )
}

export default memo(TLevelItem)
