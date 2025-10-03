
"use client";

import React from 'react';
import { Button } from './Button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from './Card';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    // Handler untuk modal backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        // Jika yang diklik adalah backdrop (bukan modal content)
        if (e.target === e.currentTarget) {
            return; // Tidak melakukan apa-apa, mencegah auto-close
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in"
             onClick={(e) => {
                 // Don't close modal when clicking overlay
                 e.preventDefault();
                 e.stopPropagation();
             }}>
            <Card className="w-full max-w-md">
                <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">{message}</p></CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Batal</Button>
                    <Button variant="destructive" onClick={onConfirm}>Hapus</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ConfirmationModal;
