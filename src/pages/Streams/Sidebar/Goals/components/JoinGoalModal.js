import React, { memo } from 'react'
import { Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation } from 'react-query'
import { useTranslation } from 'react-i18next'

import Button from 'components/Button'
import FormGroup from 'components/Formik/FormGroup'
import FormikNumberInput from 'components/Formik/FormikNumberInput'
import { ReactComponent as DollarIcon } from 'assets/svg/dollar.svg'
import AvailableAmount from 'components/AvailableAmount'
import { setError, setMe } from 'slices/rootSlice'
import { putAuth } from 'requests/axiosConfig'
import { useStream } from '../../../StreamContext'
import { validationSchema } from '../validation'
import { backGoal } from '../../../streamStorage'


const formGroupGap = 5
const JoinGoalModal = ({ closeModal, _id }) => {
    const { state, streamDispatch } = useStream()
    const { stream } = state
    const dispatch = useDispatch()
    const { me } = useSelector(state => state.root)
    const { t } = useTranslation()
    const { mutateAsync } = useMutation(
        'createStreamGoal',
        ({ streamId, ...body }) => putAuth(`/streams/${stream._id}/goals/${_id}`, body),
    )

    const joinGoal = async (values) => {
        try {
            await mutateAsync({
                amount: values.amount * 100,
                streamId: stream._id,
            })
            streamDispatch(backGoal({ _id, amount: values.amount * 100 }))
            dispatch(setMe({
                ...me,
                balances: {
                    ...me.balances,
                    usd: me.balances.usd - values.amount * 100,
                },
            }))
            closeModal()
        } catch(error) {
            dispatch(setError({ message: 'Failed to join the goal.', error}))
        }
    }

    return (
        <Formik
            onSubmit={joinGoal}
            initialValues={{}}
            validateOnMount={true}
            validationSchema={validationSchema}
        >
            {
                ({ values, handleSubmit, isValid, isSubmitting }) => {
                    const isAmountExceeded = Number(values.amount) > me?.balances.usd / 100
                    return (
                        <form noValidate={true} className='w-full flex flex-col px-14 pb-12' onSubmit={handleSubmit}>
                            <div className='flex-1'>
                                <h1 className='text-center bold text-xl mx-auto mb-10 font-semibold w-4/5'>{t('streamGoals.joinGoal')}</h1>
                                <FormGroup gap={formGroupGap}>
                                    <FormikNumberInput
                                        placeholder={t('amount')}
                                        name='amount'
                                        icon={DollarIcon}
                                    />
                                    <div className='mt-3'>
                                        <AvailableAmount isAmountExceeded={isAmountExceeded}
                                                         balance={me?.balances.usd} />
                                    </div>
                                </FormGroup>
                            </div>
                            <div className='mt-10'>
                                <Button
                                    text={t('participate')}
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

export default memo(JoinGoalModal)