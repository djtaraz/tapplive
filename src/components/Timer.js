import React, { useEffect, useState, memo } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'

var _second = 1000
var _minute = _second * 60
var _hour = _minute * 60
var _day = _hour * 24

const leadingZero = (num) => (`${num}`.length < 3 ? `0${num}`.slice(-2) : num)

function Timer({ date, fontSize, fontWeight, onTick, format = 'hh:mm' }) {
    const [hours, setHours] = useState('--')
    const [minutes, setMinutes] = useState('--')
    const [seconds, setSeconds] = useState('--')

    const classes = cn(`text-${fontSize}`, fontWeight && `font-${fontWeight} ${format === 'hh:mm:ss' ? 'w-17' : ''}`)

    useEffect(() => {
        function showRemaining() {
            var now = new Date()
            var distance = Math.abs(date - now)

            setHours(
                date > now
                    ? Math.floor((distance % _day) / _hour)
                    : Math.floor(distance / _day) * 24 + Math.floor((distance % _day) / _hour),
            )
            setMinutes(Math.floor((distance % _hour) / _minute))
            setSeconds(Math.floor((distance % _minute) / _second))

            if (onTick) {
                onTick()
            }
        }

        const interval = setInterval(showRemaining, 1000)
        showRemaining()

        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [date, onTick])

    const display = (hours, minutes, seconds, format) => {
        let result = []
        if (format.includes('hh')) {
            result.push(leadingZero(hours))
        }
        if (format.includes('mm')) {
            result.push(leadingZero(minutes))
        }
        if (format.includes('ss')) {
            result.push(leadingZero(seconds))
        }
        return result.join(':')
    }

    return <div className={classes}>{display(hours, minutes, seconds, format)}</div>
}

Timer.propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    fontSize: PropTypes.string,
    fontWeight: PropTypes.string,
    onTick: PropTypes.func,
}

Timer.defaultProps = {
    fontSize: 'xs',
}

export default memo(Timer)
