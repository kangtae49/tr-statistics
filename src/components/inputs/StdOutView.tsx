import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import {useTaskNotifyListStore} from "@/stores/taskNotifyListStore.ts";
import {useEffect, useRef} from "react";
import { format } from 'date-fns';
function StdOutView() {
  const taskNotifyList = useTaskNotifyListStore((state) => state.taskNotifyList);
  const listRef = useRef<List>(null);

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
            const taskNotify = taskNotifyList[index]
            return taskNotify ? (
              <div key={index} style={style}>
                [{index}] : {taskNotify.message}
              </div>
            ) : null
          }}
        </List>
      )}
    </AutoSizer>
  )
}

export default StdOutView;