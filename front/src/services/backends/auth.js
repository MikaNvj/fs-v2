import Api from '../api'

export const signin = async (creds) => {
  const res = await Api.post({
    url: '/auth/signin',
    data: creds
  })
  return res.data
}

export const check = async () => {
  const res = await Api.get({
    url: '/auth/check'
  })
  return res.data
}

export const newImages = async (date) => {
  const res = await Api.get({
    url: '/auth/new-images',
    params: { date }
  })
  return res.data
}