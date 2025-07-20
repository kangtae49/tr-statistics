import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useState} from "react";
import { ko } from 'date-fns/locale';

function InputDateTimePicker () {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(new Date());
  return (
    <DatePicker
      withPortal
      showIcon
      locale={ko}
      showTimeSelect
      showYearDropdown
      showMonthDropdown
      scrollableYearDropdown
      scrollableMonthYearDropdown
      popperPlacement="bottom-start"
      todayButton="오늘"
      dateFormat="yyyy-MM-dd HH:mm"
      selected={selectedDateTime}
      onChange={(date) => setSelectedDateTime(date)}
    />
  );
}

export default InputDateTimePicker;
