import React, { memo, useState, useEffect } from 'react'
import { Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'wouter'
import { object, string, date, number } from 'yup'
import CoverGrid from '../components/CoverGrid'
import FormGroup from 'components/Formik/FormGroup'
import Loader from 'components/Loader'
import { getStreamOrderForEdit } from 'requests/streamOrder-requests'
import FormikInput from 'components/Formik/FormikInput'
import FormikTextArea from 'components/Formik/FormikTextArea'
import FormikToggle from 'components/Formik/FormikToggle'
import FormikDatePicker from 'components/Formik/FormikDatePicker'
import FormikTimePicker from 'components/Formik/FormikTimePicker'
import FormikNumberInput from 'components/Formik/FormikNumberInput'
import { ReactComponent as DollarIcon } from 'assets/svg/dollar.svg'
import Button from 'components/Button'
import { formatThousands } from 'utils/numberUtils'
import { putAuth } from 'requests/axiosConfig'
import { combineDate, dateFromString } from 'utils/dateUtils'
import TagsSelect from 'containers/TagsSelect'
import UsersSelect from 'containers/UsersSelect'
import { getCoordinatesByPlaceId } from 'requests/getCoordinatesByPlaceId'
import PlacesSelect from 'containers/PlacesSelect'
import { routes } from 'routes'
import { useServerSettings } from 'hooks/useServerSettings'

const transformOrder = (order) => {
    return {
        name: order.name,
        description: order.description || '',
        coverId: order.cover?._id,
        keyTags: order.tags?.map((tag) => ({ label: tag.name, value: tag })) || [],
        isRequired: order.lockedFields?.length > 0,
        isPrivate: order.isPrivate,
        startDate: {
            date: order.startDate ? dateFromString(order.startDate) : null,
            time: order.startDate ? dateFromString(order.startDate) : null,
        },
        price: order.price.value / 100,
        users: order.invitedViewers?.map((user) => ({ label: user.name, value: user })) || [],
        location: order.location
            ? {
                  label: order.location.name,
                  value: order.location.coordinates,
              }
            : null,
    }
}

const StreamOrderEdit = ({ params }) => {
    const [, setLocation] = useLocation()
    const { t } = useTranslation()
    const [streamOrder, setStreamOrder] = useState()

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

    const validationSchema = object().shape({
        name: string().required(),
        coverId: string().required(),
        startDate: object().shape({
            date: date().required(),
            time: date().required(),
        }),

        price: number()
            .transform((_, v) => (typeof v === 'number' ? v : parseFloat(v.replace(/,/g, '.'))))
            .min(getStreamPriceLimit().min, getStreamPriceLimit().minMsg)
            .max(getStreamPriceLimit().max, getStreamPriceLimit().maxMsg)
            .required(),
    })

    useEffect(() => {
        getStreamOrderForEdit({ id: params.id })
            .then((order) => {
                setStreamOrder(order)
            })
            .catch(() => {
                setLocation(routes.feed.path)
            })
    }, [params.id, setLocation])

    useEffect(() => {
        const alertUser = (e) => {
            e.preventDefault()
            e.returnValue = ''
        }
        window.addEventListener('beforeunload', alertUser)
        return () => {
            window.removeEventListener('beforeunload', alertUser)
        }
    }, [])

    const updateStreamOrder = async (values) => {
        const location = values.location?.value
        const updatedOrder = {
            name: values.name,
            description: values.description,
            coverId: values.coverId,
            tagNames: values.keyTags?.map(({ value }) => value.name),
            startDate: combineDate(values.startDate?.date, values.startDate?.time),
            price: {
                value: values.price ? parseFloat(values.price.toString().replace(',', '.')) * 100 : 0,
                currency: 'usd',
            },
            isPrivate: values.isPrivate,
            invitedViewerIds: values.isPrivate ? values.users?.map(({ value }) => value._id) : [],
            lockedFields: values.isRequired ? ['price', 'location', 'isPrivate', 'invitedViewerIds', 'startDate'] : [],
        }

        if (location && !Array.isArray(location)) {
            const coordinates = await getCoordinatesByPlaceId(location.place_id)
            if (coordinates) {
                updatedOrder.location = {
                    name: location.description,
                    coordinates,
                    type: 'Point',
                }
            }
        } else {
            if (values.location) {
                updatedOrder.location = {
                    name: values.location.label,
                    coordinates: values.location.value,
                    type: 'Point',
                }
            }
        }

        await putAuth(`/streamorders/${params.id}`, updatedOrder)
        setLocation(`/stream-orders/${params.id}`)
    }

    if (!streamOrder) {
        return (
            <div className="h-full flex justify-center items-center">
                <Loader theme="violet" />
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full py-10" style={{ maxWidth: '548px', margin: '0 auto' }}>
            <h1 className="text-xl font-bold mb-10">{t('editOrder')}</h1>

            <Formik
                onSubmit={updateStreamOrder}
                initialValues={transformOrder(streamOrder)}
                validationSchema={validationSchema}
                validateOnMount={true}
                validateOnChange={true}>
                {({ values, handleSubmit, errors, isValid, dirty, isSubmitting }) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <FormGroup title={t('cover')}>
                                <div className="text-s mb-7.5">{t('streamOrderForm.chooseCover')}</div>
                                <CoverGrid name="coverId" />
                            </FormGroup>
                            <FormGroup title={t('details')}>
                                <div className="mb-7.5">
                                    <FormikInput name="name" placeholder={t('title')} maxLength={30} />
                                </div>
                                <div className="mb-7.5">
                                    <FormikTextArea name="description" placeholder={t('description')} maxLength={400} />
                                </div>
                                <TagsSelect name="keyTags" maxLength={150} />
                            </FormGroup>
                            <FormGroup title={t('streamOrderForm.conditionsFulfillment')}>
                                <FormikToggle name="isRequired" label={t('required')} />
                                <div className="text-s mt-4.5">{t('streamOrderForm.requiredFields')}</div>
                            </FormGroup>
                            <FormGroup title={t('streamDateAndTime')}>
                                <div className="grid grid-cols-2 gap-5">
                                    <FormikDatePicker minDate={new Date()} name="startDate.date" />
                                    <FormikTimePicker
                                        name="startDate.time"
                                        excludePastTime={values.startDate.date < new Date()}
                                    />
                                </div>
                            </FormGroup>
                            <FormGroup title={t('broadcastPrice')}>
                                <FormikNumberInput
                                    name="price"
                                    validationError={values.price && errors?.price}
                                    icon={DollarIcon}
                                    placeholder={t('enterPricePlaceholder')}
                                />
                            </FormGroup>
                            <FormGroup title={t('location')}>
                                <PlacesSelect name="location" />
                            </FormGroup>
                            <FormGroup title={t('whoCanSeeTheStream')}>
                                <FormikToggle name="isPrivate" label={t('isPrivate')} />
                                {values.isPrivate && (
                                    <div className="mt-7.5">
                                        <UsersSelect name="users" />
                                    </div>
                                )}
                            </FormGroup>

                            <div className="flex justify-end mt-20">
                                <div className="grid grid-flow-col gap-5">
                                    <Button
                                        htmlType="button"
                                        text={t('cancel')}
                                        onClick={() => window.history.back()}
                                        type="secondary"
                                    />
                                    <Button
                                        isLoading={isSubmitting}
                                        text={t('save')}
                                        isDisabled={!(isValid && dirty)}
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

export default memo(StreamOrderEdit)
