import EditUsernameModal from './EditUsernameModal'
import EditPhoneNumberModal from './EditPhoneNumberModal'
import DeleteProfileModal from './DeleteProfileModal'
import LeaveProfileModal from './LeaveProfileModal'
import LanguageModal from './LanguageModal'

const EditProfileModals = ({ type, onClose }) => {
    return (
        <>
            <div className="relative">
                {type === 'username' && <EditUsernameModal onClose={onClose} />}
                {type === 'number' && <EditPhoneNumberModal onClose={onClose} />}
                {type === 'delete-profile' && <DeleteProfileModal onClose={onClose} />}
                {type === 'leave-profile' && <LeaveProfileModal onClose={onClose} />}
            </div>
            {type === 'language' && <LanguageModal onClose={onClose} />}
        </>
    )
}

export default EditProfileModals
