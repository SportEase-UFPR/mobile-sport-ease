import React, { useState, useEffect } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import moment from "moment-timezone";
import COLORS from "../colors/colors";

LocaleConfig.locales['pt-br'] = {
    monthNames: [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro'
    ],
    monthNamesShort: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez'
    ],
    dayNames: [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado'
    ],
    dayNamesShort: [
      'Dom',
      'Seg',
      'Ter',
      'Qua',
      'Qui',
      'Sex',
      'Sáb'
    ],
    today: 'Hoje'
  };
  LocaleConfig.defaultLocale = 'pt-br';
  

export default DatePicker = ({ date, setDate, setShowCalendarModal, initDate = new Date(), minimumDate = new Date(), availableDays = [0, 1, 2, 3, 4, 5, 6] }) => {
    const [markedDates, setMarkedDates] = useState({});

    useEffect(() => {
        console.log(initDate.getMonth());
        console.log(initDate.getMonth());
        getDisabledDays(
            initDate.getMonth() + 1,
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
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: '#00adf5',
                selectedDayTextColor: '#ffffff',
                todayTextColor: COLORS.green,
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8'
            }}

            markedDates={markedDates}
            current={initDate.toISOString()}
            minDate={minimumDate.toISOString()}
            onDayPress={(day) => {
                const selectedDate = moment(`${day.dateString} 00:00:00`).format();
                console.log(`dia formatado é ${selectedDate}`);
                // console.log(`data formatada: ${selectedDate.tz("America/Sao_Paulo").format("YYYY-MM-DD, HH:mm")}`);
                // console.log(`dia selecionado ${selectedDate.hour()}`);
                setDate(selectedDate);
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