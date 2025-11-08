// src/components/ConnectionTest.tsx (or place inside an existing component)
import React, { useState, useEffect } from 'react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Use the env names your bundler provides (Vite: VITE_*, CRA: REACT_APP_*)
const SUPABASE_URL = (import.meta.env?.VITE_SUPABASE_URL as string) || (process.env.REACT_APP_SUPABASE_URL as string);
const SUPABASE_ANON_KEY = (import.meta.env?.VITE_SUPABASE_ANON_KEY as string) || (process.env.REACT_APP_SUPABASE_ANON_KEY as string);

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase env vars (SUPABASE_URL / SUPABASE_ANON_KEY).');
}

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ConnectionTest = () => {
  const [status, setStatus] = useState<string>('Checking...');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log("Attempting to connect to Supabase...");
        // Perform a simple, non-destructive operation
        // Using a common table like 'users' or checking for any table
        // Let's try fetching the current timestamp from the database as a minimal check
        const { data, error } = await supabase.rpc('now'); // 'now()' is a standard PostgreSQL function

        if (error) {
            console.error("RPC 'now()' error:", error);
            // Fallback: Try a simple select on a table you are confident exists and is accessible
            // Replace 'users' with a table name you know exists.
            const { data: tableData, error: tableError } = await supabase
              .from('users')
              .select('user_id') // Select minimal data
              .limit(1); // Limit to 1 row

             if (tableError) {
                console.error("Table 'users' select error:", tableError);
                setStatus('Connection Failed');
                setDetails(`Error: ${tableError.message || tableError}`);
             } else {
                 console.log("'users' table check successful:", tableData);
                 setStatus('Connected (Checked users table)');
                 setDetails('Successfully queried the users table.');
             }
        } else {
            console.log("'now()' RPC successful:", data);
            setStatus('Connected (Checked database time)');
            setDetails(`Database time: ${data ? new Date(data as string).toISOString() : 'N/A'}`);
        }
      } catch (err: any) {
        console.error("Unexpected error during connection test:", err);
        setStatus('Connection Failed');
        setDetails(`Unexpected Error: ${err?.message || err}`);
      }
    };

    checkConnection();
  }, []); // Run only once on component mount

  return (
    <div className="p-4 m-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Supabase Connection Test</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-1"><strong>Status:</strong> {status}</p>
      {details && <p className="text-gray-600 dark:text-gray-300"><strong>Details:</strong> {details}</p>}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Check the browser console for detailed logs.
      </p>
    </div>
  );
};

export default ConnectionTest;