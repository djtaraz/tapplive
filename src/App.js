import React, { useEffect, Suspense, useRef } from 'react'
import { Router, Route, Switch, Redirect } from 'wouter'
import { useDispatch, useSelector } from 'react-redux'
import Loader from 'components/Loader'

import './index.css'
import Navbar from './containers/Navbar'
import Content from './components/Layout/Content'
import ResponsiveProvider from './components/ResponsiveProvider'
import { logout, setIsAuthenticated, setMe, setWarningModalState } from './slices/rootSlice'
import { getAuth } from './requests/axiosConfig'
import { routes } from './routes'
import GuardRoute from './containers/GuardRoute'
import { screens } from './common/screenResolutions'
import Sidebar from './containers/Sidebar'
import useSidebarVisibility from './hooks/useSidebarVisibility'
import SocketProvider from './SocketProvider'
import ErrorToaster from './containers/ErrorToaster'
import Modal from 'components/Modal'
import Auth from 'modals/AuthModal'
import Warning from 'modals/Warning'
import { setModalState } from 'slices/rootSlice'
import ScrollToTop from 'components/ScrollToTop'
import MobileScreen from 'components/MobileScreen'
import { meFields } from 'fields'
import Scrollbar from 'components/Scrollbar'
import Footer from 'containers/Footer'
import { refreshServerSettings } from 'hooks/useServerSettings'

function App() {
    const dispatch = useDispatch()
    const isSidebarVisible = useSidebarVisibility()
    const { isAuthenticated, screen, isModalOpened, warningModalState } = useSelector((state) => state.root)
    const warningModalRef = useRef()
    const modalRef = useRef()

    useEffect(() => {
        const storageHandler = (event) => {
            event.storageArea.length === 0 && logout()
        }
        if (isAuthenticated) {
            getAuth(`/me?_fields=${meFields}`)
                .then(({ data }) => {
                    dispatch(setIsAuthenticated(true))
                    dispatch(setMe(data.result))
                })
                .catch((error) => {
                    if (error.response && Number(error.response.status) === 403) {
                        dispatch(logout())
                    }
                })
        }
        window.addEventListener('storage', storageHandler, false)
        return () => {
            window.removeEventListener('storage', storageHandler)
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [isAuthenticated])
    useEffect(() => {
        if (isModalOpened) {
            modalRef.current.open()
        } else {
            modalRef.current.close()
        }
    }, [isModalOpened])
    useEffect(() => {
        refreshServerSettings()
    }, [])
    useEffect(() => {
        if (warningModalState.isOpened) {
            warningModalRef.current.open()
        } else {
            warningModalRef.current.close()
        }
    }, [warningModalState])
    return (
        <div className="App bg-red-500 h-full">
            <Suspense
                fallback={
                    <div className="h-full flex items-center justify-center">
                        <Loader theme="violet" />
                    </div>
                }>
                <ErrorToaster />
                <ResponsiveProvider />
                <SocketProvider>
                    <Router>
                        <Scrollbar autoHide={true}>
                            <div className="md:h-screen h-full flex flex-col">
                                <Navbar />
                                <div
                                    className="hidden sm:block w-full m-auto px-5 flex-1"
                                    style={{ maxWidth: '200rem' }}>
                                    <Content>
                                        <ScrollToTop />

                                        <div className="w-full grid gap-5 grid-cols-1 h-full pt-20 md:min-h-screen md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-296">
                                            {isSidebarVisible && isAuthenticated && screen >= screens.lg && (
                                                <div className="row-span-full">
                                                    <Sidebar />
                                                </div>
                                            )}
                                            <div
                                                className={`col-span-full ${
                                                    isSidebarVisible && isAuthenticated && screen >= screens.lg
                                                        ? 'lg:col-start-2 lg:col-end-last'
                                                        : ''
                                                }`}>
                                                <Switch>
                                                    <Route path="/">
                                                        <Redirect to={routes.recommendations.path} />
                                                    </Route>
                                                    {Object.values(routes).map((route) =>
                                                        route.isPrivate ? (
                                                            <GuardRoute
                                                                key={route.path}
                                                                path={route.path}
                                                                component={route.component}
                                                            />
                                                        ) : (
                                                            <Route
                                                                key={route.path}
                                                                path={route.path}
                                                                component={route.component}
                                                            />
                                                        ),
                                                    )}
                                                    <Route>
                                                        <Redirect to={routes.feed.path} />
                                                    </Route>
                                                </Switch>
                                            </div>
                                        </div>
                                    </Content>
                                </div>
                                <MobileScreen />
                                <Footer />
                            </div>
                        </Scrollbar>
                    </Router>
                </SocketProvider>

                <Modal size="unset" ref={modalRef} onClose={() => dispatch(setModalState(false))}>
                    <Auth />
                </Modal>

                <Modal ref={warningModalRef}>
                    <Warning
                        onClose={() => dispatch(setWarningModalState({ ...warningModalState, isOpened: false }))}
                    />
                </Modal>
            </Suspense>
        </div>
    )
}

export default App
