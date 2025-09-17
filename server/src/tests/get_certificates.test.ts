import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { certificatesTable } from '../db/schema';
import { getCertificates } from '../handlers/get_certificates';
// Generate simple test IDs
const createId = () => `test-cert-${Math.random().toString(36).substr(2, 9)}`;

describe('getCertificates', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  const createTestCertificate = async (overrides = {}) => {
    const defaultCert = {
      id: createId(),
      title: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      issue_date: new Date('2024-01-15'),
      credential_id: 'AWS-123456',
      verify_url: 'https://aws.amazon.com/verify/123456',
      image: 'https://example.com/aws-cert.png',
      category: 'Cloud Computing'
    };

    const cert = { ...defaultCert, ...overrides };
    
    await db.insert(certificatesTable)
      .values(cert)
      .execute();
    
    return cert;
  };

  it('should return empty array when no certificates exist', async () => {
    const result = await getCertificates();

    expect(result).toHaveLength(0);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should fetch all certificates without filters', async () => {
    // Create test certificates
    const cert1 = await createTestCertificate({
      title: 'AWS Solutions Architect',
      issuer: 'Amazon',
      category: 'Cloud Computing'
    });
    const cert2 = await createTestCertificate({
      title: 'Google Cloud Professional',
      issuer: 'Google',
      category: 'Cloud Computing'
    });

    const result = await getCertificates();

    expect(result).toHaveLength(2);
    expect(result[0].title).toBeDefined();
    expect(result[0].issuer).toBeDefined();
    expect(result[0].issue_date).toBeInstanceOf(Date);
    expect(result[0].category).toBeDefined();
  });

  it('should filter certificates by category', async () => {
    // Create certificates with different categories
    await createTestCertificate({
      title: 'AWS Solutions Architect',
      category: 'Cloud Computing'
    });
    await createTestCertificate({
      title: 'React Developer',
      category: 'Frontend Development'
    });
    await createTestCertificate({
      title: 'Azure Fundamentals',
      category: 'Cloud Computing'
    });

    const result = await getCertificates({ category: 'Cloud Computing' });

    expect(result).toHaveLength(2);
    result.forEach(cert => {
      expect(cert.category).toBe('Cloud Computing');
    });
  });

  it('should return empty array for non-existent category', async () => {
    await createTestCertificate({
      title: 'AWS Solutions Architect',
      category: 'Cloud Computing'
    });

    const result = await getCertificates({ category: 'Non-existent Category' });

    expect(result).toHaveLength(0);
  });

  it('should sort certificates by issue date (newest first)', async () => {
    // Create certificates with different dates
    await createTestCertificate({
      title: 'Older Certificate',
      issue_date: new Date('2023-01-01')
    });
    await createTestCertificate({
      title: 'Newer Certificate',
      issue_date: new Date('2024-01-01')
    });
    await createTestCertificate({
      title: 'Newest Certificate',
      issue_date: new Date('2024-06-01')
    });

    const result = await getCertificates();

    expect(result).toHaveLength(3);
    expect(result[0].title).toBe('Newest Certificate');
    expect(result[1].title).toBe('Newer Certificate');
    expect(result[2].title).toBe('Older Certificate');

    // Verify dates are in descending order
    expect(result[0].issue_date.getTime()).toBeGreaterThan(result[1].issue_date.getTime());
    expect(result[1].issue_date.getTime()).toBeGreaterThan(result[2].issue_date.getTime());
  });

  it('should handle certificates with null optional fields', async () => {
    await createTestCertificate({
      title: 'Basic Certificate',
      issuer: 'Test Issuer',
      credential_id: null,
      verify_url: null,
      category: null
    });

    const result = await getCertificates();

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Basic Certificate');
    expect(result[0].credential_id).toBeNull();
    expect(result[0].verify_url).toBeNull();
    expect(result[0].category).toBeNull();
  });

  it('should return all required certificate fields', async () => {
    const testCert = await createTestCertificate();

    const result = await getCertificates();

    expect(result).toHaveLength(1);
    const cert = result[0];
    
    expect(cert.id).toBeDefined();
    expect(cert.title).toBe(testCert.title);
    expect(cert.issuer).toBe(testCert.issuer);
    expect(cert.issue_date).toBeInstanceOf(Date);
    expect(cert.credential_id).toBe(testCert.credential_id);
    expect(cert.verify_url).toBe(testCert.verify_url);
    expect(cert.image).toBe(testCert.image);
    expect(cert.category).toBe(testCert.category);
  });

  it('should filter and sort simultaneously', async () => {
    // Create certificates with mixed categories and dates
    await createTestCertificate({
      title: 'Old Cloud Cert',
      category: 'Cloud Computing',
      issue_date: new Date('2023-01-01')
    });
    await createTestCertificate({
      title: 'New Frontend Cert',
      category: 'Frontend Development',
      issue_date: new Date('2024-01-01')
    });
    await createTestCertificate({
      title: 'New Cloud Cert',
      category: 'Cloud Computing',
      issue_date: new Date('2024-06-01')
    });

    const result = await getCertificates({ category: 'Cloud Computing' });

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('New Cloud Cert'); // Newest first
    expect(result[1].title).toBe('Old Cloud Cert');
    result.forEach(cert => {
      expect(cert.category).toBe('Cloud Computing');
    });
  });
});