import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactMessagesTable } from '../db/schema';
import { type CreateContactMessageInput } from '../schema';
import { createContactMessage } from '../handlers/create_contact_message';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateContactMessageInput = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  subject: 'Portfolio Inquiry',
  message: 'I would like to discuss a potential collaboration opportunity.',
  attachment: null
};

// Test input with attachment
const testInputWithAttachment: CreateContactMessageInput = {
  name: 'Jane Smith',
  email: 'jane.smith@company.com',
  subject: 'Job Opportunity',
  message: 'We have an exciting position that might interest you.',
  attachment: 'https://example.com/job-description.pdf'
};

describe('createContactMessage', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a contact message with required fields', async () => {
    const result = await createContactMessage(testInput);

    // Verify all fields are properly set
    expect(result.name).toEqual('John Doe');
    expect(result.email).toEqual('john.doe@example.com');
    expect(result.subject).toEqual('Portfolio Inquiry');
    expect(result.message).toEqual('I would like to discuss a potential collaboration opportunity.');
    expect(result.attachment).toBeNull();
    expect(result.status).toEqual('new');
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('string');
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a contact message with attachment', async () => {
    const result = await createContactMessage(testInputWithAttachment);

    expect(result.name).toEqual('Jane Smith');
    expect(result.email).toEqual('jane.smith@company.com');
    expect(result.subject).toEqual('Job Opportunity');
    expect(result.message).toEqual('We have an exciting position that might interest you.');
    expect(result.attachment).toEqual('https://example.com/job-description.pdf');
    expect(result.status).toEqual('new');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save contact message to database', async () => {
    const result = await createContactMessage(testInput);

    // Query the database to verify the message was saved
    const messages = await db.select()
      .from(contactMessagesTable)
      .where(eq(contactMessagesTable.id, result.id))
      .execute();

    expect(messages).toHaveLength(1);
    const savedMessage = messages[0];
    
    expect(savedMessage.name).toEqual('John Doe');
    expect(savedMessage.email).toEqual('john.doe@example.com');
    expect(savedMessage.subject).toEqual('Portfolio Inquiry');
    expect(savedMessage.message).toEqual('I would like to discuss a potential collaboration opportunity.');
    expect(savedMessage.attachment).toBeNull();
    expect(savedMessage.status).toEqual('new');
    expect(savedMessage.created_at).toBeInstanceOf(Date);
  });

  it('should generate unique IDs for multiple messages', async () => {
    const result1 = await createContactMessage(testInput);
    const result2 = await createContactMessage(testInputWithAttachment);

    expect(result1.id).toBeDefined();
    expect(result2.id).toBeDefined();
    expect(result1.id).not.toEqual(result2.id);

    // Verify both messages exist in database
    const allMessages = await db.select()
      .from(contactMessagesTable)
      .execute();

    expect(allMessages).toHaveLength(2);
  });

  it('should handle messages with long content', async () => {
    const longMessage = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(50);
    const longSubject = 'This is a very long subject line that contains detailed information about the inquiry';
    
    const longInput: CreateContactMessageInput = {
      name: 'Test User',
      email: 'test@example.com',
      subject: longSubject,
      message: longMessage,
      attachment: null
    };

    const result = await createContactMessage(longInput);

    expect(result.subject).toEqual(longSubject);
    expect(result.message).toEqual(longMessage);
    expect(result.status).toEqual('new');
  });

  it('should handle special characters in message content', async () => {
    const specialCharsInput: CreateContactMessageInput = {
      name: 'José María Ñuñez',
      email: 'jose@example.com',
      subject: 'Café & Programming: Let\'s "collaborate"!',
      message: 'Hello! I\'m interested in your work. Can we discuss over café? 😊 \n\nBest regards,\nJosé',
      attachment: null
    };

    const result = await createContactMessage(specialCharsInput);

    expect(result.name).toEqual('José María Ñuñez');
    expect(result.subject).toEqual('Café & Programming: Let\'s "collaborate"!');
    expect(result.message).toContain('café? 😊');
    expect(result.message).toContain('\n\n');

    // Verify it's saved correctly in database
    const savedMessages = await db.select()
      .from(contactMessagesTable)
      .where(eq(contactMessagesTable.id, result.id))
      .execute();

    const savedMessage = savedMessages[0];
    expect(savedMessage.name).toEqual('José María Ñuñez');
    expect(savedMessage.subject).toEqual('Café & Programming: Let\'s "collaborate"!');
    expect(savedMessage.message).toContain('café? 😊');
  });
});