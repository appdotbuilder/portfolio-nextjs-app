import { type CreateExperienceInput, type Experience } from '../schema';

export async function createExperience(input: CreateExperienceInput): Promise<Experience> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is creating a new work experience record and persisting it in the database.
    // Used for adding job positions, internships, and work history to the portfolio timeline.
    return Promise.resolve({
        id: 'temp-exp-id',
        company: input.company,
        position: input.position,
        location: input.location,
        start_date: input.start_date,
        end_date: input.end_date,
        description: input.description,
        current: input.current,
        company_logo: input.company_logo
    } as Experience);
}