import { Fragment, memo, useEffect, useState } from 'react'
import { postAuth, getAuth, putAuth } from 'requests/axiosConfig'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { productFields } from '../fields'
import { useLocation } from 'wouter'
import cn from 'classnames'
import { useDispatch } from 'react-redux'
import { nanoid } from 'nanoid'

import { ReactComponent as UploadIcon } from 'assets/svg/upload-violet.svg'
import { ReactComponent as TrashIcon } from 'assets/svg/trash-white.svg'
import Button from 'components/Button'
import ImageCard from './ImageCard'
import { routes } from 'routes'
import { uploadFile } from 'requests/file-requests'
import { setError } from 'slices/rootSlice'

function ProductActions({ params }) {
    const dispatch = useDispatch()
    const [focused, setFocused] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [isButtonActive, setIsButtonActive] = useState(true)

    const { t } = useTranslation()
    const { me } = useSelector((state) => state.root)
    const [location, setLocation] = useLocation()

    const [activeImage, setActiveImage] = useState({})
    const [productData, setProductData] = useState({
        images: [],
        title: '',
        description: '',
        price: '',
    })

    const handleInputChange = (value, key) => {
        if (key === 'price') {
            const pattern = /^\d{0,6}\/*([,.]\d{0,2})?$/

            if (pattern.test(value)) {
                setProductData({ ...productData, price: value })
            }
        } else {
            setProductData({ ...productData, [key]: value })
        }
    }

    const handleFileInputChange = ({ target }) => {
        if (target.files[0]) {
            setProductData({ ...productData, images: [...productData.images, target.files[0]] })
            setActiveImage(target.files[0])
        } else {
            return false
        }
    }

    const handleImageFocus = (image) => (image ? setActiveImage(image) : setActiveImage(productData.images[0]))

    const handleImageDelete = () => {
        const activeImageIndex = productData.images.indexOf(activeImage)
        const minimumUploadLimit = 2

        if (productData.images.length >= minimumUploadLimit) {
            const reducedImages = [...productData.images.filter((i) => i !== activeImage)]
            setProductData({ ...productData, images: reducedImages })
        } else {
            setProductData({ ...productData, images: [] })
        }

        !activeImageIndex ? setActiveImage(productData.images[1]) : setActiveImage(productData.images[0])
    }

    const handleUploadPhotos = async () => {
        let photoIds = []
        let isError = false
        if (isEditMode) {
            productData.images.forEach((i) => photoIds.push(i._id))
        }

        for await (const image of productData.images) {
            if (image.url === undefined) {
                let imageFileData = new FormData()
                imageFileData.append('file', image)

                try {
                    const { _id } = await uploadFile(imageFileData)
                    photoIds.push(_id)
                } catch (error) {
                    if (error?.response.status === 413) {
                        dispatch(setError({ message: t('imageUploadLimitMsg'), error, id: nanoid() }))
                    }
                    isError = true
                }
            }
        }

        return [photoIds, isError]
    }

    const handleCreateProduct = async () => {
        setIsLoading(true)

        const [photoIds, isError] = await handleUploadPhotos()

        if (isError) {
            setIsLoading(false)
            return
        }

        const data = {
            name: productData.title,
            description: productData.description,
            photoIds,
            price: {
                value:
                    typeof productData.price === 'string'
                        ? productData.price.replace(',', '.') * 100
                        : productData.price * 100,
                currency: 'usd',
            },
        }

        if (isEditMode) {
            putAuth(`/users/${me?._id}/products/${params.id}`, data).then(() => setIsLoading(false))
            setLocation(`/product/${me?._id}/${params.id}`)
        } else {
            postAuth(`/users/${me?._id}/products`, data).then(({ data }) => {
                setLocation(`/product/${me?._id}/${data.result._id}`)
            })
        }
    }

    const handleDragActions = (e) => {
        e.stopPropagation()
        e.preventDefault()
    }

    const handleDropAction = (e) => {
        e.stopPropagation()
        e.preventDefault()

        const evt = { target: { files: e.dataTransfer.files } }
        handleFileInputChange(evt)

        return false
    }

    useEffect(() => {
        const condition =
            productData.images.length >= 1 &&
            parseFloat(productData.price) > 0 &&
            productData.price[0] !== 0 &&
            productData.price[productData.price.length - 1] !== ',' &&
            productData.price[productData.price.length - 1] !== '.' &&
            productData.title

        condition ? setIsButtonActive(false) : setIsButtonActive(true)
    }, [productData])

    useEffect(() => {
        if (location.includes('/products/edit')) {
            getAuth(`/users/${me?._id}/products/${params.id}?_fields=${productFields}`)
                .then(({ data }) => {
                    const fetchedProduct = data.result

                    setProductData({
                        images: fetchedProduct?.photos,
                        title: fetchedProduct.name,
                        description: fetchedProduct.description,
                        price: fetchedProduct.price?.value / 100,
                    })

                    setActiveImage(fetchedProduct.photos[0])
                    setIsEditMode(true)
                })
                .catch(() => {
                    setLocation(routes.feed.path)
                })
        }
    }, [location, me?._id, params.id, setLocation])

    return (
        <div
            onKeyDown={({ key }) => {
                if (key === 'Enter') {
                    if (isButtonActive) return false
                    handleCreateProduct()
                }
            }}
            className="flex flex-col w-full py-10"
            style={{ maxWidth: '548px', margin: '0 auto' }}>
            <h1 className="text-xl font-bold mb-10">{isEditMode ? t('editProduct') : t('addProduct')}</h1>

            <section className="mb-12">
                <h2 className="text-lg font-bold mb-2">{t('cover')}</h2>
                <p className="text-s mb-10">
                    <Trans i18nKey="imageUploadTip" />
                </p>

                <input
                    onChange={handleFileInputChange}
                    accept="image/jpeg,image/png"
                    type="file"
                    hidden
                    id="product-upload"
                />

                {productData.images.length === 0 && (
                    <label
                        onDragEnter={handleDragActions}
                        onDragOver={handleDragActions}
                        onDragLeave={handleDragActions}
                        onDrop={handleDropAction}
                        htmlFor="product-upload"
                        className="select-none cursor-pointer overflow-hidden relative w-full border border-dashed border-gray-standard rounded-2.5 flex flex-col items-center justify-center h-340p">
                        <Fragment>
                            <UploadIcon className="mb-5.5" />
                            <p className="text-center font-bold text-m">
                                <Trans i18nKey="imageDropTip" />
                            </p>
                        </Fragment>
                    </label>
                )}

                {productData.images.length !== 0 && (
                    <div className="overflow-hidden relative w-full rounded-2.5 flex flex-col items-center justify-center h-340p">
                        <img
                            src={activeImage.name ? URL.createObjectURL(activeImage) : activeImage.url}
                            alt="product"
                            className="object-cover w-full h-340p"
                        />

                        <div
                            onClick={handleImageDelete}
                            className="cursor-pointer transition-opacity hover:opacity-100 bg-black-theme p-2.5 flex items-center z-50 absolute top-5 right-5 rounded-2.5 opacity-60 justify-center">
                            <TrashIcon />
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-5 mt-3 items-center gap-3">
                    {productData?.images.map((image, i) => (
                        <ImageCard
                            key={i}
                            image={image}
                            isSelected={activeImage === image}
                            onImageFocus={handleImageFocus}
                        />
                    ))}

                    {productData.images.length !== 0 && productData.images.length < 10 && (
                        <label
                            htmlFor="product-upload"
                            style={{ width: '95px', height: '70px' }}
                            className="cursor-pointer border border-dashed border-gray-standard rounded-2.5 flex items-center justify-center">
                            <span className="text-violet-saturated text-xl">+</span>
                        </label>
                    )}
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-lg font-bold mb-2">{t('details')}</h2>

                <input
                    maxLength="30"
                    value={productData.title}
                    onChange={({ target }) => handleInputChange(target.value, 'title')}
                    className="h-12 mb-7.5 w-full bg-gray-pale rounded-2.5 p-5 pl-5 font-semibold text-s transition-all focus:bg-white border border-gray-pale"
                    placeholder={t('title')}
                />

                <textarea
                    maxLength="400"
                    value={productData.description}
                    onChange={({ target }) => handleInputChange(target.value, 'description')}
                    className="customScrollBar h-40 w-full bg-gray-pale rounded-2.5 p-5 pl-5 font-semibold text-s transition-all focus:bg-white border border-gray-pale"
                    placeholder={t('description')}
                />
            </section>

            <section className="mb-20">
                <h2 className="text-lg font-bold mb-2">{t('productPrice')}</h2>
                <div
                    className={cn(
                        'flex w-full items-center h-12 mb-3 rounded-2.5 overflow-hidden transition-all border',
                        focused ? 'bg-white border-gray-pale' : 'bg-gray-pale border-white',
                    )}>
                    <span className="pl-5 font-bold">$</span>
                    <input
                        value={productData.price}
                        onChange={({ target }) => handleInputChange(target.value, 'price')}
                        className="h-12 w-full bg-gray-pale rounded-2.5 p-5 pl-3 font-semibold text-s transition-all focus:bg-white border border-gray-pale border-l-0"
                        placeholder={t('enterPricePlaceholder')}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                    />
                </div>
            </section>

            <section className="flex items-center justify-end">
                <Button type="secondary" fontWeight="bold" onClick={() => window.history.back()} text={t('cancel')} />
                <div className="ml-5">
                    <Button
                        isLoading={isLoading}
                        isDisabled={isButtonActive}
                        fontWeight="bold"
                        onClick={() => handleCreateProduct()}
                        text={isEditMode ? t('save') : t('addProduct')}
                    />
                </div>
            </section>
        </div>
    )
}

export default memo(ProductActions)
