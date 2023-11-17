import React, { useState, useEffect } from "react";
import { Calendar } from "react-native-calendars";
import moment from "moment";

export default DatePicker = ({ date, setDate, setShowCalendarModal, initDate = new Date(), minimumDate = new Date(), availableDays = [0, 1, 2, 3, 4, 5, 6] }) => {
    const [markedDates, setMarkedDates] = useState({});

    useEffect(() => {
        console.log(initDate.getMonth());
        console.log(initDate.getMonth());
        getDisabledDays(
            initDate.getMonth()+1,
            initDate.getFullYear(),
            availableDays
        );
    }, []);

    const getDisabledDays = (month, year, availableDays) => {
        let pivot = moment().month(month - 1).year(year).startOf('month');
        const end = moment().month(month - 1).year(year).endOf('month');
        let dates = {};
        const disabled = { disabled: true, disableTouchEvent: true };

        while (pivot.isSameOrBefore(end)) {
            if (!availableDays.includes(pivot.day())) {
                const dateString = pivot.format('YYYY-MM-DD');
                dates[dateString] = disabled;
            }
            pivot.add(1, 'day');
        }
        setMarkedDates(dates);
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
                const selectedDate = moment(day.dateString, "YYYY-MM-DD");
                selectedDate.hour(0).minute(0).second(0);
                console.log(`data formatada: ${selectedDate.toDate()}`);
                setDate(selectedDate.toDate());
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