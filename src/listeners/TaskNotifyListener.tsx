import {useEffect} from "react";
import {listen} from "@tauri-apps/api/event";
import {TaskNotify} from "@/bindings";
import {useTaskNotifyListStore} from "@/stores/taskNotifyListStore.ts";

function TaskNotifyListener() {
  const setTaskNotifyList = useTaskNotifyListStore((state) => state.setTaskNotifyList);
  const addTaskNotify = useTaskNotifyListStore((state) => state.addTaskNotify);

  useEffect(() => {
    const unlisten = listen<TaskNotify>('shell_task', (event) => {
      let taskNotify = event.payload;
      if (taskNotify.task_status === "Begin") {
        setTaskNotifyList([taskNotify])
      } else {
        addTaskNotify(taskNotify);
      }
    });
    return () => {
      unlisten.then((f) => f());
    };

  }, [])
  return null;
}

export default TaskNotifyListener;