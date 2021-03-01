let baseUrl = '';
if (process.env.NODE_ENV == 'development') {
  baseUrl = process.env.VUE_APP_BASEURL
} else if (process.env.NODE_ENV == 'production') {
  baseUrl = process.env.VUE_APP_BASEURL
} else if (process.env.NODE_ENV == 'staging') {
  baseUrl = process.env.VUE_APP_BASEURL
} else if (process.env.NODE_ENV == 'test') {
  baseUrl = process.env.VUE_APP_BASEURL
} 

export default {
  baseUrl
}