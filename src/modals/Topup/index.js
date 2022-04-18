import { memo, useState } from 'react'
import { putAuth } from 'requests/axiosConfig'
import { Trans, useTranslation } from 'react-i18next'
import { number, object, string } from 'yup'
import { Formik } from 'formik'
import { useDispatch } from 'react-redux'

import { ReactComponent as DollarIcon } from 'assets/svg/dollar.svg'
import FormikNumberInput from 'components/Formik/FormikNumberInput'
import FormGroup from 'components/Formik/FormGroup'
import Button from 'components/Button'
import { setError } from '../../slices/rootSlice'
import PaymentMethodSelector from 'components/PaymentMethodSelector'
import Checkbox from 'components/Checkbox'
import FormikInput from 'components/Formik/FormikInput'
import CountrySelector from 'components/CountrySelector'

const getValidationSchema = (method) => {
    if (method === 'creditCard') {
        return object().shape({
            amount: number().positive().required(),
            email: string().email().required(),
            billingAddress: object().shape({
                firstName: string().required(),
                lastName: string().required(),
                address: string().required(),
                city: string().required(),
                countryIso: string().required(),
            }),
        })
    }
    return object().shape({
        amount: number().positive().required(),
    })
}

const Topup = ({ onClose }) => {
    const [withdrawMethod, setWithdrawMethod] = useState()
    const [isAgreed, setAgreed] = useState(false)
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()

    const submitTopup = async ({ amount, email, billingAddress }) => {
        try {
            const url = withdrawMethod === 'creditCard' ? `/user/wallet/ngenius` : `/user/wallet/coin`
            const { data } = await putAuth(url, {
                amount: amount * 100,
                email,
                billingAddress,
            })
            email && localStorage.setItem('email', email)
            billingAddress && localStorage.setItem('billingAddress', JSON.stringify(billingAddress))
            window.location = data.result.payUrl
            onClose()
        } catch (error) {
            if (error?.response.data.error && error.response.data.error.id === 400.117) {
                dispatch(setError({ message: t('pc4ServiceUnavailable'), error }))
            }
        }
    }

    const onChange = (e) => {
        setAgreed(e.target.checked)
    }

    if (withdrawMethod === undefined) {
        return <PaymentMethodSelector isWithdraw={false} onSelect={setWithdrawMethod} />
    }
    return (
        <div className="w-460p flex px-14 pb-12">
            <Formik
                validationSchema={getValidationSchema(withdrawMethod)}
                initialValues={
                    withdrawMethod === 'creditCard'
                        ? {
                              email: localStorage.getItem('email'),
                              billingAddress: JSON.parse(localStorage.getItem('billingAddress')),
                          }
                        : {}
                }
                onSubmit={submitTopup}
                validateOnMount={true}>
                {({ handleSubmit, isValid, isSubmitting, errors, values }) => (
                    <form noValidate={true} className="w-full flex flex-col" onSubmit={handleSubmit}>
                        <div className="flex-1">
                            <h1 className="text-center bold text-xl mb-10 font-semibold">{t('topup')}</h1>
                            <FormGroup gap={5}>
                                <FormikNumberInput placeholder={t('amount')} name="amount" icon={DollarIcon} />
                            </FormGroup>
                            {withdrawMethod === 'creditCard' && (
                                <>
                                    <FormGroup gap={5}>
                                        <CountrySelector
                                            placeholder={t('payment.country')}
                                            name="billingAddress.countryIso"
                                        />
                                    </FormGroup>
                                    <FormGroup gap={5}>
                                        <FormikInput placeholder={t('payment.city')} name="billingAddress.city" />
                                    </FormGroup>
                                    <FormGroup gap={5}>
                                        <FormikInput placeholder={t('payment.address')} name="billingAddress.address" />
                                    </FormGroup>
                                    <FormGroup gap={5}>
                                        <FormikInput
                                            placeholder={t('payment.firstName')}
                                            name="billingAddress.firstName"
                                        />
                                    </FormGroup>
                                    <FormGroup gap={5}>
                                        <FormikInput
                                            placeholder={t('payment.lastName')}
                                            name="billingAddress.lastName"
                                        />
                                    </FormGroup>
                                    <FormGroup gap={5}>
                                        <FormikInput placeholder={t('email')} name="email" />
                                    </FormGroup>
                                </>
                            )}
                        </div>
                        <Checkbox
                            className={withdrawMethod === 'creditCard' ? 'mt-5' : 'mt-140p'}
                            value={isAgreed}
                            onChange={onChange}>
                            <span className="text-s select-none">
                                <Trans
                                    i18nKey="byClickingNextYouAgreeTheTerms"
                                    components={{
                                        a: (
                                            // eslint-disable-next-line jsx-a11y/anchor-has-content
                                            <a
                                                rel="noopener noreferrer"
                                                target="_blank"
                                                className="text-violet-saturated hover:text-violet-dark"
                                                href={`${process.env.PUBLIC_URL}/locales/${i18n.language}/userAgreement.pdf`}
                                                alt="user agreement"
                                            />
                                        ),
                                        1: (
                                            // eslint-disable-next-line jsx-a11y/anchor-has-content
                                            <a
                                                rel="noopener noreferrer"
                                                target="_blank"
                                                className="text-violet-saturated hover:text-violet-dark"
                                                href={`${process.env.PUBLIC_URL}/locales/${i18n.language}/privacyPolicy.pdf`}
                                                alt="privacy policy"
                                            />
                                        ),
                                    }}
                                />
                            </span>
                        </Checkbox>
                        <Button
                            text={t('next')}
                            isFull
                            isBig
                            isDisabled={!isValid || !isAgreed}
                            isLoading={isSubmitting}
                            className="mt-5"
                        />
                    </form>
                )}
            </Formik>
        </div>
    )
}

export default memo(Topup)
