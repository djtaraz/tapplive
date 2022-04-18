import { endOfDay, startOfDay, isTomorrow, setDate, set, isAfter, format } from 'date-fns'
import { enUS, ru } from 'date-fns/locale'

const formatOptions = {
    locale: navigator.language.slice(0, 2) === 'ru' ? ru : enUS,
}

const msIn24Hours = 86400000
const msIn1Hour = 3600000
export const lessThan1HourFromNow = (date) => date.getTime() - Date.now() <= msIn1Hour

export const lessThan24HoursFromNow = (date) => date.getTime() - Date.now() <= msIn24Hours

export const isExpired = (date) => isAfter(new Date(), date)

export const getFullDateFormat = (date) => {
    const isCurrentYear = new Date().getFullYear() === date.getFullYear()
    const options = {
        month: 'long',
        day: '2-digit',
        ...(isCurrentYear ? {} : { year: 'numeric' }),
    }
    const intl = new Intl.DateTimeFormat(navigator.language, options)
    return intl.format(date)
}

export const formatDate = (date, options) => {
    const intl = new Intl.DateTimeFormat(navigator.language, options)
    return intl.format(date)
}

export const localTimeFormat = (date) => {
    return format(date, 'p', formatOptions)
}

export const isDayAfterTomorrow = (date) => isTomorrow(setDate(date, date.getDate() - 1))

export const combineDate = (date, time) => {
    if (!date && !time) {
        return null
    } else if (date && !time) {
        return date
    } else if (time && !date) {
        return time
    } else {
        return set(time, {
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate(),
        })
    }
}

export const getFullDayRange = (date) => ({ start: startOfDay(date), end: endOfDay(date) })

export const dateFromString = (date) => {
    return new Date((typeof date === 'string' ? date : date.toISOString()).replace('-0000', 'Z'))
}

export const getFormattedDuration = (start, end) => {
    const difference = end.getTime() - start.getTime()
    return new Date(difference).toISOString().substr(11, 8)
}
