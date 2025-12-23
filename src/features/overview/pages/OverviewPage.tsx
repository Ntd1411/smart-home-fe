
import { useGetOverviewQuery } from "../api/OverviewService"
import { QuickStatusCards } from "../components/QuickStatusCards"
// import { RoomList } from "../components/RoomList"
import  QuickActions  from "../components/QuickActions"
import { Home, Loader2, RefreshCw } from "lucide-react"
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { RoomList } from "../components/RoomList"
import { useOverviewRealtime } from "../hooks/useRooms"
import { withPermissionGuard } from "@/shared/components/WithPermissionGuard"
import { PERMISSIONS } from "@/shared/constants/permissions"


const OverviewPageComponent = () => {

  useOverviewRealtime();
  // useEffect(() => {
  //   if (data?.rooms?.length ) {
  //     setRooms([...data.rooms]); 
  //   }
  // }, [data, setRooms]);
  const { data, isLoading, isFetching, refetch } = useGetOverviewQuery()

  



  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-center text-muted-foreground">Không có dữ liệu</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Thông tin tổng quan ngôi nhà
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>
      </CardHeader>
    </Card>

      {/* Trạng thái nhanh */}
      <QuickStatusCards quickStatus={data.quickStatus} />

      {/* Điều khiển nhanh */}
      <QuickActions />

      {/* Danh sách thiết bị hoặc phòng: có thể custom thêm nếu muốn */}
      <RoomList rooms={data.rooms} />
    </div>
  )
}

export const OverviewPage = withPermissionGuard(
  OverviewPageComponent,
  PERMISSIONS.OVERVIEW.OVERVIEW
)
