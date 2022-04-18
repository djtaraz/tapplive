import React, { memo, useState } from 'react'

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

const Product = ({ product, onClick }) => {
    const [forcePlaceholder, setForcePlaceholder] = useState(false)

    return (
        <div onClick={onClick} key={product._id} className="cursor-pointer relative rounded-2.5 bg-gray-pale">
            {!forcePlaceholder && product.photos[0]?.url ? (
                <img
                    src={cropImage(product.photos[0].url, 320, 200)}
                    width={280}
                    height={208}
                    className="w-full h-52 object-cover rounded-2.5"
                    alt=""
                    onError={() => {
                        setForcePlaceholder(true)
                    }}
                />
            ) : (
                <ProductImagePlaceholder />
            )}
            <div className="absolute inset-0 rounded-2.5 bg-gradient-to-t from-black-background via-transparent opacity-50" />
            <div className="absolute bottom-3 right-3">
                <PriceLabel type="secondary" price={product?.price?.value ?? 0} />
            </div>
            <h2
                title={product.name}
                className="absolute left-0 bottom-3 ml-3 text-ml -tracking-0.5p w-1/2 font-bold text-white line-clamp-3">
                {product.name}
            </h2>
        </div>
    )
}

Product.propTypes = {
    product: PropTypes.shape({
        _id: idProp,
        name: PropTypes.string.isRequired,
        photos: PropTypes.arrayOf(imageProp).isRequired,
        price: priceProp,
    }).isRequired,
    onClick: PropTypes.func,
    userId: PropTypes.string.isRequired,
}

export default memo(Product)
