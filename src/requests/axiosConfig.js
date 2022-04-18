import axios from 'axios'
import { logout } from 'slices/rootSlice'
import config from '../envConfig'
import { store } from 'index'

const tapAxiosInstance = axios.create()
tapAxiosInstance.defaults.baseURL = config.apiUrl
tapAxiosInstance.defaults.headers = {
    'Content-Type': 'application/json',
}

tapAxiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response

            if (status === 403) {
                store.dispatch(logout())
            }
        }
        return Promise.reject(error)
    },
)

export const get = tapAxiosInstance.get
export const post = tapAxiosInstance.post
export const put = tapAxiosInstance.put
export const remove = tapAxiosInstance.delete

export const getAuth = (url, { headers, ...config } = {}) =>
    get(url, {
        ...config,
        headers: {
            ...headers,
            'x-session-id': localStorage.getItem('sessionId'),
        },
    })
export const postAuth = (url, data, { headers, ...config } = {}) =>
    post(url, data, {
        ...config,
        headers: {
            ...headers,
            'x-session-id': localStorage.getItem('sessionId'),
        },
    })
export const putAuth = (url, data, { headers, ...config } = {}) =>
    put(url, data, {
        ...config,
        headers: {
            ...headers,
            'x-session-id': localStorage.getItem('sessionId'),
        },
    })

export const deleteAuth = (url, { headers, ...config } = {}) =>
    remove(url, {
        ...config,
        headers: {
            ...headers,
            'x-session-id': localStorage.getItem('sessionId'),
        },
    })
