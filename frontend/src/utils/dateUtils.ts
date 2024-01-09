import moment from 'moment';

interface createStartDateProps {
  date: Date;
  time: string;
}

interface calculateEndDateProps {
  startDate: Date;
  durationInMinutes: number;
}

export function createStartDate({ date, time }: createStartDateProps) {
  if (!date || !time) return null;
  const dateStr = moment(date).format('YYYY-MM-DD');
  const timeStr = moment(time, 'HH:mm').format('HH:mm');
  return moment(`${dateStr}T${timeStr}`).toDate();
}

export function calculateEndDate({
  startDate,
  durationInMinutes,
}: calculateEndDateProps) {
  console.log('>>>>---- durationInMinutes in function :', durationInMinutes);

  const startMoment = moment(startDate);
  const endMoment = startMoment.add(durationInMinutes, 'minutes');
  console.log('>>>>---- endMoment in function: ', endMoment);

  return endMoment.toDate();
}

export function getMinutesFromDuration(duration: string) {
  const [hours, minutes] = duration.split(':').map(Number);
  return hours * 60 + minutes;
}
