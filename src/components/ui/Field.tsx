import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

const control = 'field';

type FieldShellProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
};

export function FieldShell({ id, label, error, hint, optional, className, children }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-[13px] font-medium text-fg">
        {label}
        {optional && <span className="text-xs font-normal text-mute">Optional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-mute">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type InputFieldProps = Omit<FieldShellProps, 'children'> & ComponentPropsWithoutRef<'input'>;

export function InputField({ id, label, error, hint, optional, className, ...input }: InputFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={clsx(control, 'h-12')}
        {...input}
      />
    </FieldShell>
  );
}

type SelectFieldProps = Omit<FieldShellProps, 'children'> &
  ComponentPropsWithoutRef<'select'> & { options: readonly string[]; placeholder?: string };

export function SelectField({ id, label, error, hint, optional, className, options, placeholder, ...select }: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <select
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={clsx(control, 'h-12 appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%2016%2016%27%3E%3Cpath%20d%3D%27M4%206l4%204%204-4%27%20fill%3D%27none%27%20stroke%3D%27%231a1a1a%27%20stroke-width%3D%271.5%27%2F%3E%3C%2Fsvg%3E")] bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10')}
        {...select}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

type TextareaFieldProps = Omit<FieldShellProps, 'children'> & ComponentPropsWithoutRef<'textarea'>;

export function TextareaField({ id, label, error, hint, optional, className, ...textarea }: TextareaFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <textarea
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        className={clsx(control, 'min-h-24')}
        {...textarea}
      />
    </FieldShell>
  );
}
