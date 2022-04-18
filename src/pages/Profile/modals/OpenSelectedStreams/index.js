import { memo } from 'react'
import Button from 'components/Button'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { useLocation } from 'wouter'
import { routes } from 'routes'
const OpenSelectedStreams = ({ handleCancel, selected }) => {
    const { t } = useTranslation()
    const [, setLocation] = useLocation()

    const containerClasses = cn(
        `fixed z-100 flex items-center bg-white justify-center bottom-0 right-0 left-0 
            p-4.5 cursor-pointer shadow-100 transform-gpu transition-transform ease-in-out`,
        selected.length !== 0 ? 'translate-y-0' : 'translate-y-28',
    )
    const handleOpen = () => {
        setLocation(`${routes.multiscreen.path}?streams=${selected.join(',')}`)
    }

    return (
        <div className={containerClasses}>
            <section className="flex items-center justify-end  ">
                <Button type="secondary" fontWeight="bold" onClick={handleCancel} text={t('cancel')} />
                <div className="ml-5">
                    <Button fontWeight="bold" onClick={handleOpen} text={t('openSelectedStreams')} />
                </div>
            </section>
        </div>
    )
}

export default memo(OpenSelectedStreams)
