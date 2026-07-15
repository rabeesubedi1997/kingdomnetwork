import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

interface FieldConfig {
  name: string
  label: string
  type?: 'text' | 'email' | 'number' | 'password' | 'textarea' | 'select' | 'url'
  placeholder?: string
  options?: { value: string; label: string }[]
  rules?: Record<string, unknown>
  className?: string
}

interface AdminFormProps {
  fields: FieldConfig[]
  onSubmit: (data: any) => Promise<void>
  defaultValues?: Record<string, any>
  isSubmitting?: boolean
  submitLabel?: string
}

export const AdminForm: React.FC<AdminFormProps> = ({
  fields,
  onSubmit,
  defaultValues,
  isSubmitting = false,
  submitLabel = 'Save',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field) => {
        const error = errors[field.name]?.message as string | undefined

        if (field.type === 'textarea') {
          return (
            <Textarea
              key={field.name}
              label={field.label}
              placeholder={field.placeholder}
              error={error}
              {...register(field.name, field.rules || {})}
            />
          )
        }

        if (field.type === 'select' && field.options) {
          return (
            <Select
              key={field.name}
              label={field.label}
              options={field.options}
              placeholder={field.placeholder}
              error={error}
              {...register(field.name, field.rules || {})}
            />
          )
        }

        return (
          <Input
            key={field.name}
            label={field.label}
            type={field.type || 'text'}
            placeholder={field.placeholder}
            error={error}
            {...register(field.name, field.rules || {})}
          />
        )
      })}

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
