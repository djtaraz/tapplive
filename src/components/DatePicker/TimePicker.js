import React, { memo, forwardRef } from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import Input from '../Input'
import { ReactComponent as ClockIcon } from 'assets/svg/clock.svg'
import { useTranslation } from 'react-i18next'

function replaceInvalidInput(val) {
    val = val.replace(/^[^0-2]/, '')
    val = val.replace(/^(\d{2}:\d[0-9])./, '$1')
    val = val.replace(/^(\d{2}[:h])[^0-5]/, '$1')
    val = val.replace(/^(2[0-3])[^:h]/, '$1')
    val = val.replace(/^([01][0-9])[^:h]/, '$1')
    val = val.replace(/^([2-9])[4-9]/, '$1')

    return val
}

const CustomPicker = forwardRef(({ onBlur, onChange, ...props }, ref) => {
    const { t } = useTranslation()
    const handleBlur = (event) => {
        const value = event.target
        const pattern = /^(([01][0-9]|2[0-3])h)|(([01][0-9]|2[0-3]):[0-5][0-9])$/
        event.target.value = pattern.test(value) ? value : ''
    }

    const handleChange = (event) => {
        let { value } = event.target
        value = value.replace(/[^\dh:]/, '')
        if (value.length === 3) {
            value = `${value.slice(0, 2)}:${value.slice(-1)}`
        }
        event.target.value = replaceInvalidInput(value)
        onChange(event)
    }

    return (
        <Input
            {...props}
            onBlur={handleBlur}
            onChange={handleChange}
            value={props.value}
            placeholder={t('enterTime')}
            icon={ClockIcon}
            ref={ref}
        />
    )
})

const TimePicker = ({ time, onChange, isDisabled, excludePastTime = false }) => {
    const id = `timePicker-${Math.random()}`

    const filterPastTime = (date, dateToFilter) => {
        const target = new Date()
        target.setMinutes(date.getMinutes())
        target.setHours(date.getHours())

        return target > dateToFilter
    }
    return (
        <div id={id} className="relative">
            <DatePicker
                popperClassName="time-picker-popper"
                selected={time}
                onChange={onChange}
                customInput={<CustomPicker />}
                showPopperArrow={false}
                timeIntervals={15}
                portalId={id}
                timeCaption={null}
                timeFormat="HH:mm"
                dateFormat="HH:mm"
                showTimeSelect={true}
                showTimeSelectOnly={true}
                disabled={isDisabled}
                filterTime={(date) => (excludePastTime ? filterPastTime(date, new Date()) : true)}
            />
        </div>
    )
}
TimePicker.propTypes = {
    time: PropTypes.instanceOf(Date).isRequired,
    onChange: PropTypes.func.isRequired,
    excludePastTime: PropTypes.bool,
}

export default memo(TimePicker)
