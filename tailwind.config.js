const plugin = require('tailwindcss/plugin')
const { screenResolution } = require('./src/common/screenResolutions')

const generateSpacing = ({ limit = 16, keyStep = 0.5, valueStep = 0.125, negate = false }) => {
    const keys = Array(Math.floor(limit / keyStep))
        .fill(0)
        .map((_, i) => keyStep * i + keyStep)
    return keys.reduce((result, val, i) => {
        const k = negate ? -1 : 1
        result[`${k < 0 ? '-' : ''}${val}`] = `${valueStep * (i + 1) * k}rem`
        return result
    }, {})
}

module.exports = {
    purge: ['./src/**/*.js'],
    darkMode: 'class',
    theme: {
        colors: {
            violet: {
                pale: '#E7E4FF',
                saturated: '#5243C2',
                dark: '#4639A6',
            },
            black: {
                theme: '#252526',
                background: '#19191A',
            },
            white: '#fff',
            gray: {
                pale: '#F6F6FC',
                light: '#E7E6F2',
                medium: '#848484',
                standard: '#C3C2CC',
                dark: '#6C6C6C',
            },
            pink: {
                light: '#FA9AD2',
                dark: '#EF4F69',
                alert: '#FF8B8B',
            },
            yellow: '#FFC225',
            green: {
                light: '#43C285',
                default: '#38B0CB',
            },
            blue: '#2072ED',
            overlay: 'rgba(37,37,37, 0.5)',
            button: { disabled: '#F1F1F2', disabledFont: '#AFAFB3' },
            transparent: 'transparent',
        },
        fontSize: {
            xxs: ['10px', { lineHeight: '12px', letterSpacing: 'normal' }],
            xs: ['12px', { lineHeight: '12px', letterSpacing: 'normal' }],
            ms: ['13px', { lineHeight: '16px', letterSpacing: 'normal' }],
            s: ['14px', { lineHeight: '20px', letterSpacing: 'normal' }],
            base: ['16px', { lineHeight: '20px', letterSpacing: 'normal' }],
            m: ['18px', { lineHeight: '24px', letterSpacing: 'normal' }],
            ml: ['20px', { lineHeight: '28px', letterSpacing: 'normal' }],
            lg: ['22px', { lineHeight: '32px', letterSpacing: 'normal' }],
            lg2: ['24px', { lineHeight: '32px', letterSpacing: 'normal' }],
            lg3: ['26px', { lineHeight: '40px', letterSpacing: 'normal' }],
            xl: ['32px', { lineHeight: '40px', letterSpacing: '-0.5px' }],
        },
        screens: {
            sm: `${screenResolution.sm}px`,
            md: `${screenResolution.md}px`,
            lg: `${screenResolution.lg}px`,
            xl: `${screenResolution.xl}px`,
            '2xl': `${screenResolution['2xl']}px`,
            '3xl': `${screenResolution['3xl']}px`,
            '4xl': `${screenResolution['4xl']}px`,
        },
        fontFamily: {
            primary: 'Manrope',
        },
        inset: {
            0: '0px',
            '1px': '1px',
            '-1px': '-1px',
            '1/2': '50%',
            '-1/2': '-50%',
            ...generateSpacing({ limit: 20, negate: true }),
            ...generateSpacing({ limit: 20 }),
        },
        borderRadius: {
            ...generateSpacing({ limit: 20 }),
            full: '9999px',
        },
        extend: {
            spacing: {
                0: '0px',
                '1px': '1px',
                ...generateSpacing({ limit: 20 }),
                '1/2': '50%',
                '1/3': '33.3%',
                '2/3': '66.6%',
                '1/4': '25%',
                '1/5': '20%',
                '2/5': '40%',
                '3/5': '60%',
                '3/4': '75%',
                '2/12': '16.6%',
                0.48: '48%',
                0.45: '45%',
                0.3: '30%',
                0.18: '18%',
                0.17: '17%',
                0.15: '15%',
                0.13: '13%',
                full: '100%',
                '90p': '90px',
                '100p': '100px',
            },
            width: {
                80: '80px',
                90: '90px',
                177: '177px',
                202: '202px',
                '460p': '460px',
                '878p': '878px',
                '846p': '846px',
                '384p': '384px',
                '350p': '350px',
            },
            height: {
                'vw-1/2': '50vw',
                'vw-61': '61vw',
                'vw-45': '45vw',
                'vw-43': '43vw',
                'vw-41': '41vw',
                'vw-39': '39vw',
                'vw-36': '36vw',
                'vw-35': '35vw',
                'vw-31': '31vw',
                'vw-30': '30vw',
                'vw-29': '29vw',
                'vw-27': '27vw',
                'vw-25': '25vw',
                'vw-24': '24vw',
                'vw-22': '22vw',
                'vw-19': '19vw',
                'vw-18': '18vw',
                80: '80px',
                90: '90px',
                '160p': '10rem',
                '488p': '488px',
                '440p': '440px',
                '106p': '106px',
                '134p': '134px',
                '578p': '578px',
                '200p': '200px',
                '140p': '140px',
                '340p': '340px',
            },
            gridTemplateColumns: {
                264: 'repeat(auto-fill, minmax(264px, 1fr))',
                296: 'repeat(auto-fill, minmax(296px, 1fr))',
                'a-264': 'auto 296px',
                'a-321': 'auto 321px',
                header: '1fr auto 1fr',
                header_adaptive: 'auto 1fr',
                'a-1': 'auto 1fr',
                '1-a': '1fr auto',
                a3: 'auto auto auto',
            },
            gridTemplateRows: {
                full: '100%',
                'a-1': 'auto 1fr',
            },
            gridColumnEnd: {
                last: '-1',
            },
            zIndex: {
                '-1': -1,
                ...Array(15)
                    .fill(1)
                    .reduce((result, v, i) => {
                        const value = (i + 6) * 10 // 6 because tailwind already have zIndexes from 0 to 50
                        result[value] = value
                        return result
                    }, {}),
            },
            inset: {
                '1p': '1px',
                '-3p': '-3px',
                full: '100%',
            },
            minHeight: {
                ...generateSpacing({ limit: 20 }),
                '2/3': '66%',
                'vw-61': '61vw',
                'vw-45': '45vw',
                'vw-43': '43vw',
                'vw-41': '41vw',
                'vw-39': '39vw',
                'vw-36': '36vw',
                'vw-35': '35vw',
                'vw-31': '31vw',
                'vw-30': '30vw',
                'vw-29': '29vw',
                'vw-27': '27vw',
                'vw-25': '25vw',
                'vw-24': '24vw',
                'vw-22': '22vw',
                'vw-19': '19vw',
                'vw-18': '18vw',
                '488p': '488px',
            },
            maxWidth: {
                '1/2': '50%',
                '1/3': '33%',
                '1/4': '25%',
                '3/4': '75%',
                '1/5': '20%',
                '4/5': '80%',
                full: '100%',
                '548p': '548px',
                '80p': '80px',
                '370p': '370px',
                96: '384px',
            },
            minWidth: {
                ...generateSpacing({ limit: 20 }),
                '264p': '264px',
                '460p': '460px',
            },
            maxHeight: {
                '148p': '9.25rem',
                '160p': '10rem',
                360: '360px',
                450: '450px',
                '140p': '140px',
            },
            keyframes: {
                appear: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
            },
            animation: {
                'spin-5': 'spin 5s linear infinite',
                appear: 'appear 0.8s linear',
            },
            boxShadow: {
                primary: '0px 0px 0px 2px #5243C2',
                100: '0px -6px 10px rgba(0, 0, 0, 0.1)',
            },
            flex: {
                2: '2 2 0%',
                3: '3 3 0%',
            },
            letterSpacing: {
                0.01: '0.01em',
                '-0.01': '-0.01em',
                '-0.5p': '-0.5px',
                '-0.2p': '-0.2px',
            },
            margin: {
                '100p': '100px',
                '140p': '140px',
                '360p': '360px',
            },
            backgroundSize: {
                '40p': '40px 40px',
            },
        },
    },
    variants: {
        margin: ['first', 'last', 'responsive'],
        padding: ['first', 'last', 'responsive'],
        cursor: ['hover'],
        translate: ['group-hover'],
    },
    plugins: [
        plugin(function ({ addUtilities }) {
            const newUtilities = {
                '.absolute-center-y': {
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                },
                '.absolute-center-x': {
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                },
                '.absolute-center': {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                },
                'inset-0': {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                },
            }
            addUtilities(newUtilities)
        }),
        require('@tailwindcss/line-clamp'),
    ],
}
