
import { useGetOverviewQuery } from "../api/OverviewService"
import { QuickStatusCards } from "../components/QuickStatusCards"
// import { RoomList } from "../components/RoomList"
import  QuickActions  from "../components/QuickActions"
import { Home, Loader2, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { RoomList } from "../components/RoomList"
import { useOverviewRealtime } from "../hooks/useRooms"
import { withPermissionGuard } from "@/shared/components/WithPermissionGuard"
import { PERMISSIONS } from "@/shared/constants/permissions"
import { FormPageLayout } from "@/shared/components/FormPageLayout"
import { useGetHomeInfoSettings } from "@/features/setting/api/SettingService"


const OverviewPageComponent = () => {

  useOverviewRealtime();
  // useEffect(() => {
  //   if (data?.rooms?.length ) {
  //     setRooms([...data.rooms]); 
  //   }
  // }, [data, setRooms]);
  const { data, isLoading, isFetching, refetch } = useGetOverviewQuery()

  const { data: homeInfo } = useGetHomeInfoSettings()

  



  if (isLoading || isFetching) {
    return (
      <FormPageLayout
        title="Tổng quan"
        description="Trạng thái nhanh và điều khiển ngôi nhà"
      >
        <div className="flex items-center justify-center h-40">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      </FormPageLayout>
    )
  }

  if (!data) {
    return (
      <FormPageLayout
        title="Tổng quan"
        description="Trạng thái nhanh và điều khiển ngôi nhà"
      >
        <div className="p-6">
          <p className="text-center text-muted-foreground">Không có dữ liệu</p>
        </div>
      </FormPageLayout>
    )
  }

  return (
    <FormPageLayout title="Tổng quan" description="Trạng thái nhanh và điều khiển ngôi nhà">
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
          <CardContent>
            <div className="grid gap-1 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground">Tên nhà:</span>
                <span>{homeInfo?.homeName?.trim() ? homeInfo.homeName : "--"}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground">Địa chỉ:</span>
                <span>{homeInfo?.homeAddress?.trim() ? homeInfo.homeAddress : "--"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trạng thái nhanh */}
        <QuickStatusCards quickStatus={data.quickStatus} />

        {/* Điều khiển nhanh */}
        <QuickActions />

        {/* Danh sách thiết bị hoặc phòng: có thể custom thêm nếu muốn */}
        <RoomList rooms={data.rooms} />
      </div>
    </FormPageLayout>
  )
}

export const OverviewPage = withPermissionGuard(
  OverviewPageComponent,
  PERMISSIONS.OVERVIEW.OVERVIEW
)
