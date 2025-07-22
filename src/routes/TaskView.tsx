import {ApiError, commands, Result, ScriptInfo, Setting, ShellJob} from "@/bindings.ts"
import {useSettingStore} from "@/stores/settingStore.ts";
import {useEffect, useState} from "react";
import {FontAwesomeIcon as Icon} from '@fortawesome/react-fontawesome'
import {faCirclePlay, faCircleStop} from '@fortawesome/free-solid-svg-icons'
import {listen} from "@tauri-apps/api/event";
import StdOutView from "@/components/inputs/StdOutView.tsx";
import InputSaveFileDialog from "@/components/inputs/InputSaveFileDialog.tsx";
import GraphBarChart from "@/components/graph/GraphBarChart.tsx";


const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "월별 매출",
    },
  },
};

function TaskView() {
  const setting = useSettingStore((state) => state.setting);
  const setSetting = useSettingStore((state) => state.setSetting);
  // const [inputFile, setInputFile] = useState<string>("");
  // const [inputFolder, setInputFolder] = useState<string>("");
  const [saveFile, setSaveFile] = useState<string>("");
  const [outputFile, setOutputFile] = useState<FileInfo | null>(null);
  const [graphData, setGraphData] = useState<object>({
    labels: [],
    datasets: [
      {
        label: "2025년",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  });

  function setOutputFileInfo(saveFile: string) {
    commands.readFileInfo(saveFile)
      .then((res) => {
        if (res.status === "ok") {
          let fileInfo = res.data;
          setOutputFile(fileInfo);
        }
      })
  }

  const clickStart = ({scriptInfo}: { scriptInfo: ScriptInfo }) => {
    let args = [scriptInfo.script];
    if (saveFile) {
      args.push(saveFile);
    }
    let shellJob: ShellJob = {
      task_id: scriptInfo.script,
      shell_type: "Python",
      args: args
    };
    commands.runShell(shellJob).then(() => {
      console.log("ok")
      setOutputFileInfo(saveFile);
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
    if (outputFile) {
      commands.readFile(outputFile.path).then((res) => {
        if(res.status == 'ok') {
          const graphData = makeGraphData(res.data);
          setGraphData(graphData);
        }
      })
    }
  }, [outputFile]);

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
            <div>SaveFile: <InputSaveFileDialog onChange={setSaveFile} value={saveFile} /></div>
          </div>
        </div>
        <div className="graph">
              <GraphBarChart options={options} data={graphData} />
        </div>
      </div>
      <div className="stdout">
        <StdOutView />
      </div>
    </div>
  )
}

export default TaskView;




function makeGraphData(tsv: string) {
  const tsvData = tsv.split("\n")
    .filter(line => line.trim() !== "")
    .map(line => {
      const [k,v] = line.split("\t");
      return {
        key: k,
        value: Number(v),
      }
    });
  console.log(tsvData);
  return {
    labels: tsvData.map(obj => obj.key),
    datasets: [
      {
        label: "2025년",
        data: tsvData.map(obj => obj.value),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  }
}
