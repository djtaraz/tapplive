export function formatCost(num, round) {
    let cost = Math.floor(num) / 100
    cost = round ? Math.floor(cost) : cost

    if (!Number.isInteger(cost)) {
        cost = cost.toFixed(2)
    }

    return formatThousands(cost)
}

export const formatThousands = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const currencyFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

export const leadingZero = (num) => `0${num}`.slice(-2)

export const secondsToTime = (secs) => {
    secs = Math.round(secs)

    let secondsInMinutes = 60

    let divisor_for_minutes = secs % (secondsInMinutes * secondsInMinutes)
    let minutes = Math.floor(divisor_for_minutes / secondsInMinutes)

    let divisor_for_seconds = divisor_for_minutes % secondsInMinutes
    let seconds = Math.ceil(divisor_for_seconds)

    let obj = {
        m: leadingZero(minutes),
        s: leadingZero(seconds),
    }
    return `${obj.m}:${obj.s}`
}

export const destructure = (f) => {
    const whole = Number.parseInt(f)
    const floating = parseFloat(f) % whole

    const maxArrayLength = 5

    const initialArray = Array(maxArrayLength).fill(0)
    const reducedArray = [
        ...Array(whole)
            .fill(1)
            .map(() => 100),
        Number.parseInt(floating * 100),
    ]

    if (parseFloat(f) === 0) {
        return initialArray
    } else if (parseFloat(f) < 1) {
        return [`${f.toString()[2]}0`, 0, 0, 0, 0]
    } else if (parseFloat(f) < maxArrayLength) {
        return [...reducedArray, ...initialArray.slice(0, maxArrayLength - reducedArray.length)]
    } else {
        reducedArray.pop()
        return reducedArray
    }
}

export const toHHMMSS = (sec, forceHours) => {
    const sec_num = parseInt(sec, 10)
    let hours = Math.floor(sec_num / 3600)
    let minutes = Math.floor((sec_num - hours * 3600) / 60)
    let seconds = sec_num - hours * 3600 - minutes * 60
    if (hours < 10 && hours >= 0) {
        hours = `0${hours}`
    }

    if (minutes < 10) {
        minutes = '0' + minutes
    }
    if (seconds < 10) {
        seconds = '0' + seconds
    }
    hours = hours > 0 || forceHours ? hours + ':' : ''
    minutes = minutes + ':'
    seconds = seconds + ''
    var time = hours + minutes + seconds
    return time
}
