import { db } from '../db';
import { certificatesTable } from '../db/schema';
import { type CreateCertificateInput, type Certificate } from '../schema';
import { randomUUID } from 'crypto';

export const createCertificate = async (input: CreateCertificateInput): Promise<Certificate> => {
  try {
    // Insert certificate record
    const result = await db.insert(certificatesTable)
      .values({
        id: randomUUID(),
        title: input.title,
        issuer: input.issuer,
        issue_date: input.issue_date,
        credential_id: input.credential_id,
        verify_url: input.verify_url,
        image: input.image,
        category: input.category
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Certificate creation failed:', error);
    throw error;
  }
};