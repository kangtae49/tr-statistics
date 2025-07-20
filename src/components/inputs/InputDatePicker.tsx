import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useState} from "react";
import { ko } from 'date-fns/locale';

function InputDatePicker () {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  return (
    <DatePicker
      withPortal
      showIcon
      locale={ko}
      showYearDropdown
      showMonthDropdown
      scrollableYearDropdown
      scrollableMonthYearDropdown
      popperPlacement="bottom-start"
      todayButton="오늘"
      dateFormat="yyyy-MM-dd"
      selected={selectedDate}
      onChange={(date) => setSelectedDate(date)}
    />
  );
}

export default InputDatePicker;