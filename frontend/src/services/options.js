import axios from 'axios'
const baseUrl = '/api/polls'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.post(baseUrl, newObject, config)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.put(`${baseUrl}/${id}`, config, newObject)
  return request.then(response => response.data)
}

export default { 
  setToken,
  getAll, 
  create,
  update
}