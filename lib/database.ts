import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { AppError } from './errors';
import { logger } from './monitoring';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export async function executeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  errorMessage: string
): Promise<T> {
  try {
    const { data, error } = await queryFn();
    
    if (error) {
      logger.error('Database query error:', {
        error,
        message: errorMessage
      });
      
      throw new AppError(
        500,
        errorMessage,
        true,
        'DATABASE_ERROR'
      );
    }
    
    if (!data) {
      throw new AppError(
        404,
        'Data not found',
        true,
        'NOT_FOUND'
      );
    }
    
    return data;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    logger.error('Unexpected database error:', { error });
    throw new AppError(
      500,
      'An unexpected error occurred while accessing the database',
      true,
      'DATABASE_ERROR'
    );
  }
}

// Example usage:
export async function getDoctorById(id: string) {
  return executeQuery(
    async () => {
      const result = await supabase
        .from('doctors')
        .select('*')
        .eq('id', id)
        .single();
      return result;
    },
    `Failed to fetch doctor with ID: ${id}`
  );
}