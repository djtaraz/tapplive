import { useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { ReactComponent as ChevronLeft } from 'assets/svg/chevron-left-white.svg'
import { ReactComponent as ChevronRight } from 'assets/svg/chevron-right-white.svg'
import ProductEmptyImg2x from 'assets/img/product-empty@2x.png'
import { imageProp } from 'common/propTypes'

const Slider = ({ images, height, isLoaded }) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    const handleImageSlide = (direction) => {
        direction === 'next' ? setActiveImageIndex(activeImageIndex + 1) : setActiveImageIndex(activeImageIndex - 1)
    }

    return (
        <section
            className="bg-black-theme bg-center bg-no-repeat select-none relative w-full mb-5.5 rounded-2.5 overflow-hidden"
            style={{
                height: height ? height : '340px',
                background: `#E7E6F2 url(${ProductEmptyImg2x}) no-repeat`,
                backgroundPosition: 'center',
            }}>
            {images &&
                images.map((image, index) => (
                    <img
                        src={image.url}
                        key={index}
                        alt="slider-img"
                        className={cn(
                            'w-full h-full absolute rounded-2.5 object-cover transition-all duration-500 opacity-1',
                            index !== activeImageIndex && `opacity-0 invisible`,
                        )}
                    />
                ))}

            {isLoaded && activeImageIndex > 0 && (
                <div
                    className="absolute opacity-80 cursor-pointer inset-y-1/2  flex items-center justify-center left-3.5 px-3.5 py-4.5 rounded-2.5 bg-black-theme text-white"
                    style={{ transform: 'translateY(-50%)' }}
                    onClick={() => handleImageSlide('prev')}>
                    <ChevronLeft />
                </div>
            )}

            {isLoaded && activeImageIndex !== images?.length - 1 && (
                <div
                    className="absolute opacity-80 cursor-pointer inset-y-1/2  flex items-center justify-center right-3.5 px-3.5 py-4.5 rounded-2.5 bg-black-theme text-white"
                    style={{ transform: 'translateY(-50%)' }}
                    onClick={() => handleImageSlide('next')}>
                    <ChevronRight />
                </div>
            )}
        </section>
    )
}

Slider.propTypes = {
    images: PropTypes.arrayOf(imageProp).isRequired,
    height: PropTypes.string,
    isLoaded: PropTypes.bool,
}

export default Slider
