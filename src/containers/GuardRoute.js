import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'wouter'
import { routes } from '../routes'

function GuardRoute(props) {
    const { isAuthenticated } = useSelector((state) => state.root)

    if (!isAuthenticated) {
        return <Redirect to={routes.recommendations.path} />
    }

    return <Route {...props} />
}

export default GuardRoute
