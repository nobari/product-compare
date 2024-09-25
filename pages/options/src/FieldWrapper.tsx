import type React from 'react'

interface FieldWrapperProps {
  title: string
  children: React.ReactNode
  row?: boolean
  description?: string
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
}

const FieldWrapper = ({
  title,
  description,
  children,
  row,
  onSubmit,
}: FieldWrapperProps) => {
  return (
    <form
      data-row={row || undefined}
      className="flex flex-col gap-1 data-[row]:items-center my-4 data-[row]:flex-row data-[row]:justify-between data-[row]:gap-2"
      onSubmit={onSubmit}
    >
      <div>
        <label className="text-xl">
          {title}
        </label>
        {description && (
          <p className="text-sm mt-2">
            {description}
          </p>
        )}
      </div>
      <div className="mt-2">{children}</div>
    </form>
  )
}

export default FieldWrapper
