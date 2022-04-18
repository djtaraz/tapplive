import { useTranslation } from 'react-i18next'
import { isToday, isTomorrow } from 'date-fns'
import { isDayAfterTomorrow } from '../utils/dateUtils'

export const useOccurranceDate = () => {
    const { t } = useTranslation()

    const format = (date) => {
        if(isToday(date)) {
            const intl = new Intl.DateTimeFormat(navigator.language, {
                hour: '2-digit',
                minute: '2-digit'
            })
            return `${t('today')} ${t('at')} ${intl.format(date)}`
        } else if (isTomorrow(date)) {
            const intl = new Intl.DateTimeFormat(navigator.language, {
                hour: '2-digit',
                minute: '2-digit'
            })
            return `${t('tomorrow')} ${t('at')} ${intl.format(date)}`
        } else if (isDayAfterTomorrow(date)) {
            const intl = new Intl.DateTimeFormat(navigator.language, {
                hour: '2-digit',
                minute: '2-digit'
            })
            return `${t('afterTomorrow')} ${t('at')} ${intl.format(date)}`
        } else {
            const intl = new Intl.DateTimeFormat(navigator.language, {
                day: '2-digit',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
            })
            return intl.format(date)
        }
    }

    return format
}