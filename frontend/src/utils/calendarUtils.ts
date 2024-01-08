// calendarUtils.ts
import moment from 'moment';
import { momentLocalizer } from 'react-big-calendar';

// 'moment' 인스턴스를 사용하여 localizer를 생성합니다.
export const localizer = momentLocalizer(moment);

export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')}`;
};
