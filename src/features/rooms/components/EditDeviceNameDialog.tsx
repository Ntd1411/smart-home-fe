import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface EditDeviceNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string;
  currentName: string;
  onSubmit: (deviceId: string, newName: string) => Promise<void>;
  isLoading?: boolean;
}

export const EditDeviceNameDialog = ({
  open,
  onOpenChange,
  deviceId,
  currentName,
  onSubmit,
  isLoading = false,
}: EditDeviceNameDialogProps) => {
  const [newName, setNewName] = useState(currentName);

  useEffect(() => {
    setNewName(currentName);
  }, [currentName, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName.trim()) {
      return;
    }

    await onSubmit(deviceId, newName.trim());
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setNewName(currentName);
    }
    onOpenChange(newOpen);
  };

  const isFormValid = newName.trim() && newName.trim() !== currentName;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa tên thiết bị</DialogTitle>
          <DialogDescription>
            Nhập tên mới cho thiết bị
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deviceName">Tên thiết bị</Label>
              <Input
                id="deviceName"
                placeholder="Nhập tên thiết bị"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={isLoading}
                required
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={!isFormValid || isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
