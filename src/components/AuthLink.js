import { Link } from 'wouter'
import { useSelector, useDispatch } from 'react-redux'
import { setModalState } from 'slices/rootSlice'

const AuthLink = ({ children, href, to, onClick, className, ...rest }) => {
    const { isAuthenticated } = useSelector((state) => state.root)
    const dispatch = useDispatch()

    if (!(href || to) || !isAuthenticated) {
        return (
            <div
                onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    dispatch(setModalState(true))
                }}
                className={`cursor-pointer ${className}`}
                {...rest}>
                {children}
            </div>
        )
    }
    return (
        <Link onClick={onClick} href={href || to} className={className}>
            {children}
        </Link>
    )
}
export default AuthLink
