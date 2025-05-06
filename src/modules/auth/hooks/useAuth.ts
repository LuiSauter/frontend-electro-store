import useSWRMutation from 'swr/mutation'
import { checkToken, userLogin, userLoginGoogle } from '../services/login.service'
import { type ResponseError } from '@/utils/response-error.utils'
import { type AuthLogin } from '../models/login.model'
import { API_BASEURL, ENDPOINTS } from '@/utils'

const useAuthLogin = () => {
  const { trigger, isMutating, error } = useSWRMutation<any, ResponseError, string, AuthLogin>(API_BASEURL + ENDPOINTS.LOGIN, userLogin)
  return { authLogin: trigger, isLoggingIn: isMutating, errorLogin: error }
}

const useCheckToken = () => {
  const { trigger, isMutating, error } = useSWRMutation<any, ResponseError, string, { token: string }>(API_BASEURL + ENDPOINTS.CHECK_TOKEN, checkToken)
  return { checkToken: trigger, isChekingToken: isMutating, errorToken: error }
}

const useAuthLoginGoogle = () => {
  const { trigger, isMutating, error } = useSWRMutation<any, ResponseError, string, { access_token: string }>(API_BASEURL + ENDPOINTS.API + '/login-google', userLoginGoogle)
  return { authLoginGoogle: trigger, isLoggingInGoogle: isMutating, errorLoginGoogle: error }
}

export { useAuthLogin, useCheckToken, useAuthLoginGoogle }
