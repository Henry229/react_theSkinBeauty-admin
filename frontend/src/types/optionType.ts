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
  startDate: Date;
  endDate: Date;
  // id: string;
  // startDate: string;
  // endDate: string;
  // customerName: {
  //   firstName: string;
  //   lastName: string;
  // };
  // mobile: string;
  // email: string;
  // service: {
  //   name: string;
  //   price: number;
  // };
}
// export interface MyCalendarEvent {
//   id: string;
//   startDate: string;
//   endDate: string;
//   customerName: {
//     firstName: string;
//     lastName: string;
//   };
//   mobile: string;
//   email: string;
//   service: {
//     name: string;
//     price: number;
//   };
// }
