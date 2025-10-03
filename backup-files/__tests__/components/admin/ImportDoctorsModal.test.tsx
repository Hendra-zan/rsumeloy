import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImportDoctorsModal } from '../../../components/admin/ImportDoctorsModal';
import { useData } from '../../../hooks/useContextHooks';
import '@testing-library/jest-dom';

// Mock useData hook
jest.mock('../../../hooks/useContextHooks', () => ({
  useData: jest.fn(),
}));

// Mock ArrayBuffer for Excel file
const mockArrayBuffer = new ArrayBuffer(8);

// Mock implementation for File
class MockFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;

  constructor(bits: Array<any>, name: string, options = {}) {
    this.name = name;
    this.size = 1024;
    this.type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    this.lastModified = Date.now();
  }

  arrayBuffer() {
    return Promise.resolve(mockArrayBuffer);
  }
}

// @ts-ignore - Override global File
global.File = MockFile;

// Mock ExcelJS
jest.mock('exceljs', () => {
  return {
    Workbook: jest.fn().mockImplementation(() => ({
      xlsx: {
        load: jest.fn().mockResolvedValue({
          getWorksheet: jest.fn().mockReturnValue({
            getRow: jest.fn().mockReturnValue({
              values: [null, 'name', 'specialty', 'status', 'schedule', 'notes']
            }),
            getRows: jest.fn().mockReturnValue([
              {
                values: [null, 'Dr. John Doe', 'Umum', 'Praktek', 'Senin-Jumat', 'Notes 1'],
              },
              {
                values: [null, 'Dr. Jane Smith', 'Gigi', 'Praktek', 'Selasa-Kamis', 'Notes 2'],
              },
            ]),
            rowCount: 3
          })
        })
      }
    }))
  };
});

describe('ImportDoctorsModal', () => {
  const mockAddItem = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useData as jest.Mock).mockReturnValue({ addItem: mockAddItem });
  });

  it('renders correctly when open', () => {
    render(<ImportDoctorsModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('Import Data Dokter')).toBeInTheDocument();
    expect(screen.getByText('Kolom wajib: name, specialty, status (Praktek/Tutup)')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<ImportDoctorsModal isOpen={false} onClose={mockOnClose} />);
    
    expect(screen.queryByText('Import Data Dokter')).not.toBeInTheDocument();
  });

  it('handles file selection', () => {
    render(<ImportDoctorsModal isOpen={true} onClose={mockOnClose} />);
    
    const file = new File(['dummy content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const input = screen.getByLabelText(/klik untuk upload/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(screen.getByText('File terpilih: test.xlsx')).toBeInTheDocument();
  });

  it('handles successful import', async () => {
    mockAddItem.mockResolvedValue(true);
    render(<ImportDoctorsModal isOpen={true} onClose={mockOnClose} />);
    
    const file = new File(['dummy content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const input = screen.getByLabelText(/klik untuk upload/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    const importButton = screen.getByRole('button', { name: /import data/i });
    fireEvent.click(importButton);
    
    await waitFor(() => {
      expect(mockAddItem).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Import selesai:')).toBeInTheDocument();
      expect(screen.getByText('✅ Berhasil: 2 data')).toBeInTheDocument();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('handles import failure', async () => {
    mockAddItem.mockRejectedValue(new Error('Import failed'));
    render(<ImportDoctorsModal isOpen={true} onClose={mockOnClose} />);
    
    const file = new File(['dummy content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const input = screen.getByLabelText(/klik untuk upload/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    const importButton = screen.getByRole('button', { name: /import data/i });
    fireEvent.click(importButton);
    
    await waitFor(() => {
      expect(screen.getByText(/terjadi kesalahan/i)).toBeInTheDocument();
      expect(screen.getByText('❌ Gagal: 2 data')).toBeInTheDocument();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it('validates required columns', async () => {
    // Re-mock ExcelJS with invalid headers
    jest.resetModules();
    jest.mock('exceljs', () => ({
      Workbook: jest.fn().mockImplementation(() => ({
        xlsx: {
          load: jest.fn().mockResolvedValue({
            getWorksheet: jest.fn().mockReturnValue({
              getRow: jest.fn().mockReturnValue({
                values: [null, 'invalid', 'columns', 'here']
              }),
              rowCount: 1
            })
          })
        }
      }))
    }));
    
    render(<ImportDoctorsModal isOpen={true} onClose={mockOnClose} />);
    
    const file = new File(['dummy content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const input = screen.getByLabelText(/klik untuk upload/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    const importButton = screen.getByRole('button', { name: /import data/i });
    fireEvent.click(importButton);
    
    await waitFor(() => {
      expect(screen.getByText(/kolom yang diperlukan tidak ditemukan/i)).toBeInTheDocument();
      expect(mockAddItem).not.toHaveBeenCalled();
    });
  });

  it('handles invalid file type', () => {
    render(<ImportDoctorsModal isOpen={true} onClose={mockOnClose} />);
    
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/klik untuk upload/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(screen.getByText(/hanya file excel \(.xlsx\) yang diperbolehkan/i)).toBeInTheDocument();
  });

  it('toggles example visibility', () => {
    render(<ImportDoctorsModal isOpen={true} onClose={mockOnClose} />);
    
    const toggleButton = screen.getByText(/lihat contoh/i);
    fireEvent.click(toggleButton);
    
    expect(screen.getByText(/sembunyikan contoh/i)).toBeInTheDocument();
    expect(screen.getByText(/format excel/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByText(/sembunyikan contoh/i));
    expect(screen.getByText(/lihat contoh/i)).toBeInTheDocument();
    expect(screen.queryByText(/format excel/i)).not.toBeInTheDocument();
  });

  it('closes modal when clicking close button', () => {
    render(<ImportDoctorsModal isOpen={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByRole('button', { name: /batal/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});