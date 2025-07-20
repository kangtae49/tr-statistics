import {ScriptArg} from "@/bindings.ts";

type Prop = {
  args: ScriptArg[]
}
function TaskArgsView({args}: Prop) {
  return (
    <div>
      { args.map((arg, idx) => {
        return (
          <div key={idx}>
            <div>{arg.name}</div>
            {renderScriptArg(arg)}
          </div>
        )
      })}
    </div>
  )
}

function renderScriptArg(arg: ScriptArg) {
  switch (arg.arg_type) {
    case "String":
      return <div>{arg.arg_type}</div>;
    default:
      return <div></div>;
  }
}

export default TaskArgsView;