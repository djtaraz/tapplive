import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'wouter'
import PropTypes from 'prop-types'
import { routes } from 'routes'
import { useStream } from 'pages/Streams/StreamContext'
import Button from 'components/Button'

const EditStreamBtn = ({ isPrimary }) => {
    const [, setLocation] = useLocation()
    const { t } = useTranslation()
    const { state } = useStream()

    return (
        <div className="w-full h-10">
            <Button
                isFull
                onClick={() => {
                    setLocation(routes.updateStream.path.replace(':id', state.stream._id))
                }}
                text={t('edit')}
                type={isPrimary ? 'primary' : 'secondary'}
            />
        </div>
    )
}

EditStreamBtn.defaultProps = {
    isPrimary: false,
}

EditStreamBtn.propTypes = {
    isPrimary: PropTypes.bool,
}

export default memo(EditStreamBtn)
