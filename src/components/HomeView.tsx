import {ApiError, Result, commands, Setting} from "@/bindings"
import { useSettingStore } from "@/stores/settingStore";
import {useEffect} from "react";
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faCirclePlay, faCircleStop } from '@fortawesome/free-solid-svg-icons'
import {listen} from "@tauri-apps/api/event";

function HomeView() {
  const setting = useSettingStore((state) => state.setting);
  const setSetting = useSettingStore((state) => state.setSetting);

  const clickStart = ({py_file}: { py_file: string }) => {
    commands.runShell({
      task_id: py_file,
      shell_type: "Python",
      args: [py_file],
    }).then(() => {
      console.log("ok")
    }).catch(e => {
      console.log(e)
    })
  }
  const clickStop = ({py_file}: { py_file: string }) => {
    commands.stopShell(py_file).then(() => {
      console.log("ok")
    }).catch(e => {
      console.log(e)
    })
  }

  useEffect(() => {
    commands.getSetting().then((setting: Result<Setting, ApiError>) => {
      if (setting.status === "ok") {
        setSetting(setting.data);
      }
    })
  }, [])

  useEffect(() => {
    const unlisten = listen<string>('shell_task', (event) => {
      console.log(event.payload);
    });
    return () => {
      unlisten.then((f) => f());
    };

  }, []);

  return (
    <div className="shell-container">
      <div className="tasks">
        { setting?.script_files && setting?.script_files.map((file, idx) => {
          const py_file = file;
          return (
            <div key={idx} className="task">
              <div className="label">{py_file}</div>
              <div className="icon" onClick={()=> clickStart({py_file})}>
                <Icon icon={faCirclePlay} />
              </div>
              <div className="icon" onClick={() => clickStop({py_file})}>
                <Icon icon={faCircleStop} />
              </div>
            </div>
          )
        })}
      </div>
      <div className="stdout">
        stdout
      </div>
    </div>
  )
}

export default HomeView;