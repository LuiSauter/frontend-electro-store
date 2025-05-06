import { STORAGE_TOKEN, STORAGE_USER, fetchData, fetchDataNoAuth, setStorage } from '@/utils'
import { type AuthLogin } from '../models/login.model'

const userLogin = async (url: string, { arg }: { arg: AuthLogin }): Promise<any> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg),
    headers: { 'Content-Type': 'application/json' }
  }

  const data = await fetchDataNoAuth(url, options)
  console.log('data', data)
  if (data.data.accessToken) {
    setStorage(STORAGE_TOKEN, data.data.accessToken as string)
  }
  return data.data.user
}

const checkToken = async (url: string, { arg }: { arg: { token: string } }): Promise<any> => {
  const response = await fetchData(`${url}?token=${arg.token}`)
  if (response.statusCode === 200) {
    setStorage(STORAGE_USER, response.data.id as string)
  }
  return response.data
}

const userLoginGoogle = async (url: string, { arg }: {
  arg: {
    access_token: string
  }
}): Promise<any> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg),
    headers: { 'Content-Type': 'application/json' }
  }

  const data = await fetchData(url, options)
  if (data.data.accessToken) {
    setStorage(STORAGE_TOKEN, data.data.accessToken as string)
  }
  return data.data.User
}

export { userLogin, checkToken, userLoginGoogle }
