import Axios from 'axios'
import { API_URL } from './constants'

export const verifyEmail = async (email: string) => {
  try {
    const response = await Axios.post(`${API_URL}/verify`, {
      email: email,
    })
    return response.data
  } catch (error) {
    console.log(error)
  }
}
