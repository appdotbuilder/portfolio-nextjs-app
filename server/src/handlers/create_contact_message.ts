import { db } from '../db';
import { contactMessagesTable } from '../db/schema';
import { type CreateContactMessageInput, type ContactMessage } from '../schema';
import { randomUUID } from 'crypto';

export const createContactMessage = async (input: CreateContactMessageInput): Promise<ContactMessage> => {
  try {
    // Insert contact message record
    const result = await db.insert(contactMessagesTable)
      .values({
        id: randomUUID(),
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        attachment: input.attachment,
        status: 'new' as const // Default status for new messages
      })
      .returning()
      .execute();

    const contactMessage = result[0];
    return {
      ...contactMessage,
      status: contactMessage.status as 'new' | 'read' | 'replied'
    };
  } catch (error) {
    console.error('Contact message creation failed:', error);
    throw error;
  }
};