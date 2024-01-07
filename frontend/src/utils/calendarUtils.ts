// calendarUtils.ts
import moment from 'moment';
import { momentLocalizer } from 'react-big-calendar';

// 'moment' 인스턴스를 사용하여 localizer를 생성합니다.
export const localizer = momentLocalizer(moment);
