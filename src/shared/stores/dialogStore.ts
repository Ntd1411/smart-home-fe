import { create } from "zustand"

interface DialogState {
  open: boolean
  type: "confirm" | "custom" | null
  title?: string
  description?: string
  loading: boolean
  onConfirm?: () => Promise<void> | void
  content?: React.ReactNode

  openDialog: (
    params: Omit<DialogState, "open" | "openDialog" | "closeDialog" | "setLoading">
  ) => void

  closeDialog: () => void
  setLoading: (loading: boolean) => void
}

export const useDialogStore = create<DialogState>((set) => ({
  open: false,
  type: null,
  title: "",
  description: "",
  loading: false,
  onConfirm: undefined,
  content: undefined,

  openDialog: (params) => {
    set({
      ...params,
      open: true,
      loading: false // reset loading when open new dialog
    })
  },

  closeDialog: () => {
    set({
      open: false,
      type: null,
      title: "",
      description: "",
      loading: false,
      onConfirm: undefined,
      content: undefined
    })
  },

  setLoading: (loading) => set({ loading })
}))
