import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { AlertTriangle, Home } from 'lucide-react'
import { Link } from 'react-router'

const NotFoundPage = () => {
  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <Card className='w-full max-w-md text-center'>
        <CardHeader>
          <div className='mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4'>
            <AlertTriangle className='w-8 h-8 text-destructive' />
          </div>
          <CardTitle className='text-2xl'>404 - Không tìm thấy trang</CardTitle>
          <CardDescription>Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className='w-full'>
            <Link to='/'>
              <Home className='w-4 h-4 mr-2' />
              Về trang chủ
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotFoundPage
