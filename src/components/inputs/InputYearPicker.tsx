import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useState} from "react";

function InputYearPicker () {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  return (
    <DatePicker
      withPortal
      showIcon
      popperPlacement="bottom-start"
      showYearPicker
      dateFormat="yyyy"
      todayButton="오늘"
      selected={selectedDate}
      onChange={(date) => setSelectedDate(date)}
    />
  );
}

export default InputYearPicker;