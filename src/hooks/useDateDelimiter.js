import { isWithinInterval } from 'date-fns'
import { getFullDayRange } from '../utils/dateUtils'

export const useDateDelimiter = () => {
    let dateThreshold

    const isDelimited = (date) => {
        let shouldRender = true

        if (dateThreshold && isWithinInterval(date, dateThreshold)) {
            shouldRender = false
        } else {
            dateThreshold = getFullDayRange(date)
        }

        return shouldRender
    }

    return { isDelimited }
}