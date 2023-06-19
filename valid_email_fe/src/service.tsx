import Axios from 'axios'
import { API_URL } from './constants'
import { BulkType } from './layouts/Container'

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

export const bulkVerifyEmail = async (emails: BulkType[]) => {
  try {
    const response = await Axios.post(`${API_URL}/bulk-verify`, {
      emails: emails,
    })
    return response.data
  } catch (error) {
    console.log(error)
  }
}
