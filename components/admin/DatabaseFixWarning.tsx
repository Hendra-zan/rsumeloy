
import React, { useMemo, useState } from 'react';
import { TableName } from '../../types';
import { generateFixSql } from '../../lib/sqlGenerator';
import { Button } from '../ui/Button';
import { Check, Link2 } from '../icons';

interface DatabaseFixWarningProps {
  missingTables: TableName[];
}

const DatabaseFixWarning: React.FC<DatabaseFixWarningProps> = ({ missingTables }) => {
  const [isCopied, setIsCopied] = useState(false);
  const fixSqlScript = useMemo(() => generateFixSql(missingTables), [missingTables]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fixSqlScript).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="p-4 mb-6 bg-red-100 border border-red-300 text-red-800 rounded-lg animate-fade-in">
      <h3 className="font-bold text-lg">Peringatan Konfigurasi Database</h3>
      <p className="mt-1 text-sm">
        Aplikasi mendeteksi bahwa tabel berikut tidak ada di database Anda: <strong>{missingTables.join(', ')}</strong>.
      </p>
      <p className="mt-1 text-sm">
        Fitur yang bergantung pada tabel-tabel ini tidak akan berfungsi sampai tabel tersebut dibuat.
      </p>
      <div className="mt-4">
        <h4 className="font-semibold text-sm">Solusi Cepat:</h4>
        <p className="text-sm mt-1">
          Salin dan jalankan skrip SQL di bawah ini di <strong>SQL Editor</strong> Supabase Anda untuk membuat semua tabel yang hilang beserta kebijakan keamanannya.
        </p>
        <div className="relative mt-2">
            <pre className="p-3 text-xs bg-red-50 text-red-900 border border-red-200 rounded-md overflow-x-auto">
                <code>{fixSqlScript}</code>
            </pre>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 text-red-800 hover:bg-red-200"
                onClick={handleCopy}
            >
                {isCopied ? <Check className="h-4 w-4 text-green-700" /> : <Link2 className="h-4 w-4" />}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default DatabaseFixWarning;
