import { memo } from 'react'
import PropTypes from 'prop-types'
import Lottie from 'react-lottie'

import loaderWhite from '../assets/lottie/loader-white.json'
import loaderViolet from '../assets/lottie/loader-violet.json'

const Loader = ({ width, height, theme }) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: theme === 'white' ? loaderWhite : loaderViolet,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    }

    return <Lottie options={defaultOptions} height={height || 32} width={width || 32} />
}

Loader.defaultProps = {
    width: 32,
    height: 32,

    theme: 'white',
}

Loader.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,

    theme: PropTypes.string,
}

export default memo(Loader)
