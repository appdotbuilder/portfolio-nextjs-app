import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { type CreateUserInput } from '../schema';
import { createUser } from '../handlers/create_user';
import { eq } from 'drizzle-orm';

// Test inputs with various scenarios
const basicUserInput: CreateUserInput = {
  name: 'John Doe',
  email: 'john@example.com',
  bio: 'Software developer with passion for web technologies',
  avatar: 'https://example.com/avatar.jpg',
  resume: 'https://example.com/resume.pdf',
  social_links: {
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe'
  }
};

const minimalUserInput: CreateUserInput = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  bio: null,
  avatar: null,
  resume: null,
  social_links: null
};

const userWithEmptySocialLinks: CreateUserInput = {
  name: 'Bob Wilson',
  email: 'bob@example.com',
  bio: 'Frontend developer',
  avatar: 'https://example.com/bob-avatar.jpg',
  resume: null,
  social_links: {}
};

describe('createUser', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a user with all fields populated', async () => {
    const result = await createUser(basicUserInput);

    // Basic field validation
    expect(result.name).toEqual('John Doe');
    expect(result.email).toEqual('john@example.com');
    expect(result.bio).toEqual('Software developer with passion for web technologies');
    expect(result.avatar).toEqual('https://example.com/avatar.jpg');
    expect(result.resume).toEqual('https://example.com/resume.pdf');
    expect(result.social_links).toEqual({
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe'
    });
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('string');
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a user with minimal required fields', async () => {
    const result = await createUser(minimalUserInput);

    expect(result.name).toEqual('Jane Smith');
    expect(result.email).toEqual('jane@example.com');
    expect(result.bio).toBeNull();
    expect(result.avatar).toBeNull();
    expect(result.resume).toBeNull();
    expect(result.social_links).toBeNull();
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a user with empty social links object', async () => {
    const result = await createUser(userWithEmptySocialLinks);

    expect(result.name).toEqual('Bob Wilson');
    expect(result.email).toEqual('bob@example.com');
    expect(result.social_links).toEqual({});
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save user to database', async () => {
    const result = await createUser(basicUserInput);

    // Query the database to verify the user was saved
    const users = await db.select()
      .from(usersTable)
      .where(eq(usersTable.id, result.id))
      .execute();

    expect(users).toHaveLength(1);
    const savedUser = users[0];
    
    expect(savedUser.name).toEqual('John Doe');
    expect(savedUser.email).toEqual('john@example.com');
    expect(savedUser.bio).toEqual('Software developer with passion for web technologies');
    expect(savedUser.avatar).toEqual('https://example.com/avatar.jpg');
    expect(savedUser.resume).toEqual('https://example.com/resume.pdf');
    expect(savedUser.social_links).toEqual({
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe'
    });
    expect(savedUser.created_at).toBeInstanceOf(Date);
  });

  it('should generate unique IDs for different users', async () => {
    const user1 = await createUser(basicUserInput);
    
    // Create a different user
    const user2Input: CreateUserInput = {
      ...minimalUserInput,
      email: 'different@example.com'
    };
    const user2 = await createUser(user2Input);

    expect(user1.id).toBeDefined();
    expect(user2.id).toBeDefined();
    expect(user1.id).not.toEqual(user2.id);
    
    // Verify both users exist in database
    const users = await db.select().from(usersTable).execute();
    expect(users).toHaveLength(2);
  });

  it('should handle JSON social_links correctly', async () => {
    const userWithComplexSocialLinks: CreateUserInput = {
      name: 'Tech Expert',
      email: 'expert@example.com',
      bio: null,
      avatar: null,
      resume: null,
      social_links: {
        github: 'https://github.com/expert',
        linkedin: 'https://linkedin.com/in/expert',
        twitter: 'https://twitter.com/expert',
        website: 'https://expert.dev',
        youtube: 'https://youtube.com/expert',
        portfolio: 'https://portfolio.expert.dev'
      }
    };

    const result = await createUser(userWithComplexSocialLinks);

    expect(result.social_links).toEqual({
      github: 'https://github.com/expert',
      linkedin: 'https://linkedin.com/in/expert',
      twitter: 'https://twitter.com/expert',
      website: 'https://expert.dev',
      youtube: 'https://youtube.com/expert',
      portfolio: 'https://portfolio.expert.dev'
    });

    // Verify it's stored correctly in the database
    const users = await db.select()
      .from(usersTable)
      .where(eq(usersTable.id, result.id))
      .execute();

    expect(users[0].social_links).toEqual({
      github: 'https://github.com/expert',
      linkedin: 'https://linkedin.com/in/expert',
      twitter: 'https://twitter.com/expert',
      website: 'https://expert.dev',
      youtube: 'https://youtube.com/expert',
      portfolio: 'https://portfolio.expert.dev'
    });
  });

  it('should reject duplicate email addresses', async () => {
    // Create first user
    await createUser(basicUserInput);

    // Try to create another user with same email
    const duplicateEmailUser: CreateUserInput = {
      name: 'Different Name',
      email: 'john@example.com', // Same email as first user
      bio: null,
      avatar: null,
      resume: null,
      social_links: null
    };

    await expect(createUser(duplicateEmailUser)).rejects.toThrow(/duplicate key|unique constraint/i);
  });
});