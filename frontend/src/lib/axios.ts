import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    const url = error?.config?.url ?? ''

    // Redirect ke login hanya jika 401 DAN bukan dari /auth/me
    // (auth/me sudah ditangani di AuthProvider sendiri)
    if (
      status === 401 &&
      typeof window !== 'undefined' &&
      !url.includes('/auth/me')
    ) {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
