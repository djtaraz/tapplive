import { memo } from 'react'
import PaymentMethodSelector from 'components/PaymentMethodSelector'
import { useState } from 'react'
import PaycashMethod from './PaycashMethod'
import CreditCardMethod from './CreditCardMethod'

const Withdraw = ({ onClose }) => {
    const [withdrawMethod, setWithdrawMethod] = useState()

    const onSelect = (method) => {
        setWithdrawMethod(method)
    }

    if (withdrawMethod === 'paycash') {
        return <PaycashMethod onEnd={onClose} />
    }
    if (withdrawMethod === 'creditCard') {
        return <CreditCardMethod onEnd={onClose} />
    }
    return <PaymentMethodSelector onSelect={onSelect} />
}

export default memo(Withdraw)
