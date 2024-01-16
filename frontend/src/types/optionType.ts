import { bookType } from './types';

export interface OptionType {
  value: string;
  label: string;
}

export type SlotInfo = {
  start: Date;
  end: Date;
};

// CalendarEvent 타입을 정의합니다.
export interface MyCalendarEvent {
  id: string;
  book: bookType;
  start: Date;
  end: Date;
}
