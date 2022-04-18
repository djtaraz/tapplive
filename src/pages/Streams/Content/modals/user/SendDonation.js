import React, { memo } from 'react'
import { Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { number, object } from 'yup'
import { useMutation } from 'react-query'

import Button from 'components/Button'
import FormGroup from 'components/Formik/FormGroup'
import FormikInput from 'components/Formik/FormikInput'
import { ReactComponent as DollarIcon } from 'assets/svg/dollar.svg'
import FormikNumberInput from 'components/Formik/FormikNumberInput'
import { postAuth } from 'requests/axiosConfig'
import { useStream } from '../../../StreamContext'
import AvailableAmount from 'components/AvailableAmount'
import { setMe } from 'slices/rootSlice'


const validationSchema = object().shape({
    amount: number().positive().required(),
})
const formGroupGap = 5
const SendDonation = ({ closeModal }) => {
    const dispatch = useDispatch()
    const { state } = useStream()
    const { stream } = state
    const { mutateAsync } = useMutation({
        mutationKey: 'sendDonation',
        mutationFn: ({ streamId, ...body }) => postAuth(`/streams/${streamId}/donations`, body),
    })
    const { t } = useTranslation()
    const { me } = useSelector(state => state.root)

    const submitDonation = async ({ amount, message }) => {
        await mutateAsync({
            streamId: stream._id,
            amount: amount * 100,
            message
        })
        dispatch(setMe({
            ...me,
            balances: {
                ...me.balances,
                usd: me.balances.usd - amount * 100
            }
        }))
        closeModal()
    }

    return (
        <Formik
            validationSchema={validationSchema}
            initialValues={{}}
            onSubmit={submitDonation}
            validateOnMount={true}
        >
            {
                ({ values, handleSubmit, isValid, isSubmitting }) => {
                    const isAmountExceeded = Number(values.amount) > me?.balances.usd / 100
                    return (
                        <form noValidate={true} className='w-full flex flex-col px-14 pb-12' onSubmit={handleSubmit}>
                            <div className='flex-1'>
                                <h1 className='text-center bold text-xl mb-10 font-semibold'>{t('sendDonation')}</h1>
                                <FormGroup gap={formGroupGap}>
                                    <FormikInput
                                        placeholder={t('message')}
                                        name='message'
                                        maxLength={50}
                                    />
                                </FormGroup>
                                <FormGroup gap={formGroupGap}>
                                    <FormikNumberInput
                                        placeholder={t('donation')}
                                        name='amount'
                                        icon={DollarIcon}
                                    />
                                    <div className='mt-3'>
                                        <AvailableAmount isAmountExceeded={isAmountExceeded} balance={me?.balances.usd} />
                                    </div>
                                </FormGroup>
                            </div>
                            <div>
                                <Button
                                    text={t('send')}
                                    isFull
                                    isBig
                                    isDisabled={isAmountExceeded || !isValid}
                                    isLoading={isSubmitting}
                                />
                            </div>
                        </form>
                    )
                }
            }
        </Formik>
    )
}

export default memo(SendDonation)