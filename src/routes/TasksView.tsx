import {ApiError, Result, commands, Setting, ScriptInfo, ShellJob} from "@/bindings.ts"
import { useSettingStore } from "@/stores/settingStore.ts";
import {useEffect, useState} from "react";
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faCirclePlay, faCircleStop } from '@fortawesome/free-solid-svg-icons'
import {listen} from "@tauri-apps/api/event";
import StdOutView from "@/components/inputs/StdOutView.tsx";
import InputFileDialog from "@/components/inputs/InputFileDialog.tsx";
import InputSaveFileDialog from "@/components/inputs/InputSaveFileDialog.tsx";
import InputFolderDialog from "@/components/inputs/InputFolderDialog.tsx";
import GraphBarChart from "@/components/graph/GraphBarChart.tsx";
import AutoSizer from "react-virtualized-auto-sizer";

function TasksView() {
  const setting = useSettingStore((state) => state.setting);
  const setSetting = useSettingStore((state) => state.setSetting);
  // const [inputFile, setInputFile] = useState<string>("");
  // const [inputFolder, setInputFolder] = useState<string>("");
  const [inputSaveFile, setInputSaveFile] = useState<string>("");

  const clickStart = ({scriptInfo}: { scriptInfo: ScriptInfo }) => {
    let args = [scriptInfo.script];
    if (inputSaveFile) {
      args.push(inputSaveFile);
    }
    let shellJob: ShellJob = {
      task_id: scriptInfo.script,
      shell_type: "Python",
      args: args
    };
    commands.runShell(shellJob).then(() => {
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
  const scriptInfo: ScriptInfo = {
    name: "Run Analysis",
    description: "",
    shell_type: "Python",
    script: "hello.py",
    args: []
  };
  return (
    <div className="shell-container">
      <div className="shell-body">
        <div className="command">
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
            <div>SaveFile: <InputSaveFileDialog onChange={setInputSaveFile} value={inputSaveFile} /></div>
          </div>
        </div>
        <div className="graph">
              <GraphBarChart />
        </div>
      </div>
      <div className="stdout">
        <StdOutView />
      </div>
    </div>
  )
}

export default TasksView;