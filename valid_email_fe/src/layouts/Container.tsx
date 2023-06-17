import React, { FormEvent, useState } from 'react'

import Select from 'react-select'

import { verifyEmail } from '../service'
import { countries, colors } from '../utils/countries'

const selectStyles = {
  input: (provided: any) => ({
    ...provided,
    backgroundColor: 'transparent',
    fontSize: '18px',
    padding: '8px 0px',
    border: 'none !important',
    color: 'white',
    '&:focus': {
      outline: 'none',
      border: 'none !important',
      color: 'black',
    },
  }),
  control: (base: any) => ({
    ...base,
    fontSize: '18px',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    color: 'white',
    border: '2px solid white',
    paddingLeft: '0px',
    textAlign: 'left',
    padding: 'none !important',
    borderRadius: '8px',
  }),
  singleValue: (base: any) => ({
    ...base,
    color: 'white !important',
  }),
}

export const Container = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFinish, setIsFinish] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [color, setColor] = useState('')
  const [verifiedEmail, setVerifiedEmail] = useState<string[]>([])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (email === '') {
      return
    }

    setIsLoading(true)
    setIsFinish(false)

    const newEmailList: string[] = []

    const baseStr = email.split('@')[0]
    const generatedEmail = []

    const gen1 = [''],
      gen2 = [''],
      gen3 = [''],
      gen4 = [''],
      gen5 = ['']
    if (firstName !== '' && firstName.toLocaleLowerCase() !== baseStr) {
      gen1.push(firstName.toLocaleLowerCase())
    }
    if (lastName !== '' && lastName.toLocaleLowerCase() !== baseStr) {
      gen2.push(lastName.toLocaleLowerCase())
    }
    if (color !== '') {
      gen3.push(color)
    }
    if (countryCode !== '') {
      gen4.push(countryCode)
    }
    if (birthday !== '') {
      gen5.push(birthday.split('-')[0])
      gen5.push(birthday.split('-').join(''))
      gen5.push(birthday.split('-')[1] + birthday.split('-')[2])
      let tmp = ''
      if (birthday.split('-')[1][0] === '0') {
        tmp += birthday.split('-')[1].slice(1, 2)
      } else {
        tmp += birthday.split('-')[1]
      }
      if (birthday.split('-')[2][0] === '0') {
        tmp += birthday.split('-')[2].slice(1, 2)
      } else {
        tmp += birthday.split('-')[2]
      }
      if (tmp !== birthday.split('-')[1] + birthday.split('-')[2]) {
        gen5.push(tmp)
        gen5.push(birthday.split('-')[0] + tmp)
      }
    }

    for (let i1 = 0; i1 < gen1.length; i1++) {
      for (let i2 = 0; i2 < gen2.length; i2++) {
        for (let i3 = 0; i3 < gen3.length; i3++) {
          for (let i4 = 0; i4 < gen4.length; i4++) {
            for (let i5 = 0; i5 < gen5.length; i5++) {
              let temp = baseStr
              if (gen1[i1] !== '') {
                temp = temp.concat(`.${gen1[i1]}`)
              }
              if (gen2[i2] !== '') {
                temp = temp.concat(`.${gen2[i2]}`)
              }
              if (gen3[i3] !== '') {
                temp = temp.concat(`.${gen3[i3]}`)
              }
              if (gen4[i4] !== '') {
                temp = temp.concat(`.${gen4[i4]}`)
              }
              if (gen5[i5] !== '') {
                temp = temp.concat(`${gen5[i5]}`)
              }
              generatedEmail.push(temp)
            }
          }
        }
      }
    }

    const response = await verifyEmail(email)
    setStatus(response.status)
    setIsFinish(true)
    if (!response.status) {
      setIsLoading(false)
      return
    }

    for (let i = 0; i < generatedEmail.length; i++) {
      const emailAddress = generatedEmail[i] + '@' + email.split('@')[1]
      const res = await verifyEmail(emailAddress)
      if (res.status === 'valid') {
        newEmailList.push(emailAddress)
        setVerifiedEmail(newEmailList)
      }
    }
    setIsLoading(false)
  }
  return (
    <div className='flex flex-col gap-14'>
      <div className='flex gap-5'>
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
              <div
                className={`w-full text-center text-3xl ${
                  status === 'valid' && 'text-green-500'
                } ${status === 'invalid' && 'text-red-500'}`}
              >
                <p>{`This Email is ${status}.`}</p>
              </div>
              {!status && (
                <div className='w-full text-center text-2xl text-yellow-400 flex flex-col gap-2'>
                  Please Check Api Connection.
                </div>
              )}
            </>
          )}
        </div>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-1 w-96'>
            <p className='text-lg'>Name</p>
            <div className='flex gap-5'>
              <input
                className='bg-transparent border text-lg border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:outline-none focus:ring-1 focus:border-blue-500 w-full'
                placeholder='First Name'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                className='bg-transparent border text-lg border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:outline-none focus:ring-1 focus:border-blue-500 w-full'
                placeholder='Last Name'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <p className='text-lg'>Birthday</p>
            <input
              type='date'
              className='bg-transparent border text-lg border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:outline-none focus:ring-1 focus:border-blue-500'
              placeholder=''
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
        </div>
        <div className='flex flex-col gap-3 w-96'>
          <div className='flex flex-col gap-1 text-black'>
            <p className='text-lg text-white'>What is your favourite color?</p>
            <Select
              isClearable
              options={colors}
              styles={selectStyles}
              onChange={(e) => setColor(e ? e.value : '')}
            />
          </div>
          <div className='flex flex-col gap-1 text-black'>
            <div className='flex gap-5'>
              <p className='text-lg text-white'>Where are you from?</p>
              {countryCode !== '' && (
                <img
                  src={`https://ipgeolocation.io/static/flags/${countryCode}_64.png`}
                  alt={countryCode}
                  width='40px'
                  height='20px'
                />
              )}
            </div>
            <Select
              isClearable
              isSearchable
              options={countries}
              styles={selectStyles}
              onChange={(e) => setCountryCode(e ? e.value : '')}
            />
          </div>
        </div>
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
