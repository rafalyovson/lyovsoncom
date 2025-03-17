'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { z } from 'zod'

import { Contact } from '@/payload-types'
import { generateToken } from '@/utilities/generateToken'
import { getSubscriptionConfirmationEmail } from '@/emails/subscription-confirmation'

const contactSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().optional(),
  projectId: z.coerce.number().positive(),
})

export type ActionResponse = {
  success: boolean
  message: string
  contact?: Contact
  errors?: Record<string, string>
}

export async function createContactAction(
  prevState: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    const payload = await getPayload({ config: configPromise })

    // Validate input
    const result = contactSchema.safeParse({
      email: formData.get('email'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      projectId: formData.get('projectId'),
    })

    if (!result.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: Object.fromEntries(
          Object.entries(result.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] || '']),
        ),
      }
    }

    const { email, firstName, lastName, projectId } = result.data

    // Check existing contact
    const existingContact = await payload.find({
      collection: 'contacts',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existingContact.docs.length) {
      return { success: false, message: 'Contact already exists' }
    }

    // Verify project exists
    const project = await payload.findByID({
      collection: 'projects',
      id: projectId,
    })

    if (!project) {
      return { success: false, message: 'Project not found' }
    }

    // Generate confirmation token
    const confirmationToken = generateToken()
    const confirmationExpiry = new Date()
    confirmationExpiry.setHours(confirmationExpiry.getHours() + 24)

    // Create contact
    const contact = await payload.create({
      collection: 'contacts',
      data: {
        email,
        firstName,
        lastName,
        project: projectId,
        status: 'pending',
        subscribedAt: new Date().toISOString(),
        confirmationToken,
        confirmationExpiry: confirmationExpiry.toISOString(),
      },
    })

    // Send confirmation email
    const { html, subject } = getSubscriptionConfirmationEmail({
      firstName,
      confirmationToken,
      projectName: project.name,
    })

    await payload.sendEmail({
      to: email,
      from: 'notifications@mail.lyovson.com',
      subject,
      html,
    })

    return {
      success: true,
      message: 'Please check your email to confirm your subscription.',
      contact,
    }
  } catch (error) {
    console.error('Error creating contact:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}
