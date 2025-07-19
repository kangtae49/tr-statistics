import { commands } from "@/bindings"
function HomeView() {
  const clickStart = () => {
    commands.runShell({
      task_id: "111",
      shell_type: "Python",
      args: ["hello.py"],
    }).then(() => {
      console.log("ok")
    }).catch(e => {
      console.log(e)
    })
  }
  const clickStop = () => {
    commands.stopShell("111").then(() => {
      console.log("ok")
    }).catch(e => {
      console.log(e)
    })
  }

  return (
    <div>
      <div onClick={()=> clickStart()}>start</div>
      <div onClick={() => clickStop()}>stop</div>
    </div>
  )
}

export default HomeView;