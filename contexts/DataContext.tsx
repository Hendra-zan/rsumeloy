"use client";

import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { DataContextType, TableName, TableRow } from '../types';
import { AuthContext } from './AuthContext';
import { collectionConfigs } from '../lib/collectionConfig';

export const DataContext = createContext<DataContextType | null>(null);

interface DataProviderProps {
  children: React.ReactNode;
}

// This provider is now primarily used for the admin dashboard's client-side state management.
// Public pages fetch data on the server.
export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const supabase = authContext?.supabase;

  const [data, setData] = useState<Omit<DataContextType, 'loading' | 'missingTables' | 'refetch' | 'addItem' | 'updateItem' | 'deleteItem'>>({
    doctors: [],
    services: [],
    facilities: [],
    articles: [],
    partners: [],
    vacancies: [],
    info: [],
    ai_assistant_config: [],
    page_notes: [],
  });
  const [loading, setLoading] = useState(true);
  const [missingTables, setMissingTables] = useState<TableName[]>([]);

  const tableNames = Object.keys(collectionConfigs) as TableName[];

  const refetch = useCallback(async (tableName: TableName) => {
    if (!supabase) return;

    try {
        const columns = tableName === 'ai_assistant_config' ? 'id, base_prompt' : '*';
        
        let query = supabase.from(tableName).select(columns);

        if (tableName === 'doctors') {
          query = query.order('display_order', { ascending: true, nullsFirst: false });
        }

        const { data: refreshedData, error } = await query;
        
        if (error) {
            const isTableNotFoundError = 
                error.code === '42P01' ||
                (error.message && error.message.includes('does not exist')) ||
                (error.message && error.message.includes("Could not find the table"));

            if (isTableNotFoundError) {
                 console.warn(`[Data Context] Table "${tableName}" not found. This is expected if the feature isn't set up. Using empty data as a fallback.`);
                 setMissingTables(prev => prev.includes(tableName) ? prev : [...prev, tableName]);
            } else {
                console.error(`[Data Context] Error fetching ${tableName}: ${error.message}`);
            }
            setData(prevData => ({ ...prevData, [tableName]: [] }));
        } else {
            setData(prevData => ({ ...prevData, [tableName]: refreshedData || [] }));
            setMissingTables(prev => prev.filter(t => t !== tableName));
        }
    } catch (e) {
        const error = e as Error;
        console.error(`[Data Context] A critical error occurred while fetching table "${tableName}":`, error.message);
        setData(prevData => ({ ...prevData, [tableName]: [] }));
    }
  }, [supabase]);

  useEffect(() => {
    let shouldFetch = true;

    // Only fetch all data if a supabase client is present (e.g., in admin context)
    if (supabase && authContext?.session) {
      setLoading(true);
      setMissingTables([]); 

      // Initial data fetch
      Promise.allSettled(tableNames.map(name => refetch(name)))
        .finally(() => {
          if (shouldFetch) {
            setLoading(false);
          }
        });
    } else {
      setLoading(false);
    }

    // Reset state when component unmounts or session changes
    return () => {
      shouldFetch = false;
      setData({
        doctors: [],
        services: [],
        facilities: [],
        articles: [],
        partners: [],
        vacancies: [],
        info: [],
        ai_assistant_config: [],
        page_notes: [],
      });
      setLoading(true);
      setMissingTables([]);
    };
  }, [authContext?.session]); // Remove supabase and refetch from dependencies

  // Listen for window focus events to refresh data
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleFocus = () => {
      if (supabase && authContext?.session) {
        // Refresh all data when window gains focus
        tableNames.forEach(name => refetch(name));
      }
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [supabase, authContext?.session, refetch, tableNames]);
  
  const addItem = async <T extends TableName>(tableName: T, item: Partial<TableRow<T>>): Promise<any> => {
    if (!supabase) throw new Error("Supabase client is not available");
    const { data: response, error } = await (supabase.from(tableName) as any).insert([item]).select();
    if (error) throw error;
    await refetch(tableName); 
    return response?.[0];
  };
  
  const updateItem = async <T extends TableName>(tableName: T, id: string, itemUpdates: Partial<TableRow<T>>): Promise<any> => {
    if (!supabase) throw new Error("Supabase client is not available");
    const { data: response, error } = await (supabase.from(tableName) as any).update(itemUpdates).eq('id', id).select();
    if (error) throw error;
    await refetch(tableName);
    return response?.[0];
  };

  const deleteItem = async (tableName: TableName, id: string): Promise<any> => {
    if (!supabase) throw new Error("Supabase client is not available");
    const { error } = await (supabase.from(tableName) as any).delete().eq('id', id);
    if (error) throw error;
    await refetch(tableName); 
    return { id: id };
  };

  const value: DataContextType = {
    ...data,
    loading,
    missingTables,
    refetch,
    addItem,
    updateItem,
    deleteItem,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};