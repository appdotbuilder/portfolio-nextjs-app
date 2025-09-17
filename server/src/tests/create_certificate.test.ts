import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { certificatesTable } from '../db/schema';
import { type CreateCertificateInput } from '../schema';
import { createCertificate } from '../handlers/create_certificate';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateCertificateInput = {
  title: 'AWS Solutions Architect',
  issuer: 'Amazon Web Services',
  issue_date: new Date('2024-01-15'),
  credential_id: 'AWS-SAA-12345',
  verify_url: 'https://www.credly.com/badges/test-badge',
  image: 'https://example.com/aws-cert.png',
  category: 'Cloud Computing'
};

describe('createCertificate', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a certificate', async () => {
    const result = await createCertificate(testInput);

    // Basic field validation
    expect(result.title).toEqual('AWS Solutions Architect');
    expect(result.issuer).toEqual('Amazon Web Services');
    expect(result.issue_date).toEqual(new Date('2024-01-15'));
    expect(result.credential_id).toEqual('AWS-SAA-12345');
    expect(result.verify_url).toEqual('https://www.credly.com/badges/test-badge');
    expect(result.image).toEqual('https://example.com/aws-cert.png');
    expect(result.category).toEqual('Cloud Computing');
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('string');
  });

  it('should save certificate to database', async () => {
    const result = await createCertificate(testInput);

    // Query using proper drizzle syntax
    const certificates = await db.select()
      .from(certificatesTable)
      .where(eq(certificatesTable.id, result.id))
      .execute();

    expect(certificates).toHaveLength(1);
    expect(certificates[0].title).toEqual('AWS Solutions Architect');
    expect(certificates[0].issuer).toEqual('Amazon Web Services');
    expect(certificates[0].issue_date).toEqual(new Date('2024-01-15'));
    expect(certificates[0].credential_id).toEqual('AWS-SAA-12345');
    expect(certificates[0].verify_url).toEqual('https://www.credly.com/badges/test-badge');
    expect(certificates[0].image).toEqual('https://example.com/aws-cert.png');
    expect(certificates[0].category).toEqual('Cloud Computing');
  });

  it('should create certificate with minimal required fields', async () => {
    const minimalInput: CreateCertificateInput = {
      title: 'Basic Certification',
      issuer: 'Test Institute',
      issue_date: new Date('2023-12-01'),
      credential_id: null,
      verify_url: null,
      image: 'https://example.com/basic-cert.png',
      category: null
    };

    const result = await createCertificate(minimalInput);

    expect(result.title).toEqual('Basic Certification');
    expect(result.issuer).toEqual('Test Institute');
    expect(result.issue_date).toEqual(new Date('2023-12-01'));
    expect(result.credential_id).toBeNull();
    expect(result.verify_url).toBeNull();
    expect(result.image).toEqual('https://example.com/basic-cert.png');
    expect(result.category).toBeNull();
    expect(result.id).toBeDefined();
  });

  it('should create multiple certificates with unique IDs', async () => {
    const input1: CreateCertificateInput = {
      ...testInput,
      title: 'Certificate 1'
    };

    const input2: CreateCertificateInput = {
      ...testInput,
      title: 'Certificate 2',
      issuer: 'Different Issuer'
    };

    const result1 = await createCertificate(input1);
    const result2 = await createCertificate(input2);

    expect(result1.id).not.toEqual(result2.id);
    expect(result1.title).toEqual('Certificate 1');
    expect(result2.title).toEqual('Certificate 2');
    expect(result2.issuer).toEqual('Different Issuer');

    // Verify both are in database
    const allCertificates = await db.select()
      .from(certificatesTable)
      .execute();

    expect(allCertificates).toHaveLength(2);
  });

  it('should handle special characters in certificate data', async () => {
    const specialInput: CreateCertificateInput = {
      title: 'Développeur Web Certifié™',
      issuer: 'École Supérieure & Institut',
      issue_date: new Date('2024-03-15'),
      credential_id: 'CERT-2024/03/15-Special#123',
      verify_url: 'https://example.com/verify?id=special%20cert',
      image: 'https://example.com/special-cert.jpg',
      category: 'Web Development & Design'
    };

    const result = await createCertificate(specialInput);

    expect(result.title).toEqual('Développeur Web Certifié™');
    expect(result.issuer).toEqual('École Supérieure & Institut');
    expect(result.credential_id).toEqual('CERT-2024/03/15-Special#123');
    expect(result.verify_url).toEqual('https://example.com/verify?id=special%20cert');
    expect(result.category).toEqual('Web Development & Design');

    // Verify it's properly stored in database
    const stored = await db.select()
      .from(certificatesTable)
      .where(eq(certificatesTable.id, result.id))
      .execute();

    expect(stored[0].title).toEqual('Développeur Web Certifié™');
    expect(stored[0].issuer).toEqual('École Supérieure & Institut');
  });
});