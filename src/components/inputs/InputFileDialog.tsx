import {open} from "@tauri-apps/plugin-dialog";
import {faFolder} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome";
type Prop = {
  onChange: (value: string) => void;
  value: string
}
function InputFileDialog ({value, onChange}: Prop) {
  async function selectFile() {
    const selected = await open({
      directory: false,
      multiple: false,
    });
    if (typeof selected === 'string') {
      onChange(selected);
    }
  }

  return (
    <div className="input-box">
      <div className="input">
        <input type="text" value={value} readOnly></input>
      </div>
      <div className="icon">
        <Icon icon={faFolder} onClick={selectFile} />
      </div>
    </div>
  )
}

export default InputFileDialog;