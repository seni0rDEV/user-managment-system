import { config as conf } from 'dotenv'
conf()
const config = {
  port: process.env['PORT'],
  mongoUrl:  process.env['MONGO_URL'],
  production: process.env['PRODUCTION'],
  JwtSecret: process.env['JWT_SECRET']
}

export default config;