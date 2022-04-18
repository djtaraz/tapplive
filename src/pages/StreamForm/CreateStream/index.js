import React, { memo, useState, useEffect, useMemo } from 'react'
import { Formik } from 'formik'
import { useLocation } from 'wouter'
import { useTranslation } from 'react-i18next'
import { nanoid } from 'nanoid'
import { object, string, date, number, lazy } from 'yup'
import FormGroup from 'components/Formik/FormGroup'
import { ReactComponent as DollarIcon } from 'assets/svg/dollar.svg'
import FormikNumberInput from 'components/Formik/FormikNumberInput'
import FormikDatePicker from 'components/Formik/FormikDatePicker'
import FormikTimePicker from 'components/Formik/FormikTimePicker'
import FormikToggle from 'components/Formik/FormikToggle'
import FormikInput from 'components/Formik/FormikInput'
import FormikTextArea from 'components/Formik/FormikTextArea'
import Button from 'components/Button'
import ImgDropArea from '../components/ImgDropArea'
import FormikToggleMenu from 'components/Formik/FormikToggleMenu'
import UsersSelect from 'containers/UsersSelect'
import TagsSelect from 'containers/TagsSelect'
import { get, postAuth } from 'requests/axiosConfig'
import { getLocationParam } from 'utils/browserUtils'
import PlacesSelect from 'containers/PlacesSelect'
import { getCoordinatesByPlaceId } from 'requests/getCoordinatesByPlaceId'
import Loader from 'components/Loader'
import { formatCost, formatThousands } from 'utils/numberUtils'
import { combineDate } from 'utils/dateUtils'
import { uploadFile } from 'requests/file-requests'
import { setError } from '../../../slices/rootSlice'
import { useDispatch } from 'react-redux'
import { useServerSettings } from 'hooks/useServerSettings'

