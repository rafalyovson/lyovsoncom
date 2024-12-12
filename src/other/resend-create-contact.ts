import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

resend.contacts.create({
  email: 'steve.wozniak@gmail.com',
  firstName: 'Steve',
  lastName: 'Wozniak',
  unsubscribed: false,
  audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
})
