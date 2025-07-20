import { create } from "zustand"
import { TaskNotify } from "@/bindings"

export interface TaskNotifyListStore {
  taskNotifyList: TaskNotify []
  setTaskNotifyList: (taskNotifyList: TaskNotify []) => void
  addTaskNotify: (taskNotify: TaskNotify) => void
}

export const useTaskNotifyListStore =
  create<TaskNotifyListStore>((set) => ({
    taskNotifyList: [],
    setTaskNotifyList: (taskNotifyList: TaskNotify[]) =>
      set(() => ({ taskNotifyList })),
    addTaskNotify: (taskNotify: TaskNotify) =>
      set((state) => ({
        taskNotifyList: [...state.taskNotifyList, taskNotify]
      })),
  }))
