import 'dotenv/config'
import { defineConfig } from '@prisma/config'

const isRegistrationSchema = process.argv.some((arg) => arg.includes('registration.prisma'))

const dbUrl = isRegistrationSchema
  ? (process.env.NEON_DIRECT_URL || process.env.NEON_DATABASE_URL)
  : (process.env.DIRECT_URL || process.env.DATABASE_URL)

export default defineConfig({
  datasource: {
    url: dbUrl,
  },
})



