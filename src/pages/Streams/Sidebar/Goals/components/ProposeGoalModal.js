import React, { memo } from 'react'
import { Formik } from 'formik'
import { number, object } from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation } from 'react-query'
import { useTranslation } from 'react-i18next'

import Button from 'components/Button'
import FormGroup from 'components/Formik/FormGroup'
import FormikInput from 'components/Formik/FormikInput'
import FormikNumberInput from 'components/Formik/FormikNumberInput'
import { ReactComponent as DollarIcon } from 'assets/svg/dollar.svg'
import AvailableAmount from 'components/AvailableAmount'
import { setMe } from 'slices/rootSlice'
import { postAuth } from 'requests/axiosConfig'
import { useStream } from '../../../StreamContext'
import OkeyImg from 'assets/svg/illustrations/okey.svg'
import { useStep } from 'hooks/useStep'

const validationSchema = object().shape({
    price: number().positive().required(),
})
const formGroupGap = 5
const ProposeGoalModal = ({ closeModal }) => {
    const { state } = useStream()
    const { stream } = state
    const dispatch = useDispatch()
    const { me } = useSelector((state) => state.root)
    const { t } = useTranslation()
    const { mutateAsync } = useMutation('createStreamGoal', ({ streamId, ...body }) =>
        postAuth(`/streams/${streamId}/goals`, body),
    )
    const { step, nextStep } = useStep()

    const proposeGoal = async (values) => {
        await mutateAsync({
            description: values.description,
            initialAmount: Number(values.initialAmount ?? 0) * 100,
            price: {
                value: values.price * 100,
                currency: 'usd',
            },
            streamId: stream._id,
        })

        if (values.initialAmount) {
            dispatch(
                setMe({
                    ...me,
                    balances: {
                        ...me.balances,
                        usd: me.balances.usd - values.initialAmount * 100,
                    },
                }),
            )
        }
        nextStep()
    }

    return (
        <>
            {step === 1 && (
                <Formik
                    onSubmit={proposeGoal}
                    initialValues={{}}
                    validateOnMount={true}
                    validationSchema={validationSchema}>
                    {({ values, handleSubmit, isValid, isSubmitting }) => {
                        const isAmountExceeded = Number(values.initialAmount) > me?.balances.usd / 100
                        return (
                            <form
                                noValidate={true}
                                className="w-full flex flex-col px-14 pb-12"
                                onSubmit={handleSubmit}>
                                <div className="flex-1">
                                    <h1 className="text-center bold text-xl mb-10 font-semibold">
                                        {t('streamGoals.proposeGoal')}
                                    </h1>
                                    <FormGroup gap={formGroupGap}>
                                        <FormikInput
                                            placeholder={t('streamGoals.goalDescription')}
                                            name="description"
                                            maxLength={50}
                                        />
                                    </FormGroup>
                                    <FormGroup gap={formGroupGap}>
                                        <FormikNumberInput placeholder={t('amount')} name="price" icon={DollarIcon} />
                                    </FormGroup>
                                    <FormGroup gap={formGroupGap}>
                                        <FormikNumberInput
                                            placeholder={t('streamGoals.backGoal')}
                                            name="initialAmount"
                                            icon={DollarIcon}
                                        />
                                        <div className="mt-3">
                                            <AvailableAmount
                                                isAmountExceeded={isAmountExceeded}
                                                balance={me?.balances.usd}
                                            />
                                        </div>
                                    </FormGroup>
                                </div>
                                <div className="mt-10">
                                    <Button
                                        text={t('continue')}
                                        isFull
                                        isBig
                                        isDisabled={isAmountExceeded || !isValid}
                                        isLoading={isSubmitting}
                                    />
                                </div>
                            </form>
                        )
                    }}
                </Formik>
            )}

            {step === 2 && (
                <div className="flex flex-col items-center animate-appear pb-12">
                    <img className="sq-120" src={OkeyImg} alt="Alright!" />
                    <h1 className="text-xl font-semibold mt-5">{t('ready')}!</h1>
                    <div className="text-s mt-3">{t('streamGoals.goalSent')}</div>
                    <div className="mt-auto">
                        <Button text={t('backToWatching')} isFull={true} onClick={closeModal} />
                    </div>
                </div>
            )}
        </>
    )
}

export default memo(ProposeGoalModal)
