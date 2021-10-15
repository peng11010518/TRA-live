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

  headers.append('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36')
  headers.append('Accept', 'application/json; charset=UTF-8')

  return headers
}

export default getAuthorizationHeader()