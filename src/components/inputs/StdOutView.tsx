import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import {useTaskNotifyMapStore} from "@/stores/taskNotifyMapStore.ts";
// import { shallow } from 'zustand/shallow';
import {useEffect, useRef} from "react";
import { format } from 'date-fns';
import {TaskNotify} from "@/bindings.ts";
function StdOutView() {
  const listRef = useRef<List>(null);
  const task_id = "hello.py";
  const taskNotifyMap = useTaskNotifyMapStore((state) => state.taskNotifyMap);
  let taskNotifyList = taskNotifyMap[task_id] ?? [];

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(taskNotifyList.length - 1, 'end');
    }
  }, [taskNotifyList.length]);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          className="stdout-view"
          height={height}
          itemCount={taskNotifyList.length || 0}
          itemSize={28}
          width={width}
          ref={listRef}
        >
          {({ index, style }) => {
            const taskNotify: TaskNotify = taskNotifyList[index]
            const date = new Date(taskNotify.tm_sec * 1000);
            const date_fmt = format(date, "yyyy-MM-dd HH:mm:ss");
            const color = taskNotify.task_status == "Stderr" ? "red" : undefined;
            return taskNotify ? (
              <div className="line" key={index} style={{...style, color}}>
                {date_fmt.split(" ")[1]} : {taskNotify.message}
              </div>
            ) : null
          }}
        </List>
      )}
    </AutoSizer>
  )
}

export default StdOutView;