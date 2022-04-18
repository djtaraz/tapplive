import Placeholder1 from 'assets/svg/tp1.svg'
import Placeholder2 from 'assets/svg/tp2.svg'

const getRandomPlaceholderNumber = id => {
    if(!id) {
        return
    }
    return id.split('').filter(v => !Number.isNaN(Number(v))).reduce((r, v) => r + Number(v), 0) % 4
}

export const getRandomPlaceholder = (id) => {
    const n = getRandomPlaceholderNumber(id)
    return [
        { img: Placeholder2, color: '#FFB2DF' },
        { img: Placeholder2, color: '#FFFCB2' },
        { img: Placeholder1, color: '#B2E5FF' },
        { img: Placeholder1, color: '#B8B2FF' },
    ][n] || { img: Placeholder2, color: '#FFB2DF' }
}