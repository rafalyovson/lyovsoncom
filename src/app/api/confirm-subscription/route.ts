import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Find contact by token
    const contacts = await payload.find({
      collection: 'contacts',
      where: {
        confirmationToken: { equals: token },
        status: { equals: 'pending' },
      },
      limit: 1,
    })

    if (!contacts.docs.length) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }

    const contact = contacts.docs[0]

    // Check if token is expired
    if (new Date(contact.confirmationExpiry!) < new Date()) {
      return NextResponse.json({ error: 'Confirmation link has expired' }, { status: 400 })
    }

    // Create contact in Resend
    const resendContact = await resend.contacts.create({
      email: contact.email,
      firstName: contact.firstName || undefined,
      lastName: contact.lastName || undefined,
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
    })

    // Update contact in database
    await payload.update({
      collection: 'contacts',
      id: contact.id,
      data: {
        status: 'active',
        resendContactId: resendContact.data?.id,
        confirmationToken: null,
        confirmationExpiry: null,
      },
    })

    // Redirect to success page
    return NextResponse.redirect(new URL('/subscription-confirmed', request.url))
  } catch (error) {
    console.error('Error confirming subscription:', error)
    return NextResponse.json({ error: 'Failed to confirm subscription' }, { status: 500 })
  }
}
