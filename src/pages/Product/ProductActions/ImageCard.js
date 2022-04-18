import { memo, useState, useEffect } from 'react'
import cn from 'classnames'

const ImageCard = ({ image, onImageFocus, isSelected }) => {
    const [isFocused, setIsFocused] = useState(isSelected)

    const handleImageFocus = (image) => {
        setIsFocused(true)
        onImageFocus(image)
    }

    useEffect(() => setIsFocused(isSelected), [isSelected])

    return (
        <button
            className={cn(
                'cursor-pointer transition-all outline-none focus:outline-none border-2 rounded-2.5 flex items-center justify-center overflow-hidden',
                isFocused ? `border-violet-saturated` : 'border-white',
            )}
            style={{ width: '101px', height: '74px' }}
            onClick={() => handleImageFocus(image)}>
            <img
                src={image?.url ? image?.url : URL.createObjectURL(image)}
                alt="product"
                style={{ width: '93px', height: '70px' }}
                className={cn('object-cover w-20 rounded-2.5 transition-all', isFocused && 'py-1 px-0.5')}
            />
        </button>
    )
}

export default memo(ImageCard)
