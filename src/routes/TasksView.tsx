import {ApiError, Result, commands, Setting, ScriptInfo} from "@/bindings.ts"
import { useSettingStore } from "@/stores/settingStore.ts";
import {useEffect} from "react";
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faCirclePlay, faCircleStop } from '@fortawesome/free-solid-svg-icons'
import {listen} from "@tauri-apps/api/event";
import { open, save } from '@tauri-apps/plugin-dialog';
import InputDatePicker from "@/components/inputs/InputDatePicker.tsx";
import InputYearPicker from "@/components/inputs/InputYearPicker.tsx";
import InputMonthPicker from "@/components/inputs/InputMonthPicker.tsx";
import InputDateTimePicker from "@/components/inputs/InputDateTimePicker.tsx";
import TaskArgsView from "@/components/inputs/TaskArgsView.tsx";
import StdOutView from "@/components/inputs/StdOutView.tsx";

function TasksView() {
  const setting = useSettingStore((state) => state.setting);
  const setSetting = useSettingStore((state) => state.setSetting);


  async function selectFile() {
    const selected = await open({
      directory: false,
      multiple: false,
    });

    console.log("selectFile", selected);
  }

  async function selectFolder() {
    const selected = await open({
      directory: true,
      multiple: false,
    });

    console.log("selectFolder", selected);
  }

  async function selectSaveFile() {
    const selected = await save({
      filters: [
        {
          name: 'My Filter',
          extensions: ['csv', 'tsv', 'json'],
        },
      ],
    });

    console.log("selectSaveFile", selected);
  }

  const clickStart = ({scriptInfo}: { scriptInfo: ScriptInfo }) => {
    commands.runShell({
      task_id: scriptInfo.script,
      shell_type: "Python",
      args: [scriptInfo.script],
    }).then(() => {
      console.log("ok")
    }).catch(e => {
      console.log(e)
    })
  }
  const clickStop = ({scriptInfo}: { scriptInfo: ScriptInfo }) => {
    commands.stopShell(scriptInfo.script).then(() => {
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
        { setting?.script_files && setting?.script_files.map((scriptInfo: ScriptInfo, idx) => {
          return (
            <div key={idx}>
              <div className="task">
                <div className="label">{scriptInfo.name}</div>
                <div className="icon" onClick={()=> clickStart({scriptInfo})}>
                  <Icon icon={faCirclePlay} />
                </div>
                <div className="icon" onClick={() => clickStop({scriptInfo})}>
                  <Icon icon={faCircleStop} />
                </div>
              </div>
              <div className="args">
                <TaskArgsView args={scriptInfo.args} />
              </div>
            </div>
          )
        })}
      </div>
      <div className="stdout">
        <StdOutView />
      </div>
      <div>
        <div onClick={()=>selectFile()}>selectFile</div>
        <div onClick={()=>selectFolder()}>selectFolder</div>
        <div onClick={()=>selectSaveFile()}>selectSaveFile</div>
        <div>
          <label htmlFor="datetime">날짜 및 시간 선택:</label>
          <input type="datetime-local" id="datetime" name="datetime"/>
        </div>
        <div>
          <label htmlFor="date">날짜 선택:</label>
          <input type="date" id="date" name="date"/>
        </div>
        <div>
          <label htmlFor="time">시간 선택:</label>
          <input type="time" id="time" name="date"/>
        </div>
        <div>
          <label htmlFor="month">월 선택:</label>
          <input type="month" id="month" name="date"/>
        </div>
        <div>
          <label htmlFor="week">주 선택:</label>
          <input type="week" id="week" name="week"/>
        </div>
        <div>
          <InputYearPicker />
          <InputDatePicker />
          <InputMonthPicker />
          <InputDateTimePicker />
        </div>
      </div>
    </div>
  )
}

export default TasksView;