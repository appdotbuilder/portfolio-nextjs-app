import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactMessagesTable } from '../db/schema';
import { getContactMessages } from '../handlers/get_contact_messages';

describe('getContactMessages', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  // Helper function to create test contact messages
  const createTestMessage = async (overrides: Partial<any> = {}) => {
    const defaultMessage = {
      id: `msg_${Date.now()}_${Math.random()}`,
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'Test message content',
      attachment: null,
      status: 'new',
      ...overrides
    };

    await db.insert(contactMessagesTable).values(defaultMessage);
    return defaultMessage;
  };

  it('should fetch all contact messages with default parameters', async () => {
    // Create test messages
    const message1 = await createTestMessage({ name: 'Alice', subject: 'First message' });
    const message2 = await createTestMessage({ name: 'Bob', subject: 'Second message' });

    const result = await getContactMessages();

    expect(result).toHaveLength(2);
    expect(result[0].name).toEqual('Bob'); // Should be ordered by created_at DESC
    expect(result[1].name).toEqual('Alice');
    
    // Verify all fields are present and correct types
    result.forEach(message => {
      expect(message.id).toBeDefined();
      expect(message.name).toBeDefined();
      expect(message.email).toBeDefined();
      expect(message.subject).toBeDefined();
      expect(message.message).toBeDefined();
      expect(message.status).toBeDefined();
      expect(message.created_at).toBeInstanceOf(Date);
    });
  });

  it('should filter messages by status', async () => {
    // Create messages with different statuses
    await createTestMessage({ name: 'Alice', status: 'new' });
    await createTestMessage({ name: 'Bob', status: 'read' });
    await createTestMessage({ name: 'Charlie', status: 'replied' });

    // Test filtering by 'new' status
    const newMessages = await getContactMessages({ status: 'new' });
    expect(newMessages).toHaveLength(1);
    expect(newMessages[0].name).toEqual('Alice');
    expect(newMessages[0].status).toEqual('new');

    // Test filtering by 'read' status
    const readMessages = await getContactMessages({ status: 'read' });
    expect(readMessages).toHaveLength(1);
    expect(readMessages[0].name).toEqual('Bob');
    expect(readMessages[0].status).toEqual('read');

    // Test filtering by 'replied' status
    const repliedMessages = await getContactMessages({ status: 'replied' });
    expect(repliedMessages).toHaveLength(1);
    expect(repliedMessages[0].name).toEqual('Charlie');
    expect(repliedMessages[0].status).toEqual('replied');
  });

  it('should apply pagination correctly', async () => {
    // Create 5 test messages
    const messages = [];
    for (let i = 0; i < 5; i++) {
      messages.push(await createTestMessage({ 
        name: `User ${i}`, 
        subject: `Message ${i}` 
      }));
    }

    // Test with limit
    const firstPage = await getContactMessages({ limit: 2 });
    expect(firstPage).toHaveLength(2);

    // Test with offset
    const secondPage = await getContactMessages({ limit: 2, offset: 2 });
    expect(secondPage).toHaveLength(2);
    
    // Ensure different results
    expect(firstPage[0].id).not.toEqual(secondPage[0].id);

    // Test with limit larger than available records
    const allMessages = await getContactMessages({ limit: 10 });
    expect(allMessages).toHaveLength(5);
  });

  it('should sort messages by creation date in descending order', async () => {
    // Create messages with small delays to ensure different timestamps
    const firstMessage = await createTestMessage({ name: 'First', subject: 'First message' });
    await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
    
    const secondMessage = await createTestMessage({ name: 'Second', subject: 'Second message' });
    await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
    
    const thirdMessage = await createTestMessage({ name: 'Third', subject: 'Third message' });

    const result = await getContactMessages();

    expect(result).toHaveLength(3);
    // Should be ordered by created_at DESC (newest first)
    expect(result[0].name).toEqual('Third');
    expect(result[1].name).toEqual('Second');
    expect(result[2].name).toEqual('First');

    // Verify timestamps are actually in descending order
    expect(result[0].created_at >= result[1].created_at).toBe(true);
    expect(result[1].created_at >= result[2].created_at).toBe(true);
  });

  it('should handle empty database', async () => {
    const result = await getContactMessages();
    
    expect(result).toHaveLength(0);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should combine status filtering with pagination', async () => {
    // Create multiple messages with different statuses
    await createTestMessage({ name: 'New1', status: 'new' });
    await createTestMessage({ name: 'New2', status: 'new' });
    await createTestMessage({ name: 'New3', status: 'new' });
    await createTestMessage({ name: 'Read1', status: 'read' });
    await createTestMessage({ name: 'Read2', status: 'read' });

    // Get first page of 'new' messages
    const result = await getContactMessages({ 
      status: 'new', 
      limit: 2, 
      offset: 0 
    });

    expect(result).toHaveLength(2);
    result.forEach(message => {
      expect(message.status).toEqual('new');
      expect(['New1', 'New2', 'New3']).toContain(message.name);
    });
  });

  it('should preserve all message fields and handle nullable fields', async () => {
    // Create a message with attachment
    const messageWithAttachment = await createTestMessage({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test message content',
      attachment: 'https://example.com/attachment.pdf',
      status: 'read'
    });

    // Create a message without attachment
    const messageWithoutAttachment = await createTestMessage({
      name: 'Another User',
      attachment: null
    });

    const result = await getContactMessages();

    expect(result).toHaveLength(2);
    
    // Check message with attachment
    const messageWithAtt = result.find(m => m.attachment !== null);
    expect(messageWithAtt).toBeDefined();
    expect(messageWithAtt?.attachment).toEqual('https://example.com/attachment.pdf');
    expect(messageWithAtt?.name).toEqual('Test User');
    expect(messageWithAtt?.email).toEqual('test@example.com');
    expect(messageWithAtt?.status).toEqual('read');

    // Check message without attachment
    const messageWithoutAtt = result.find(m => m.attachment === null);
    expect(messageWithoutAtt).toBeDefined();
    expect(messageWithoutAtt?.attachment).toBeNull();
    expect(messageWithoutAtt?.name).toEqual('Another User');
  });

  it('should validate and parse input parameters with defaults', async () => {
    // Create test data
    await createTestMessage({ status: 'new' });
    await createTestMessage({ status: 'read' });

    // Test with no parameters (should use defaults)
    const resultWithDefaults = await getContactMessages();
    expect(resultWithDefaults).toHaveLength(2);

    // Test with empty object (should use defaults)
    const resultWithEmptyObject = await getContactMessages({});
    expect(resultWithEmptyObject).toHaveLength(2);

    // Test with partial parameters
    const resultWithStatus = await getContactMessages({ status: 'new' });
    expect(resultWithStatus).toHaveLength(1);
    expect(resultWithStatus[0].status).toEqual('new');
  });

  it('should handle invalid input gracefully', async () => {
    // Create test data
    await createTestMessage({ status: 'new' });

    // Test that the handler throws on invalid status
    await expect(getContactMessages({ status: 'invalid' as any })).rejects.toThrow();

    // Test that negative values are rejected
    await expect(getContactMessages({ limit: -1 })).rejects.toThrow();
    await expect(getContactMessages({ offset: -1 })).rejects.toThrow();

    // Test that zero limit is rejected
    await expect(getContactMessages({ limit: 0 })).rejects.toThrow();
  });
});