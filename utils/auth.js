import jsSHA from 'jssha'

const getAuthorizationHeader = () => {
  const { APP_ID, APP_KEY } = process.env

  const gmtString = new Date().toGMTString()
  const shaObj = new jsSHA('SHA-1', 'TEXT')
  shaObj.setHMACKey(APP_KEY, 'TEXT')
  shaObj.update('x-date: ' + gmtString)
  const hmac = shaObj.getHMAC('B64')
  const authorization = `hmac username="${APP_ID}", algorithm="hmac-sha1", headers="x-date", signature="${hmac}"`

  const headers = new Headers()
  headers.append('Authorization', authorization)
  headers.append('X-Date', gmtString)
  headers.append('Accept-Encoding', 'gzip, deflate')

  return headers
}

export default getAuthorizationHeader()