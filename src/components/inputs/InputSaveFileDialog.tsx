import {save} from "@tauri-apps/plugin-dialog";
import {faFolder} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome";
type Prop = {
  onChange: (value: string) => void;
  value: string
}
function InputSaveFileDialog ({value, onChange}: Prop) {
  async function selectSaveFile() {
    const selected = await save({
      filters: [
        {
          name: 'My Filter',
          extensions: ['csv', 'tsv', 'json'],
        },
      ],
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
        <Icon icon={faFolder} onClick={selectSaveFile} />
      </div>
    </div>
  )
}

export default InputSaveFileDialog;