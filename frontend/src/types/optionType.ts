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
  startDate: string;
  endDate: string;
  customerName: {
    firstName: string;
    lastName: string;
  };
  service: {
    name: string;
    price: number;
  };
}
