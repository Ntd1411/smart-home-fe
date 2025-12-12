import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Button } from '@/shared/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'

interface FormPageLayoutProps {
  title: string
  description: string
  isLoading?: boolean
  notFoundMessage?: string
  children: ReactNode
}

export const FormPageLayout = ({
  title,
  description,
  isLoading = false,
  notFoundMessage,
  children
}: FormPageLayoutProps) => {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-8 absolute inset-0 bg-background/80 backdrop-blur-sm z-10'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (notFoundMessage) {
    return (
      <div className='text-center py-8'>
        <p className='text-muted-foreground'>{notFoundMessage}</p>
        <Button className='mt-4' onClick={() => navigate(-1)}>
          <ArrowLeft className='h-4 w-4' />
          Quay lại
        </Button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='icon' onClick={() => navigate(-1)}>
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>{title}</h1>
          <p className='text-muted-foreground'>{description}</p>
        </div>
      </div>

      {children}
    </div>
  )
}
