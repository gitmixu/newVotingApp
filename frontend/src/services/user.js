import axios from 'axios'
const baseUrl = '/api/login'
const baseSignUp = '/api/users'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

const signUp = async credentials => {
  const response = await axios.post(baseSignUp, credentials)
  return response.data
}

export default { login, signUp }