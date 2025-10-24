import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./index.css"; // custom styling (below)


interface DatePickerProps {
  type :string ;
  title:string;
  onSelect?: (start: Date,end:Date) => void;
}
const SearchDateBox: React.FC<DatePickerProps> = ({ type,title,onSelect }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [open, setOpen] = useState(false);

  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    if (start && onSelect && end ) onSelect(start,end);
    setEndDate(end);
  };
   const handleChangeDate = (date: Date | null) => {
    setStartDate(date);
    setEndDate(date);
    if (date && onSelect) onSelect(date,date);
  };

  return (
    <div className="single-search-box">
      <div className="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="23"
          height="23"
          viewBox="0 0 23 23"
        >
          <path d="M15.5978 13.5309L12.391 11.1258V6.22655C12.391 5.73394 11.9928 5.33575 11.5002 5.33575C11.0076 5.33575 10.6094 5.73394 10.6094 6.22655V11.5713C10.6094 11.8519 10.7412 12.1164 10.9657 12.2839L14.5288 14.9563C14.6826 15.0721 14.8699 15.1346 15.0624 15.1344C15.3341 15.1344 15.6013 15.0124 15.7759 14.7772C16.0717 14.3843 15.9916 13.8258 15.5978 13.5309Z" />
          <path d="M11.5 0C5.15851 0 0 5.15851 0 11.5C0 17.8415 5.15851 23 11.5 23C17.8415 23 23 17.8415 23 11.5C23 5.15851 17.8415 0 11.5 0ZM11.5 21.2184C6.14194 21.2184 1.78156 16.8581 1.78156 11.5C1.78156 6.14194 6.14194 1.78156 11.5 1.78156C16.859 1.78156 21.2184 6.14194 21.2184 11.5C21.2184 16.8581 16.8581 21.2184 11.5 21.2184Z" />
        </svg>
      </div>

      <div className="searchbox-input">
        <label>{title}</label>
        <div
          className="custom-select-dropdown style-2"
          onClick={() => setOpen(true)}
        >
          
          <div className="select-input">
          
            { (type == "daterange") ? (
             <DatePicker
              selected={startDate}
              onChange={handleChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              dateFormat="MMM dd"
              placeholderText="Select date range"
              open={open}
              onClickOutside={() => setOpen(false)}
              
              className="react-datepicker-ignore-onclickoutside"
              popperPlacement="bottom-start"
            />
            )
            
            :(<DatePicker
            selected={startDate}
            onChange={handleChangeDate}
            dateFormat="dd-MMM-yyyy"
            minDate={new Date("2023-01-01")}
            maxDate={new Date("2025-12-31")}
            placeholderText="Select a date"
               className="react-datepicker-ignore-onclickoutside"
          />) 

            }
           
            <i className="bi bi-chevron-down" style={{marginRight:0}}></i>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SearchDateBox;