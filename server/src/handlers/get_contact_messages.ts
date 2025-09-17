import { db } from '../db';
import { contactMessagesTable } from '../db/schema';
import { type ContactMessage } from '../schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

// Input schema for filtering contact messages
export const getContactMessagesInputSchema = z.object({
  status: z.enum(['new', 'read', 'replied']).optional(),
  limit: z.number().int().positive().default(50),
  offset: z.number().int().nonnegative().default(0)
});

export type GetContactMessagesInput = z.infer<typeof getContactMessagesInputSchema>;

export const getContactMessages = async (input: Partial<GetContactMessagesInput> = {}): Promise<ContactMessage[]> => {
  try {
    // Parse input with defaults applied
    const parsedInput = getContactMessagesInputSchema.parse(input);
    const { status, limit, offset } = parsedInput;

    // Build query with proper chaining - let TypeScript infer types
    const baseQuery = db.select().from(contactMessagesTable);

    // Apply status filter conditionally and build complete query
    const results = status
      ? await baseQuery
          .where(eq(contactMessagesTable.status, status))
          .orderBy(desc(contactMessagesTable.created_at))
          .limit(limit)
          .offset(offset)
          .execute()
      : await baseQuery
          .orderBy(desc(contactMessagesTable.created_at))
          .limit(limit)
          .offset(offset)
          .execute();

    // Return results with proper type mapping
    return results.map(message => ({
      id: message.id,
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      attachment: message.attachment,
      status: message.status as 'new' | 'read' | 'replied',
      created_at: message.created_at
    }));
  } catch (error) {
    console.error('Failed to fetch contact messages:', error);
    throw error;
  }
};