const CreateStream = () => {
    const { t } = useTranslation()
    const orderId = getLocationParam('orderId')
    const [, setLocation] = useLocation()
    const [order, setOrder] = useState()
    const [initialValues, setInitialValues] = useState({})
    const dispatch = useDispatch()

    const { streamMinPrice, streamMaxPrice } = useServerSettings()

    const getStreamPriceLimit = () => {
        const min = streamMinPrice / 100
        const minMsg = t('minStreamPrice') + ` $${formatThousands(min)}`

        const max = streamMaxPrice / 100
        const maxMsg = t('maxStreamPrice') + ` $${formatThousands(max)}`

        return {
            min,
            max,
            minMsg,
            maxMsg,
        }
    }

    const getValidationSchema = () => {
        return lazy((values) => {
            return object().shape({
                name: string().required(),
                startDate: object().when('planPeriod', {
                    is: 'later',
                    then: object().shape({
                        date: date().required(),
                        time: date().required(),
                    }),
                    otherwise: object().shape({
                        date: date(),
                        time: date(),
                    }),
                }),
                cover: values.planPeriod === 'later' ? string().required() : string(),

                price: number()
                    .transform((_, v) => (typeof v === 'number' ? v : parseFloat(v.replace(/,/g, '.'))))
                    .min(getStreamPriceLimit().min, getStreamPriceLimit().minMsg)
                    .max(getStreamPriceLimit().max, getStreamPriceLimit().maxMsg)
                    .required(),
            })
        })
    }

    useEffect(() => {
        if (orderId) {
            get(`/streamorders/${orderId}?_fields=lockedFields,startDate,location,price,invitedViewers(name)`).then(
                ({ data }) => {
                    const streamOrder = data.result
                    setOrder(streamOrder)

                    setInitialValues((prevValues) => {
                        const values = {
                            ...prevValues,
                            lockedFields: streamOrder.lockedFields,
                            orderId,
                        }

                        if (streamOrder.lockedFields?.length) {
                            streamOrder.lockedFields.includes('isPrivate') && streamOrder?.invitedViewers?.length > 0
                                ? (values.isPrivate = true)
                                : (values.isPrivate = false)

                            if (streamOrder.lockedFields.includes('price')) {
                                values.price = formatCost(streamOrder.price.value)
                            }
                            if (streamOrder.lockedFields.includes('location')) {
                                values.location = {
                                    label: streamOrder?.location?.name,
                                    value: streamOrder?.location?.coordinates,
                                }
                            }
                            if (streamOrder.lockedFields.includes('startDate')) {
                                values.startDate = {
                                    date: streamOrder.startDate ? new Date(streamOrder.startDate) : null,
                                    time: streamOrder.startDate ? new Date(streamOrder.startDate) : null,
                                }
                            }
                            if (streamOrder.lockedFields.includes('invitedViewerIds')) {
                                values.users = streamOrder.invitedViewers?.map((user) => ({
                                    label: user.name,
                                    value: user,
                                }))
                            }
                        }

                        return values
                    })
                },
            )
        } else {
            setInitialValues({})
        }
    }, [orderId])

    const toggleMenuItems = useMemo(
        () => [
            { name: t('now'), value: 'now' },
            { name: t('later'), value: 'later' },
        ],
        [t],
    )

    const handleStreamCreate = async (values) => {
        const location = values.location?.value

        const stream = {
            name: values.name,
            description: values.description,
            tagNames: values.keyTags?.map(({ value }) => value.name),
            price: {
                value: values.price ? values.price * 100 : 0,
                currency: 'usd',
            },
            invitedViewerIds: values.isPrivate ? values.users?.map(({ value }) => value._id) : [],
            isPrivate: values.isPrivate,
            streamOrderId: values.orderId,
        }

        if (values.planPeriod === 'later') {
            if (values.cover) {
                const formData = new FormData()
                formData.append('file', values.cover)

                try {
                    const { _id } = await uploadFile(formData)
                    stream.coverId = _id
                } catch (error) {
                    if (error?.response.status === 413) {
                        dispatch(setError({ message: t('imageUploadLimitMsg'), error, id: nanoid() }))
                    }
                    return
                }
            }
            stream.startDate = combineDate(values.startDate?.date, values.startDate?.time)
        }

        if (location && !Array.isArray(location)) {
            const coordinates = await getCoordinatesByPlaceId(location.place_id)
            stream.location = {
                name: location.description,
                coordinates,
            }
        } else {
            if (values.location) {
                stream.location = {
                    name: values.location.label,
                    coordinates: values.location.value,
                }
            }
        }

        const { data } = await postAuth('/streams', stream)

        if (values.orderId) {
            setLocation(`/stream-orders/${values.orderId}`)
        } else {
            setLocation(`/streams/${data.result._id}`)
        }
    }

    if (initialValues.orderId && !order) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader theme="violet" />
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full py-10" style={{ maxWidth: '548px', margin: '0 auto' }}>
            <h1 className="text-xl font-bold mb-10">{orderId ? t('replyToOrder') : t('createStream')}</h1>
            <Formik
                onSubmit={handleStreamCreate}
                initialValues={initialValues}
                validateOnChange={true}
                validateOnBlur={false}
                validateOnMount={true}
                enableReinitialize={true}
                validationSchema={getValidationSchema}>
                {({ values, handleSubmit, isSubmitting, isValid, errors }) => {
                    return values.planPeriod === 'later' ? (
                        <form onSubmit={handleSubmit}>
                            {!orderId && (
                                <FormGroup title={t('streamForm.planBroadcast')}>
                                    <FormikToggleMenu name="planPeriod" items={toggleMenuItems} showLoading={false} />
                                </FormGroup>
                            )}
                            <FormGroup title={t('cover')}>
                                <div className="text-s mb-5">{t('imageUploadTip')}</div>
                                <ImgDropArea name="cover" />
                            </FormGroup>
                            <FormGroup title={t('details')}>
                                <div className="mb-7.5">
                                    <FormikInput name="name" placeholder={t('title')} maxLength={30} />
                                </div>
                                <div className="mb-7.5">
                                    <FormikTextArea name="description" placeholder={t('description')} maxLength={400} />
                                </div>
                                <div className="mb-7.5">
                                    <TagsSelect name="keyTags" maxLength={150} />
                                </div>
                            </FormGroup>
                            {values?.lockedFields?.length !== 0 && orderId && (
                                <h2 className="font-bold text-lg mb-12">{t('requiredConditions')}:</h2>
                            )}
                            <FormGroup title={t('streamDateAndTime')}>
                                <div className="grid grid-cols-2 gap-5">
                                    <FormikDatePicker
                                        isDisabled={values.lockedFields?.includes('startDate')}
                                        name="startDate.date"
                                        minDate={new Date()}
                                    />
                                    <FormikTimePicker
                                        isDisabled={values.lockedFields?.includes('startDate')}
                                        excludePastTime={values?.startDate?.date < new Date()}
                                        name="startDate.time"
                                    />
                                </div>
                            </FormGroup>
                            <FormGroup title={t('streamPrice')}>
                                <FormikNumberInput
                                    name="price"
                                    icon={DollarIcon}
                                    validationError={values.price && errors?.price}
                                    placeholder={t('enterPricePlaceholder')}
                                    isDisabled={values.lockedFields?.includes('price')}
                                />
                            </FormGroup>
                            <FormGroup title={t('location')}>
                                <PlacesSelect isDisabled={values.lockedFields?.includes('location')} name="location" />
                            </FormGroup>
                            <FormGroup title={t('whoCanSeeTheStream')}>
                                <FormikToggle
                                    isDisabled={values.lockedFields?.includes('isPrivate')}
                                    name="isPrivate"
                                    label={t('isPrivate')}
                                />
                                {values.isPrivate && (
                                    <div className="mt-7.5">
                                        <UsersSelect
                                            isEditable={!values.lockedFields?.includes('invitedViewerIds')}
                                            name="users"
                                        />
                                    </div>
                                )}
                            </FormGroup>

                            <div className="flex justify-end mt-20">
                                <div className="grid grid-flow-col gap-5">
                                    <Button
                                        htmlType="button"
                                        onClick={() => window.history.back()}
                                        text={t('cancel')}
                                        type="secondary"
                                    />
                                    <Button
                                        isLoading={isSubmitting}
                                        text={orderId ? t('createAnswer') : t('createStream')}
                                        isDisabled={!isValid}
                                        type="primary"
                                    />
                                </div>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <FormGroup title={t('streamForm.planBroadcast')}>
                                <FormikToggleMenu
                                    name="planPeriod"
                                    items={orderId ? [{ name: t('later'), value: 'later' }] : toggleMenuItems}
                                    showLoading={true}
                                />
                            </FormGroup>

                            <FormGroup title={t('details')}>
                                <div className="mb-7.5">
                                    <FormikInput name="name" placeholder={t('title')} maxLength={30} />
                                </div>
                                <div className="mb-7.5">
                                    <FormikTextArea name="description" placeholder={t('description')} maxLength={400} />
                                </div>
                                <div className="mb-7.5">
                                    <TagsSelect name="keyTags" maxLength={150} />
                                </div>
                            </FormGroup>
                            <FormGroup title={t('streamPrice')}>
                                <FormikNumberInput
                                    name="price"
                                    validationError={values.price && errors?.price}
                                    icon={DollarIcon}
                                    placeholder={t('enterPricePlaceholder')}
                                    isDisabled={values.lockedFields?.includes('price')}
                                />
                            </FormGroup>
                            <FormGroup title={t('location')}>
                                <PlacesSelect isDisabled={values.lockedFields?.includes('location')} name="location" />
                            </FormGroup>
                            <FormGroup title={t('whoCanSeeTheStream')}>
                                <FormikToggle
                                    isDisabled={values.lockedFields?.includes('isPrivate')}
                                    name="isPrivate"
                                    label={t('isPrivate')}
                                />
                                {values.isPrivate && (
                                    <div className="mt-7.5">
                                        <UsersSelect
                                            isEditable={!values.lockedFields?.includes('invitedViewerIds')}
                                            name="users"
                                        />
                                    </div>
                                )}
                            </FormGroup>

                            <div className="flex justify-end mt-20">
                                <div className="grid grid-flow-col gap-5">
                                    <Button
                                        htmlType="button"
                                        onClick={() => window.history.back()}
                                        text={t('cancel')}
                                        type="secondary"
                                    />
                                    <Button
                                        isLoading={isSubmitting}
                                        text={t('createStream')}
                                        isDisabled={!isValid}
                                        type="primary"
                                    />
                                </div>
                            </div>
                        </form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default memo(CreateStream)
