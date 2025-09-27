import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

/**
 * Input Component
 * 
 * A form input component with label, error states, and helper text.
 * Follows HarvestLink design system with proper accessibility.
 * 
 * @example
 * // Basic input with label
 * <Input
 *   label="Email Address"
 *   type="email"
 *   placeholder="Enter your email"
 *   required
 * />
 * 
 * @example
 * // Input with error state
 * <Input
 *   label="Password"
 *   type="password"
 *   error="Password must be at least 8 characters"
 * />
 * 
 * @example
 * // Input with helper text
 * <Input
 *   label="Farm Name"
 *   helperText="This will be displayed on your public profile"
 * />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  required,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;

  const inputClasses = hasError
    ? `input-error ${className}`
    : `input ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-ink"
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        id={inputId}
        className={inputClasses}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
        }
        {...props}
      />
      
      {error && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-danger"
          role="alert"
        >
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p
          id={`${inputId}-helper`}
          className="text-sm text-graphite"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

/**
 * Textarea Component
 * 
 * A form textarea component with label, error states, and helper text.
 * 
 * @example
 * <Textarea
 *   label="Product Description"
 *   placeholder="Describe your product..."
 *   rows={4}
 *   required
 * />
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  required,
  className = '',
  id,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;

  const textareaClasses = hasError
    ? `input-error resize-none ${className}`
    : `input resize-none ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-ink"
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={textareaId}
        className={textareaClasses}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
        }
        {...props}
      />
      
      {error && (
        <p
          id={`${textareaId}-error`}
          className="text-sm text-danger"
          role="alert"
        >
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p
          id={`${textareaId}-helper`}
          className="text-sm text-graphite"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  options: { value: string; label: string }[];
}

/**
 * Select Component
 * 
 * A form select component with label, error states, and helper text.
 * 
 * @example
 * <Select
 *   label="Product Category"
 *   options={[
 *     { value: 'vegetables', label: 'Vegetables' },
 *     { value: 'fruits', label: 'Fruits' },
 *   ]}
 *   required
 * />
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  required,
  options,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;

  const selectClasses = hasError
    ? `input-error ${className}`
    : `input ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-ink"
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        id={selectId}
        className={selectClasses}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
        }
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p
          id={`${selectId}-error`}
          className="text-sm text-danger"
          role="alert"
        >
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p
          id={`${selectId}-helper`}
          className="text-sm text-graphite"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
