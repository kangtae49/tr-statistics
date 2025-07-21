import {useEffect} from "react";
import {listen} from "@tauri-apps/api/event";
import {TaskNotify} from "@/bindings";
import {useTaskNotifyMapStore} from "@/stores/taskNotifyMapStore.ts";

function TaskNotifyListener() {
  const setTaskNotifyList = useTaskNotifyMapStore((state) => state.setTaskNotifyList);
  const addTaskNotify = useTaskNotifyMapStore((state) => state.addTaskNotify);

  useEffect(() => {
    const unlisten = listen<TaskNotify>('shell_task', (event) => {
      let taskNotify = event.payload;
      if (taskNotify.task_status === "Begin") {
        setTaskNotifyList(taskNotify.task_id, [taskNotify])
      } else {
        addTaskNotify(taskNotify.task_id, taskNotify);
      }
    });
    return () => {
      unlisten.then((f) => f());
    };

  }, [])
  return null;
}

export default TaskNotifyListener;