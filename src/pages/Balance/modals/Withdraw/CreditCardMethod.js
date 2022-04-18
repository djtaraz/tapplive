import { Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import FormikInput from 'components/Formik/FormikInput'
import FormGroup from 'components/Formik/FormGroup'
import FormikNumberInput from 'components/Formik/FormikNumberInput'
import { ReactComponent as DollarIcon } from 'assets/svg/dollar.svg'
import AvailableAmount from 'components/AvailableAmount'

import { number, object, string } from 'yup'
import { useMutation } from 'react-query'
import { setError, setMe } from 'slices/rootSlice'
import { withdrawFromBalanceToCreditCard } from 'requests/user-requests'
import { getAuth } from 'requests/axiosConfig'
import { meFields } from 'fields'
import { formatThousands } from 'utils/numberUtils'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { useServerSettings } from 'hooks/useServerSettings'
import Button from 'components/Button'
import Comission from 'components/Commission'

const CreditCardMethod = ({ onEnd }) => {
    const { t } = useTranslation()
    const { me } = useSelector((state) => state.root)
    const { commission } = useServerSettings()
    const dispatch = useDispatch()

    const getValidationSchema = () => {
        return object().shape({
            cardholderName: string().trim().max(50).required(),
            amount: number()
                .transform((_, v) => (typeof v === 'number' ? v : parseFloat(v.replace(/,/g, '.'))))
                .min(1, `${t('minWithdrawAmount')} 1$`)
                .max(me?.balances.usd / 100, t('maxWithdrawAmount'))
                .required(),
            cardNumber: number().test('len', 'Must be exactly 16 characters', (val) => String(val).length === 16),
            expMonth: number()
                .test('len', 'Must be exactly 2 characters', (val) => String(val).length <= 2)
                .max(12)
                .min(1)
                .required(),
            expYear: number()
                .test('len', 'Must be exactly 2 characters', (val) => String(val).length === 2)
                .min(new Date().getFullYear().toString().substr(-2))
                .required(),
            email: string().email().required(),
        })
    }

    const successToast = () => {
        toast.dark(<div className="text-s text-white tracking-0.01">{t('withdrawCompleted')}</div>, {
            autoClose: 2500,
        })
    }

    const { mutate, isLoading } = useMutation({
        mutationKey: 'withdraw',
        mutationFn: (values) => {
            values.email && localStorage.setItem('email', values.email)

            return withdrawFromBalanceToCreditCard({
                ...values,
                amount: Number(values.amount) * 100,
                expMonth: Number(values.expMonth),
                expYear: Number(`20${values.expYear}`),
            })
        },
        onSuccess: () => {
            getAuth(`/me?_fields=${meFields}`)
                .then(({ data }) => {
                    dispatch(setMe(data.result))
                })
                .finally(() => {
                    successToast()
                    onEnd()
                })
        },
        onError: (error) => {
            dispatch(setError({ message: t('withdrawFailed'), error }))
            onEnd()
        },
    })
    return (
        <Formik
            onSubmit={mutate}
            initialValues={{
                amount: undefined,
                eosAccount: undefined,
                email: localStorage.getItem('email'),
            }}
            validateOnChange={true}
            validateOnBlur={false}
            validateOnMount={true}
            enableReinitialize={true}
            validationSchema={getValidationSchema}>
            {({ values, handleSubmit, isValid, errors }) => {
                const isAmountExceeded = Number(values.amount || 0) > me?.balances.usd / 100
                const commissionValue =
                    (values.amount ? Math.ceil(Number(values.amount.replace(/,/, '.')) * 10) / 10 : 0) *
                    (commission / 100 / 100)
                const commissionFixed = formatThousands(
                    commissionValue.toFixed(Number.isInteger(commissionValue) ? 0 : 2),
                )

                return (
                    <form className="px-14 flex flex-col h-full pb-12.5 w-460p" onSubmit={handleSubmit}>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-center mb-10">{t('withdraw')}</h1>
                            <FormGroup gap={5}>
                                <FormikNumberInput
                                    name="cardNumber"
                                    validationError={values.cardNumber && errors?.cardNumber}
                                    placeholder={t('payment.creditCardNumber')}
                                    showError={false}
                                    pattern={/^\d{1,16}$/}
                                />
                            </FormGroup>
                            <section className="flex mb-5">
                                <div className="mr-5">
                                    <FormikNumberInput
                                        name="expMonth"
                                        validationError={values.expMonth && errors?.expMonth}
                                        placeholder={t('payment.month')}
                                        pattern={/^\d{1,2}$/}
                                        showError={false}
                                    />
                                </div>
                                <FormikNumberInput
                                    name="expYear"
                                    validationError={values.expYear && errors?.expYear}
                                    placeholder={t('payment.year')}
                                    pattern={/^\d{1,2}$/}
                                    showError={false}
                                />
                            </section>
                            <FormGroup gap={5}>
                                <FormikInput
                                    placeholder={t('payment.cardholder')}
                                    name="cardholderName"
                                    maxLength={50}
                                />
                            </FormGroup>
                            <FormGroup gap={5}>
                                <FormikInput placeholder={t('email')} name="email" />
                            </FormGroup>
                            <FormGroup gap={5}>
                                <FormikNumberInput
                                    name="amount"
                                    icon={DollarIcon}
                                    validationError={values.amount && errors?.amount}
                                    placeholder={t('amount')}
                                />
                                <div
                                    className={`flex justify-between items-center ${
                                        values.amount && errors?.amount ? 'mt-5' : 'mt-3'
                                    }`}>
                                    <AvailableAmount isAmountExceeded={isAmountExceeded} balance={me?.balances.usd} />
                                    <Comission value={commissionFixed} />
                                </div>
                            </FormGroup>
                        </div>
                        <Button
                            text={t('next')}
                            isFull
                            isBig
                            isDisabled={!isValid}
                            isLoading={isLoading}
                            className="mt-12.5"
                        />
                    </form>
                )
            }}
        </Formik>
    )
}

export default CreditCardMethod
