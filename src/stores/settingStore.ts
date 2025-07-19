import { create } from "zustand"
import { Setting } from "@/bindings"

export interface SettingStore {
  setting: Setting | undefined
  setSetting: (setting?: Setting) => void
}

export const useSettingStore = create<SettingStore>((set) => ({
  setting: undefined,
  setSetting: (setting?: Setting) => set(() => ({ setting }))
}))
