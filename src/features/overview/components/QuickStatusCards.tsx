import { Card, CardContent } from "@/shared/components/ui/card";
import { Lightbulb, Plug, DoorOpen, SquareStack } from "lucide-react";
import { type QuickStatus } from "../api/OverviewService";

interface QuickStatusCardsProps {
  quickStatus: QuickStatus;
}

export const QuickStatusCards = ({ quickStatus }: QuickStatusCardsProps) => {
  const {
    lightsOn,
    lightsTotal,
    devicesOnline,
    devicesTotal,
    doorsOpen,
    doorsTotal,
    windowsOpen,
    windowsTotal,
  } = quickStatus;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Đèn đang bật */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
              <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đèn đang bật</p>
              <p className="text-2xl font-bold">{lightsOn} / {lightsTotal}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thiết bị online */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
              <Plug className="w-6 h-6 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Thiết bị online</p>
              <p className="text-2xl font-bold">
                {devicesOnline} / {devicesTotal}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cửa đang mở */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <DoorOpen className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cửa đang mở</p>
              <p className="text-2xl font-bold">{doorsOpen} / {doorsTotal}</p>  
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cửa sổ đang mở */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <SquareStack className="w-6 h-6 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cửa sổ đang mở</p>
              <p className="text-2xl font-bold">{windowsOpen} / {windowsTotal}</p>  
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
