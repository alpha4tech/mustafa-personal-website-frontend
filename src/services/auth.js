import api from './api'

export default {
  async login(credentials) {
    return api.post('/login', credentials)
  },
//   async register(data) {
//     return api.post('/register', data)
//   },
async register(data) {
    return api.post('/register', {
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation
    })
  },
  async logout() {
    return api.post('/logout')
  },
  async me() {
    return api.get('/user')
  }
}
