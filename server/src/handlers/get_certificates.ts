import { db } from '../db';
import { certificatesTable } from '../db/schema';
import { type Certificate } from '../schema';
import { eq, desc } from 'drizzle-orm';

export interface GetCertificatesFilters {
  category?: string;
}

export const getCertificates = async (filters?: GetCertificatesFilters): Promise<Certificate[]> => {
  try {
    // Build query with proper type handling
    const baseQuery = db.select().from(certificatesTable);

    let query;
    if (filters?.category) {
      query = baseQuery
        .where(eq(certificatesTable.category, filters.category))
        .orderBy(desc(certificatesTable.issue_date));
    } else {
      query = baseQuery
        .orderBy(desc(certificatesTable.issue_date));
    }

    const results = await query.execute();

    // Return certificates with proper type conversion
    return results.map(cert => ({
      ...cert,
      issue_date: new Date(cert.issue_date)
    }));
  } catch (error) {
    console.error('Get certificates failed:', error);
    throw error;
  }
};