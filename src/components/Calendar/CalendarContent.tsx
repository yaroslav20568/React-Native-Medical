import React from 'react';
import { View, Text } from 'react-native';
import { s } from 'react-native-wind';
import { Agenda, AgendaSchedule, LocaleConfig } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import { TypesEvents } from "../../constants";
import { returnDotColor } from '../../helpers';

LocaleConfig.locales['ru'] = {
  monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  monthNamesShort: ['Янв.', 'Февр.', 'Март', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сент.', 'Окт.', 'Нояб.', 'Дек.'],
  dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  dayNamesShort: ['Вос.', 'Пон.', 'Вт.', 'Ср.', 'Чет.', 'Пят.', 'Суб.']
};

LocaleConfig.defaultLocale = 'ru';

interface IProps {
	calendarEvents: AgendaSchedule;
	markedDates: MarkedDates;
}

const CalendarContent = ({ calendarEvents, markedDates }: IProps) => {
	return (
		<>
			<View style={s`mb-3`}>
				<Text style={[s`text-lg font-semibold mb-1`]}>Типы событий</Text>
				<View style={s`flex-row flex-wrap`}>
					{Object.entries(TypesEvents).map(([key, value]) => 
						<View 
							style={s`flex-row items-center w-2/4`}
							key={`typesEvents_${key}`}
						>
							<View style={[s`w-4 h-4 rounded-full`, {backgroundColor: returnDotColor(value)}]}></View>
							<Text style={s`text-base text-black`}> — {value}</Text>
						</View>
					)}
				</View>
			</View>
			<Agenda 
				items={calendarEvents}
				markingType={'multi-dot'}
				markedDates={markedDates}
				renderItem={(item) => 
					<View 
						style={s`bg-blue-400 rounded-lg ${Object.values(calendarEvents)[Object.values(calendarEvents).length - 1][0].name === item.name ? 'mb-4' : ''} mt-4 py-3 px-2`}
						key={`calendarEvent_${item.id}`}
					>
						<Text style={s`text-lg text-black`}>{item.typeEvent}</Text>
						<Text style={s`text-base text-black`}>{item.name}</Text>
						<Text style={s`text-base text-black`}>
							{String(new Date(item.dateEvent).toLocaleString('ru', {timeZone: 'Europe/Moscow'})).split(',')[1]}
						</Text>
					</View>
				}
				renderEmptyData={() => <Text style={[s`text-lg font-semibold mt-3`]}>События не найдены на данный день</Text>}
			/>
		</>
	)
}

export default CalendarContent;