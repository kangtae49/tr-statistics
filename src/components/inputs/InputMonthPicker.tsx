import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useState} from "react";
import { ko } from 'date-fns/locale';

function InputMonthPicker () {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  return (
    <DatePicker
      withPortal
      showIcon
      locale={ko}
      showMonthYearPicker
      // showYearDropdown
      // scrollableYearDropdown
      popperPlacement="bottom-start"
      todayButton="오늘"
      dateFormat="yyyy-MM"
      selected={selectedDate}
      onChange={(date) => setSelectedDate(date)}
    />
  );
}

export default InputMonthPicker;