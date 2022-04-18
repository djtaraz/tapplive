import EmptyStateImage from 'assets/svg/illustrations/search-empty-state.svg'

const EmptyState = ({ className, text }) => (
    <div className={`text-center mt-32 ${className}`}>
        <img className="sq-140 mx-auto" src={EmptyStateImage} alt="" />
        <div className="text-s mt-3">{text}</div>
    </div>
)

export default EmptyState
