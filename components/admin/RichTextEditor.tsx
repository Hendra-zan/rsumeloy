
"use client";

import React, { useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Bold, Italic, Underline, List, ListOrdered, Heading2, Heading3, Pilcrow } from '../icons';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    // This effect runs once on mount to set up the editor.
    useEffect(() => {
        if (editorRef.current) {
            document.execCommand('defaultParagraphSeparator', false, 'p');
            editorRef.current.innerHTML = value || '<p><br></p>';
        }
    }, []);

    // This effect synchronizes the editor if the `value` prop changes from the parent,
    // for example, when loading a different article to edit.
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value || '<p><br></p>';
        }
    }, [value]);

    const updateParentState = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleCommand = (command: string, valueArg?: string) => {
        if (editorRef.current) {
            document.execCommand(command, false, valueArg);
            editorRef.current.focus();
            updateParentState(); // Immediately update state after command
        }
    };

    const toolbarButtons = [
        { command: 'bold', icon: Bold, label: 'Bold' },
        { command: 'italic', icon: Italic, label: 'Italic' },
        { command: 'underline', icon: Underline, label: 'Underline' },
        { command: 'formatBlock', value: 'h2', icon: Heading2, label: 'Heading 2' },
        { command: 'formatBlock', value: 'h3', icon: Heading3, label: 'Heading 3' },
        { command: 'formatBlock', value: 'p', icon: Pilcrow, label: 'Paragraph' },
        { command: 'insertUnorderedList', icon: List, label: 'Bulleted List' },
        { command: 'insertOrderedList', icon: ListOrdered, label: 'Numbered List' },
    ];

    return (
        <div className="border border-input rounded-md focus-within:ring-2 focus-within:ring-ring">
            <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-secondary/50">
                {toolbarButtons.map((btn) => (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        key={btn.command + (btn.value || '')}
                        onMouseDown={(e) => { e.preventDefault(); handleCommand(btn.command, btn.value); }}
                        className="h-8 w-8"
                        aria-label={btn.label}
                    >
                        <btn.icon className="h-4 w-4" />
                    </Button>
                ))}
            </div>
            <div
                ref={editorRef}
                contentEditable
                onBlur={updateParentState}
                className="prose max-w-none p-3 min-h-[250px] focus:outline-none"
                suppressContentEditableWarning={true}
            />
        </div>
    );
};

export default RichTextEditor;
