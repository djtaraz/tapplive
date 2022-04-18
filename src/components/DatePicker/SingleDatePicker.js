import React, { forwardRef, memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import DatePicker, { registerLocale } from 'react-datepicker'
import { format } from 'date-fns'
import ru from 'date-fns/locale/ru'

import 'react-datepicker/dist/react-datepicker.css'
import Input from '../Input'
import { ReactComponent as DatePickerIcon } from 'assets/svg/date-picker.svg'
import { ReactComponent as ChevronLeftIcon } from 'assets/svg/chevron-left.svg'
import { dateFromString, formatDate } from '../../utils/dateUtils'
import { useTranslation } from 'react-i18next'

registerLocale('ru', ru)
const CustomPicker = forwardRef(({ value, onClick, disabled }, ref) => {
    const { t } = useTranslation()
    const lang = navigator.language.slice(0, 2)

    return (
        <Input
            value={
                value ? format(dateFromString(value), 'EEEE, d LLL', lang === 'ru' ? { locale: ru } : undefined) : ''
            }
            placeholder={t('enterDate')}
            icon={DatePickerIcon}
            ref={ref}
            onFocus={onClick}
            disabled={disabled}
        />
    )
})

const SingleDatePicker = ({ date, onChange, isDisabled, minDate }) => {
    const renderCustomHeader = useCallback(({ date, decreaseMonth, increaseMonth } = {}) => {
        return (
            <div className="flex items-center justify-between pt-6.5 pb-4 pl-7.5 pr-5">
                <div className="text-lg font-bold">{formatDate(date, { month: 'long', day: '2-digit' })}</div>

                <div className="flex grid grid-flow-col gap-2">
                    <button
                        onClick={decreaseMonth}
                        className="py-3 px-3.5 border border-transparent hover:border-violet-saturated rounded-2.5 text-violet-saturated focus:outline-none">
                        <ChevronLeftIcon className="h-2.5 w-1.5 stroke-current" />
                    </button>
                    <button
                        onClick={increaseMonth}
                        className="py-3 px-3.5 border border-transparent hover:border-violet-saturated rounded-2.5 text-violet-saturated focus:outline-none">
                        <ChevronLeftIcon className="h-2.5 w-1.5 stroke-current transform rotate-180" />
                    </button>
                </div>
            </div>
        )
    }, [])

    return (
        <DatePicker
            selected={date}
            onChange={onChange}
            customInput={<CustomPicker />}
            showPopperArrow={false}
            portalId="modal-portal"
            renderCustomHeader={renderCustomHeader}
            locale={navigator.language.slice(0, 2)}
            disabled={isDisabled}
            minDate={minDate}
        />
    )
}
SingleDatePicker.propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    onChange: PropTypes.func.isRequired,
    minDate: PropTypes.instanceOf(Date),
}

export default memo(SingleDatePicker)
