import { GroupBase, OptionsOrGroups } from 'react-select';
import { OptionType } from '../types/optionType';
import { ServiceType } from '../types/types';

const generateTimeOptions = () => {
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`;
      timeOptions.push({ value: timeString, label: timeString });
    }
  }
  return timeOptions;
};

const generateDurationOptions = () => {
  const durationOptions = [];
  for (let hour = 0; hour < 12; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const durationString = `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`;
      durationOptions.push({ value: durationString, label: durationString });
    }
  }
  return durationOptions;
};

export function serviceOptions(services: ServiceType[]): OptionType[] {
  return services?.map((service: ServiceType) => ({
    value: service.id,
    label: service.name,
  }));
}

export const timeOption: OptionsOrGroups<
  OptionType,
  GroupBase<OptionType>
> = generateTimeOptions();

export const durationOptions: OptionsOrGroups<
  OptionType,
  GroupBase<OptionType>
> = generateDurationOptions();
