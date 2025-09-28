import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Bold, Italic, List, Image, Link, Save, X } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  isEditing?: boolean;
  onEdit?: () => void;
  title?: string;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  onSave,
  onCancel,
  placeholder = "Start writing...",
  isEditing = false,
  onEdit,
  title,
  className = ""
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      formatText('insertImage', url);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter link URL:');
    if (url) {
      formatText('createLink', url);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  if (!isEditing) {
    return (
      <div className={`space-y-4 ${className}`}>
        {title && (
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            {onEdit && (
              <Button
                onClick={onEdit}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        )}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content || `<p class="text-gray-500 italic">${placeholder}</p>` }}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      )}
      
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-100 rounded-lg border">
        <Button
          onClick={() => formatText('bold')}
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => formatText('italic')}
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => formatText('insertUnorderedList')}
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          onClick={insertImage}
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <Image className="w-4 h-4" />
        </Button>
        <Button
          onClick={insertLink}
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <Link className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[200px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        style={{ whiteSpace: 'pre-wrap' }}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex items-center"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        )}
        {onSave && (
          <Button
            onClick={onSave}
            className="flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        )}
      </div>
    </div>
  );
};

// Import Edit3 for the non-editing mode
import { Edit3 } from 'lucide-react';
