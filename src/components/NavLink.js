import React from 'react'
import PropTypes from 'prop-types'

import { useRoute, Link } from 'wouter'
import cn from 'classnames'

function NavLink({ children, to, className, activeClasses }) {
    const [isActive] = useRoute(to)
    const classes = cn(className, {
        [activeClasses]: isActive
    })
    return (
        <Link to={to}>
            <a className={classes}>{children}</a>
        </Link>
    )
}

NavLink.propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    className: PropTypes.string,
    activeClasses: PropTypes.string
}

export default NavLink
