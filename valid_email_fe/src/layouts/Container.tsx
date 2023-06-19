import React, { FormEvent, useState } from 'react'

import { verifyEmail } from '../service'

export type BulkType = {
  email_address: string
}

export const Container = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFinish, setIsFinish] = useState(false)
  const [verifiedEmail, setVerifiedEmail] = useState<string[]>([])
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (email === '') {
      return
    }

    setIsFinish(false)
    setIsLoading(true)

    let current = 0
    if (localStorage.getItem(email) === null) {
      localStorage.setItem(email, '1')
    } else {
      current = JSON.parse(localStorage.getItem(email)!)
    }

    const newList: string[] = []
    const account = email.split('@')[0]
    const domain = email.split('@')[1]

    if (!status) {
      const response = await verifyEmail(email)
      if (!response.status) {
        setIsFinish(true)
        setIsLoading(false)
        return
      }
      setStatus(response.status)
    }

    while (newList.length < 2) {
      const newEmail = account + current.toString() + '@' + domain
      console.log(newEmail)
      current++
      const response = await verifyEmail(newEmail)
      if (!response.status) {
        break
      } else {
        if (response.status === 'valid') {
          newList.push(response.address)
        }
      }
    }

    localStorage.setItem(email, current.toString())
    setVerifiedEmail(newList)
    setIsFinish(true)
    setIsLoading(false)
  }
  return (
    <div className='flex flex-col gap-14'>
      <div className='flex flex-col gap-1'>
        <label htmlFor='email' className='text-xl ml-2'>
          Input Email:
        </label>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <input
            type='email'
            id='email'
            name='email'
            className='bg-transparent border text-lg border-gray-300 rounded-lg w-96 p-2.5 focus:ring-blue-500 focus:outline-none focus:ring-1 focus:border-blue-500'
            placeholder='ross@gmail.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type='submit'
            className='text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 focus:ring-0 font-medium rounded-lg text-lg px-5 py-2.5 disabled:cursor-not-allowed disabled:bg-blue-900'
            disabled={isLoading}
          >
            CHECK & GENERATE
          </button>
        </form>
        <div className='flex w-full justify-center'>
          {isLoading && (
            <svg
              aria-hidden='true'
              className='inline w-10 h-10 text-gray-300 animate-spin fill-blue-600'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
          )}
        </div>
        {isFinish && (
          <>
            {status ? (
              <div
                className={`w-full text-center text-3xl ${
                  status === 'valid' && 'text-green-500'
                } ${status === 'invalid' && 'text-red-500'}`}
              >
                <p>{`This Email is ${status}.`}</p>
              </div>
            ) : (
              <div className='w-full text-center text-2xl text-yellow-400 flex flex-col gap-2'>
                Please Check Api Connection.
              </div>
            )}
          </>
        )}
      </div>

      <div className='flex flex-col gap-2 w-full items-center'>
        <h2 className='mb-2 text-2xl font-semibold border-b-4 px-3 border-gray-200'>
          Similar Verified Email List:
        </h2>
        <ul className='space-y-1 text-gray-200 list-disc list-inside'>
          {verifiedEmail &&
            verifiedEmail.map((item, index) => (
              <li
                className='text-xl border-b-2 px-1 border-gray-200'
                key={index}
              >
                {item}
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
