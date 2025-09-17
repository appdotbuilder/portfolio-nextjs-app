import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { type CreateUserInput } from '../schema';
import { getUser } from '../handlers/get_user';

// Test user data
const testUser1: CreateUserInput = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  bio: 'Full-stack developer with 5 years of experience',
  avatar: 'https://example.com/avatar.jpg',
  resume: 'https://example.com/resume.pdf',
  social_links: {
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    twitter: 'https://twitter.com/johndoe'
  }
};

const testUser2: CreateUserInput = {
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  bio: 'Frontend developer specializing in React',
  avatar: null,
  resume: null,
  social_links: null
};

describe('getUser', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return null when no users exist', async () => {
    const result = await getUser();
    expect(result).toBeNull();
  });

  it('should return the first user when one exists', async () => {
    // Insert test user
    await db.insert(usersTable)
      .values({
        id: 'user-1',
        name: testUser1.name,
        email: testUser1.email,
        bio: testUser1.bio,
        avatar: testUser1.avatar,
        resume: testUser1.resume,
        social_links: testUser1.social_links
      })
      .execute();

    const result = await getUser();

    expect(result).not.toBeNull();
    expect(result!.id).toEqual('user-1');
    expect(result!.name).toEqual('John Doe');
    expect(result!.email).toEqual('john.doe@example.com');
    expect(result!.bio).toEqual('Full-stack developer with 5 years of experience');
    expect(result!.avatar).toEqual('https://example.com/avatar.jpg');
    expect(result!.resume).toEqual('https://example.com/resume.pdf');
    expect(result!.social_links).toEqual({
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      twitter: 'https://twitter.com/johndoe'
    });
    expect(result!.created_at).toBeInstanceOf(Date);
  });

  it('should handle users with null fields correctly', async () => {
    // Insert user with some null fields
    await db.insert(usersTable)
      .values({
        id: 'user-2',
        name: testUser2.name,
        email: testUser2.email,
        bio: testUser2.bio,
        avatar: testUser2.avatar,
        resume: testUser2.resume,
        social_links: testUser2.social_links
      })
      .execute();

    const result = await getUser();

    expect(result).not.toBeNull();
    expect(result!.id).toEqual('user-2');
    expect(result!.name).toEqual('Jane Smith');
    expect(result!.email).toEqual('jane.smith@example.com');
    expect(result!.bio).toEqual('Frontend developer specializing in React');
    expect(result!.avatar).toBeNull();
    expect(result!.resume).toBeNull();
    expect(result!.social_links).toBeNull();
    expect(result!.created_at).toBeInstanceOf(Date);
  });

  it('should return the earliest user when multiple users exist', async () => {
    // Insert first user (should be returned as it's the earliest)
    await db.insert(usersTable)
      .values({
        id: 'user-1',
        name: testUser1.name,
        email: testUser1.email,
        bio: testUser1.bio,
        avatar: testUser1.avatar,
        resume: testUser1.resume,
        social_links: testUser1.social_links
      })
      .execute();

    // Wait a moment to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Insert second user
    await db.insert(usersTable)
      .values({
        id: 'user-2',
        name: testUser2.name,
        email: testUser2.email,
        bio: testUser2.bio,
        avatar: testUser2.avatar,
        resume: testUser2.resume,
        social_links: testUser2.social_links
      })
      .execute();

    const result = await getUser();

    // Should return the first user (earliest by creation date)
    expect(result).not.toBeNull();
    expect(result!.id).toEqual('user-1');
    expect(result!.name).toEqual('John Doe');
    expect(result!.email).toEqual('john.doe@example.com');
  });

  it('should verify user is saved correctly in database', async () => {
    // Insert test user
    await db.insert(usersTable)
      .values({
        id: 'user-test',
        name: testUser1.name,
        email: testUser1.email,
        bio: testUser1.bio,
        avatar: testUser1.avatar,
        resume: testUser1.resume,
        social_links: testUser1.social_links
      })
      .execute();

    const result = await getUser();

    // Verify the user exists in the database by querying directly
    const dbUsers = await db.select()
      .from(usersTable)
      .execute();

    expect(dbUsers).toHaveLength(1);
    expect(dbUsers[0].id).toEqual('user-test');
    expect(dbUsers[0].name).toEqual(testUser1.name);
    expect(dbUsers[0].email).toEqual(testUser1.email);
    
    // Verify handler returned the same data
    expect(result!.id).toEqual(dbUsers[0].id);
    expect(result!.name).toEqual(dbUsers[0].name);
    expect(result!.email).toEqual(dbUsers[0].email);
  });
});