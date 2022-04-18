import React, { memo, useEffect } from 'react'
import { Formik } from 'formik'
import { isAfter, addMinutes } from 'date-fns'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'wouter'
import { useDispatch, useSelector } from 'react-redux'
import { nanoid } from 'nanoid'
import { object, number, string, date, mixed } from 'yup'
import FormGroup from 'components/Formik/FormGroup'
import ImgDropArea from '../components/ImgDropArea'
import FormikInput from 'components/Formik/FormikInput'
import FormikTextArea from 'components/Formik/FormikTextArea'
import TagsSelect from 'containers/TagsSelect'
import PlacesSelect from 'containers/PlacesSelect'
import FormikToggle from 'components/Formik/FormikToggle'
import UsersSelect from 'containers/UsersSelect'
import FormikDatePicker from 'components/Formik/FormikDatePicker'
import FormikTimePicker from 'components/Formik/FormikTimePicker'
import FormikNumberInput from 'components/Formik/FormikNumberInput'
import { ReactComponent as DollarIcon } from 'assets/svg/dollar.svg'
import Button from 'components/Button'
import { getStreamDetails } from 'requests/stream-requests'
import Loader from 'components/Loader'
import { formatThousands } from 'utils/numberUtils'
import { streamDetailsFields } from 'requests/fields/stream-fields'
import { putAuth } from 'requests/axiosConfig'
import { combineDate, dateFromString } from 'utils/dateUtils'
import { getCoordinatesByPlaceId } from 'requests/getCoordinatesByPlaceId'
import { routes } from 'routes'
import { setError } from 'slices/rootSlice'
import { streamStatus } from 'common/entities/stream'
import { useServerSettings } from 'hooks/useServerSettings'
import { uploadFile } from 'requests/file-requests'

const transformStream = (stream) => {
    return {
        name: stream.name,
        description: stream.description,
        cover: stream.cover,
        coverId: stream.cover?._id,
        keyTags: stream.tags?.map((tag) => ({ label: tag.name, value: tag })) || [],
        isPrivate: stream.isPrivate,
        startDate: {
            date: stream.startDate ? dateFromString(stream.startDate) : null,
            time: stream.startDate ? dateFromString(stream.startDate) : null,
        },
        price: (stream.price.value / 100).toString(),
        users: stream.invitedViewers?.map((user) => ({ label: user.name, value: user })) || [],
        location: stream.location
            ? {
                  label: stream.location.name,
                  value: stream.location.coordinates,
              }
            : null,
    }
}
const UpdateStream = ({ params }) => {
    const backUrl = routes.stream.path.replace(':id', params.id)
    const dispatch = useDispatch()
    const { me } = useSelector((state) => state.root)
    const { t } = useTranslation()
    const { editTimeout, streamMinPrice, streamMaxPrice } = useServerSettings()

    const [, setLocation] = useLocation()

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

    const getValidationSchema = () =>
        object().shape({
            name: string().required(),
            startDate: object().shape({
                date: date().required(),
                time: date().required(),
            }),
            cover: mixed().required(),

            price: number()
                .transform((_, v) => (typeof v === 'number' ? v : parseFloat(v.replace(/,/g, '.'))))
                .min(getStreamPriceLimit().min, getStreamPriceLimit().minMsg)
                .max(getStreamPriceLimit().max, getStreamPriceLimit().maxMsg)
                .required(),
        })

    const { data: stream, isLoading } = useQuery(
        ['getStreamById', params.id],
        async ({ queryKey }) => {
            const [, streamId] = queryKey
            return await getStreamDetails({ streamId, fields: `${streamDetailsFields},invitedViewers(name)` })
        },
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 0,
            onError: () => {
                setLocation(routes.feed.path)
            },
            retry: 1,
        },
    )

    useEffect(() => {
        if (stream) {
            try {
                if (stream.streamer._id !== me?._id) {
                    throw new Error(t('streamForm.notOwnerMsg'))
                } else if (![streamStatus.announcement, streamStatus.pending].includes(stream.status)) {
                    throw new Error(t('streamForm.onlyAnnouncementMsg'))
                } else if (isAfter(new Date(), addMinutes(new Date(stream.startDate), -editTimeout))) {
                    throw new Error(t('streamForm.editTimeoutMsg'))
                }
            } catch (error) {
                setLocation(backUrl)
                dispatch(setError({ error }))
            }
        }
    }, [stream, me, backUrl, editTimeout, setLocation, dispatch, t])

    const handleStreamUpdate = async (values) => {
        const location = values.location?.value

        const stream = {
            name: values.name,
            description: values.description,
            tagNames: values.keyTags?.map(({ value }) => value.name),
            price: {
                value: values.price ? parseFloat(values.price.replace(',', '.')) * 100 : 0,
                currency: 'usd',
            },
            invitedViewerIds: values.isPrivate ? values.users?.map(({ value }) => value._id) : [],
            isPrivate: values.isPrivate,
            streamOrderId: values.orderId,
            startDate: combineDate(values.startDate?.date, values.startDate?.time),
        }

        if (values.cover && !values.cover?.url) {
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

        await putAuth(`/streams/${params.id}`, stream)
        setLocation(backUrl)
    }

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader theme="violet" />
            </div>
        )
    }
    return (
        <div className="flex flex-col w-full py-10" style={{ maxWidth: '548px', margin: '0 auto' }}>
            <h1 className="text-xl font-bold mb-10">
                {stream.status === streamStatus.pending ? t('editAnswerStream') : t('editStream')}
            </h1>

            <Formik
                onSubmit={handleStreamUpdate}
                initialValues={transformStream(stream)}
                validateOnChange={true}
                validateOnBlur={false}
                validateOnMount={true}
                validationSchema={getValidationSchema}
                enableReinitialize={true}>
                {({ values, handleSubmit, isSubmitting, errors, isValid, dirty }) => {
                    return (
                        <form onSubmit={handleSubmit}>
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
                            <FormGroup title={t('streamDateAndTime')}>
                                <div className="grid grid-cols-2 gap-5">
                                    <FormikDatePicker
                                        isDisabled={values.lockedFields?.includes('startDate')}
                                        minDate={new Date()}
                                        name="startDate.date"
                                    />
                                    <FormikTimePicker
                                        isDisabled={values.lockedFields?.includes('startDate')}
                                        excludePastTime={values.startDate.date < new Date()}
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
                                        onClick={() => setLocation(backUrl)}
                                        text={t('cancel')}
                                        type="secondary"
                                    />
                                    <Button
                                        isLoading={isSubmitting}
                                        text={stream.status === streamStatus.pending ? t('save') : t('saveStream')}
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

export default memo(UpdateStream)
