import React, { memo } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'

import { ReactComponent as ArrowInIcon } from 'assets/svg/arrow-in.svg'
import { transactionType } from 'common/entities/transaction'
import TransactionTemplate from 'containers/Transaction/TransactionTemplate'

const MyWithdrawals = ({ transaction }) => {
    const { amount, isIncome, type } = transaction
    const isWithdrawal = type === transactionType.withdrawal
    const { t } = useTranslation()
    return (
        <TransactionTemplate
            Avatar={(
                <div className='flex items-center justify-center w-10 h-10 rounded-full overflow-hidden bg-gray-pale'>
                    <ArrowInIcon className={`${isWithdrawal ? 'transform rotate-180' : ''}`}  />
                </div>
            )}
            Title={(
                <div className='text-s font-bold'>
                    {t(`transactionType.${type}`)}
                </div>
            )}
            Description={(
                <div className={cn('text-s text-gray-standard')}>{t('you')}</div>
            )}
            amount={amount.value}
            isIncome={isIncome}
        />
    )
}

export default memo(MyWithdrawals)