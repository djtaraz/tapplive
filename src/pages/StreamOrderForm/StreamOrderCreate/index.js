import React, { memo, useEffect } from 'react'
import { Formik } from 'formik'
import { useLocation } from 'wouter'
import { useTranslation } from 'react-i18next'
import FormikInput from 'components/Formik/FormikInput'
import FormikTextArea from 'components/Formik/FormikTextArea'
import FormikToggle from 'components/Formik/FormikToggle'
import { ReactComponent as DollarIcon } from 'assets/svg/dollar.svg'
import Button from 'components/Button'
import CoverGrid from '../components/CoverGrid'
import FormGroup from 'components/Formik/FormGroup'
import FormikNumberInput from 'components/Formik/FormikNumberInput'
import { object, string, date, number } from 'yup'
import { postAuth } from 'requests/axiosConfig'
import FormikDatePicker from 'components/Formik/FormikDatePicker'
import FormikTimePicker from 'components/Formik/FormikTimePicker'
import { combineDate } from 'utils/dateUtils'
import { formatThousands } from 'utils/numberUtils'
import TagsSelect from 'containers/TagsSelect'
import UsersSelect from 'containers/UsersSelect'
import PlacesSelect from 'containers/PlacesSelect'
import { getCoordinatesByPlaceId } from 'requests/getCoordinatesByPlaceId'
import { useServerSettings } from 'hooks/useServerSettings'

const StreamOrderCreate = () => {
    const [, setLocation] = useLocation()
    const { t } = useTranslation()

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
            .transform((_, v) => typeof v === 'number' ? v : parseFloat(v.replace(/,/g, '.')))
            .min(getStreamPriceLimit().min, getStreamPriceLimit().minMsg)
            .max(getStreamPriceLimit().max, getStreamPriceLimit().maxMsg)
            .required(),
    })

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

    const createStreamOrder = async (values) => {
        const location = values.location?.value

        const newOrder = {
            name: values.name,
            description: values.description,
            coverId: values.coverId,
            tagNames: values.keyTags?.map(({ value }) => value.name),
            startDate: combineDate(values.startDate?.date, values.startDate?.time),
            price: {
                value: values.price ? values.price * 100 : 0,
                currency: 'usd',
            },
            isPrivate: values.isPrivate,
            invitedViewerIds: values.isPrivate ? values.users?.map(({ value }) => value._id) : [],
            lockedFields: values.isRequired ? ['price', 'location', 'isPrivate', 'invitedViewerIds', 'startDate'] : [],
            location: values.location?.value,
        }

        if (location) {
            const coordinates = await getCoordinatesByPlaceId(location.place_id)
            newOrder.location = {
                name: location.description,
                coordinates,
            }
        }

        const { data } = await postAuth('/streamorders', newOrder)
        setLocation(`/stream-orders/${data.result._id}`)
    }

    return (
        <div className="flex flex-col w-full py-10" style={{ maxWidth: '548px', margin: '0 auto' }}>
            <h1 className="text-xl font-bold mb-10">{t('createStreamOrder')}</h1>

            <Formik
                onSubmit={createStreamOrder}
                initialValues={{}}
                validationSchema={validationSchema}
                validateOnMount={true}
                validateOnChange={true}>
                {({ values, handleSubmit, isValid, errors, isSubmitting }) => (
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
                                    excludePastTime={values?.startDate?.date < new Date()}
                                    name="startDate.time"
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
                                    text={t('createOrder')}
                                    isDisabled={!isValid}
                                    type="primary"
                                />
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    )
}

export default memo(StreamOrderCreate)
