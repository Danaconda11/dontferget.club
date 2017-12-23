export default async (url, options = {}) => {
  let fetch_options = {
    method: options.method || 'GET',
    credentials: 'include',
  }
  if (options.method == 'PUT' ||
    options.method == 'POST' ||
    options.method == 'PATCH' )
  {
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    fetch_options.body = JSON.stringify(options.body)
    fetch_options.headers = headers
  }
  let res = await fetch(`/api${url}`, fetch_options)
  // HACK josh: read debug flag from config somehow, don't comment out code
  // normally
  // await new Promise(resolve => setTimeout(resolve, 2000)) // for debugging
  return res
}
