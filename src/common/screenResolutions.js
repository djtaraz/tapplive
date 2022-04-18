const screenResolution = {
    sm: 768,
    md: 1024,
    lg: 1200,
    xl: 1440,
    '2xl': 1600,
    '3xl': 1920,
    '4xl': 2500,
}

const screens = Object.keys(screenResolution).reduce((result, screen, i) => {
    result[screen] = i + 1
    return result
}, {})

module.exports = {
    screenResolution,
    screens,
}
