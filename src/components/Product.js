import React, { memo } from 'react'
import cn from 'classnames'

import PropTypes from 'prop-types'
import { idProp, imageProp, priceProp } from '../common/propTypes'
import PriceLabel from './PriceLabel'
import BarSkeleton from './Skeleton/BarSkeleton'
import ProductEmptyImg from 'assets/img/product-empty.png'
import ProductEmptyImg2x from 'assets/img/product-empty@2x.png'
import ProductEmptyImg3x from 'assets/img/product-empty@3x.png'
import { cropImage } from '../utils/cropImage'

const ProductImagePlaceholder = () => {
    return (
        <div className="absolute inset-0 rounded-2.5 bg-gray-light flex items-center justify-center">
            <img src={ProductEmptyImg} srcSet={`${ProductEmptyImg2x} 2x, ${ProductEmptyImg3x} 3x`} alt="" />
        </div>
    )
}

export const ProductSkeleton = () => {
    return (
        <div>
            <div className="relative mb-3 p-0.5">
                <div className="pb-2/3"></div>
                <ProductImagePlaceholder />
            </div>
            <BarSkeleton bg="bg-gray-pale" width="80%" height={16} />
        </div>
    )
}

const Product = ({ product, onClick, isSelected }) => {
    const figureCn = cn('col-span-full relative rounded-2.5 bg-gray-pale', {
        'shadow-primary': isSelected,
        'curson-pointer': !!onClick,
    })
    return (
        <div onClick={onClick} key={product._id} className="grid grid-cols-a-1 gap-y-3">
            <div className={figureCn}>
                <div className="pb-2/3"></div>
                {product.photos[0]?.url ? (
                    <img
                        src={cropImage(product.photos[0].url, 320, 200)}
                        className="absolute inset-0 w-full h-full object-cover p-0.5 rounded-2.5"
                        alt=""
                    />
                ) : (
                    <ProductImagePlaceholder />
                )}
                <div className="absolute bottom-3 right-3">
                    <PriceLabel type="secondary" price={product?.price?.value ?? 0} />
                </div>
            </div>
            <div title={product.name} className="text-s font-bold truncate">
                {product.name}
            </div>
        </div>
    )
}

Product.defaultProps = {
    isSelected: false,
}
Product.propTypes = {
    product: PropTypes.shape({
        _id: idProp,
        name: PropTypes.string.isRequired,
        photos: PropTypes.arrayOf(imageProp).isRequired,
        price: priceProp,
    }).isRequired,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func,
    userId: PropTypes.string.isRequired,
}

export default memo(Product)
