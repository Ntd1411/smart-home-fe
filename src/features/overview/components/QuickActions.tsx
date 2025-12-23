import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Lightbulb, Lock } from "lucide-react"
import { useTurnOffAllLightsMutation, useLockAllDoorsMutation, useGetOverviewQuery } from "../api/OverviewService"
import { Loader2 } from "lucide-react"
import { ComponentWithPermissionGuard } from "@/shared/components/ComponentWithPermissionGuard"
import { PERMISSIONS } from "@/shared/constants/permissions"

export default function QuickActions() {
  const { data } = useGetOverviewQuery();
  const { mutateAsync: turnOffAllLights, isPending: isTurningOffLights } = useTurnOffAllLightsMutation();
  const { mutateAsync: toggleAllDoors, isPending: isTogglingDoors } = useLockAllDoorsMutation();

  // Đèn: nếu tất cả đèn đang tắt thì nút là "Bật tất cả đèn", ngược lại là "Tắt tất cả đèn"
  const isAllLightsOff = data?.quickStatus.lightsOn === 0;
  // Cửa: nếu có cửa đang mở thì nút là "Khóa tất cả cửa", ngược lại là "Mở tất cả cửa"
  const isAllDoorsClosed = data?.quickStatus.doorsOpen === 0;

  const handleToggleAllLights = async () => {
    const action = isAllLightsOff ? "bật" : "tắt";
    const confirmed = window.confirm(`Bạn chắc chắn muốn ${action} tất cả đèn?`);
    if (!confirmed) return;
    await turnOffAllLights(isAllLightsOff); // true: bật, false: tắt
  }

  const handleToggleAllDoors = async () => {
    const action = isAllDoorsClosed ? "mở" : "khóa";
    const confirmed = window.confirm(`Bạn chắc chắn muốn ${action} tất cả cửa?`);
    if (!confirmed) return;
    // Nếu tất cả cửa đang đóng, thì mở (true), ngược lại khóa (false)
    await toggleAllDoors(isAllDoorsClosed);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Điều khiển nhanh</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          <ComponentWithPermissionGuard permission={PERMISSIONS.OVERVIEW.LIGHTS}>
            <Button
              type="button"
              variant="outline"
              onClick={handleToggleAllLights}
              disabled={isTurningOffLights}
              className="flex-1"
            >
              {isTurningOffLights ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lightbulb className="w-4 h-4" />
              )}
              {isAllLightsOff ? "Bật tất cả đèn" : "Tắt tất cả đèn"}
            </Button>
          </ComponentWithPermissionGuard>
          <ComponentWithPermissionGuard permission={PERMISSIONS.OVERVIEW.DOORS}>
            <Button
              type="button"
              variant="outline"
              onClick={handleToggleAllDoors}
              disabled={isTogglingDoors}
              className="flex-1"
            >
              {isTogglingDoors ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {isAllDoorsClosed ? "Mở tất cả cửa" : "Khóa tất cả cửa"}
            </Button>
          </ComponentWithPermissionGuard>
        </div>
      </CardContent>
    </Card>
  )
}

