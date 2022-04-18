import { useEffect, useState, memo, useMemo } from 'react'

import axios from 'axios'
import { get } from 'requests/axiosConfig'

import { tLevel } from './fields'

import { TLeveItemSkeleton } from './Skeleton'
import { array } from 'utils/arrayUtils'

import TLevelItem from './TLevelItem'

const TLevelTab = ({ userId }) => {
    const [levels, setLevels] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        axios.all([get(`/tlevels`), get(`/users/${userId}?_fields=${tLevel}`)]).then(([levels, user]) => {
            const { totalEarned, totalSpent } = user.data.result
            setLevels(levels.data.result.items.slice(1))
            setTotal(totalEarned + totalSpent)
            setIsLoading(false)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const levelsMemo = useMemo(() => {
        let isThresholdPassed = false

        const getPercentage = (threshold) => {
            let value = total - threshold

            if (value > 0) {
                return 100
            } else if (!isThresholdPassed) {
                isThresholdPassed = true

                return (total * 100) / threshold
            } else {
                return 0
            }
        }

        return levels.map((level) => ({ ...level, percentage: getPercentage(level?.threshold) }))
    }, [levels, total])

    return (
        <div className="px-13 mt-7">
            {isLoading === false &&
                levelsMemo.map((level, index) => {
                    return <TLevelItem level={level} total={total} index={index} key={level?._id} />
                })}

            {isLoading && array(6, 1).map((i) => <TLeveItemSkeleton key={i} />)}
        </div>
    )
}

export default memo(TLevelTab)
