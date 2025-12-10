import { useEffect, useState } from "react"
import { cn } from "../lib/utils"
import { useDialogStore } from "../stores/dialogStore"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "./ui/dialog"

const CommonDialog = () => {
  const {
    open,
    type,
    title,
    description,
    loading,
    onConfirm,
    content,
    closeDialog
  } = useDialogStore()

  const [showOverlay, setShowOverlay] = useState(false)

  useEffect(() => {
    if (open) {
      setShowOverlay(true)
    } else {
      const timer = setTimeout(() => {
        setShowOverlay(false)
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [open])

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm()
    }
    closeDialog()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={closeDialog} modal={false}>
        <DialogContent
          className="overflow-y-auto"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>

          {type === "custom" && content}

          {type === "confirm" && (
            <DialogFooter>
              <Button onClick={handleConfirm} disabled={loading}>
                {loading ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {showOverlay && (
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/50 transition-opacity duration-150 ease-in-out",
            open ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </>
  )
}

export default CommonDialog
