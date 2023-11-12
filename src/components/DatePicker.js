import React, { useState, useEffect } from "react";
import { Calendar } from "react-native-calendars";
import moment from "moment";

export default DatePicker = ({ date, setDate, setShowCalendarModal, initDate = new Date(), minimumDate = new Date(), availableDays = [0,1,2,3,4,5,6] }) => {
    const [markedDates, setMarkedDates] = useState({});

    useEffect(() => {
        getDisabledDays(
            initDate.getMonth(),
            initDate.getFullYear(),
            availableDays
        );
    }, []);

    const getDisabledDays = (month, year, availableDays) => {
        let pivot = moment().month(month).year(year).startOf('month');
        const end = moment().month(month).year(year).endOf('month');
        let dates = {};
        const disabled = { disabled: true, disableTouchEvent: true };

        while (pivot.isBefore(end)) {
            if (!availableDays.includes(pivot.day())) {
                const dateString = pivot.format('YYYY-MM-DD');
                dates[dateString] = disabled;
            }
            pivot.add(1, 'day');
        }
        setMarkedDates(dates);
        return dates;
    };

    return (
        <Calendar
            theme={{
                textSectionTitleDisabledColor: '#d9e1e8',
            }}
            markedDates={markedDates}
            current={initDate.toISOString()}
            minDate={minimumDate.toISOString()}
            onDayPress={(day) => {
                setDate(moment(day.dateString, "YYYY-MM-DD").toDate());
                setShowCalendarModal(false);
            }}
            firstDay={0}
            enableSwipeMonths={true}
            onMonthChange={(date) => {
                getDisabledDays(date.month, date.year, availableDays);
            }}
        />
    );
};