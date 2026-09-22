import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'

interface ShellProps {
  id: string
  label: string
  hint?: string
  error?: string
  children: ReactNode
}

function FieldShell({ id, label, hint, error, children }: ShellProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-[15px] font-medium text-ink">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-0.5 text-sm text-muted">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

const control =
  'w-full rounded-xl border bg-white px-4 py-3 text-[16px] text-ink placeholder:text-faint transition duration-150 focus:outline-none focus:ring-4'

function tone(error?: string) {
  return error
    ? 'border-danger focus:border-danger focus:ring-danger/15'
    : 'border-line hover:border-ink/25 focus:border-lens focus:ring-lens/15'
}

function describedBy(id: string, hint?: string, error?: string) {
  const ids = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ')
  return ids || undefined
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
}

export function TextField({ label, hint, error, id, className = '', ...rest }: TextFieldProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error}>
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, hint, error)}
        className={`${control} ${tone(error)} ${className}`}
        {...rest}
      />
    </FieldShell>
  )
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
  error?: string
}

export function TextAreaField({ label, hint, error, id, className = '', ...rest }: TextAreaFieldProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error}>
      <textarea
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, hint, error)}
        className={`${control} ${tone(error)} resize-y leading-relaxed ${className}`}
        {...rest}
      />
    </FieldShell>
  )
}
