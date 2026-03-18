const BASE_URL = 'http://localhost:8000'

const api = {

  events: {
    getAll: () => axios.get(`${BASE_URL}/api/events`),
    getById: (id) => axios.get(`${BASE_URL}/api/events/${id}`),
    create: (data) => axios.post(`${BASE_URL}/api/events`, data),
    update: (id, data) => axios.put(`${BASE_URL}/api/events/${id}`, data),
    remove: (id) => axios.delete(`${BASE_URL}/api/events/${id}`)
  },

  participants: {
    getAll: () => axios.get(`${BASE_URL}/api/participants`),
    create: (data) => axios.post(`${BASE_URL}/api/participants`, data),
    remove: (id) => axios.delete(`${BASE_URL}/api/participants/${id}`)
  },

  register: {
    create: (data) => axios.post(`${BASE_URL}/api/register`, data)
  },

  admin: {
    login: (data) => axios.post(`${BASE_URL}/api/admin/login`, data)
  }

}