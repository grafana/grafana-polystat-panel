import { dateTime } from '@grafana/data';

export const TimeFormatter = (timestamp: number, timestampFormat: string): string => {
  const timeZone = 'utc';
  const timestampFormatted =
    timeZone === 'utc'
      ? dateTime(timestamp)
        .utc()
        .format(timestampFormat)
      : dateTime(timestamp).format(timestampFormat);
  return timestampFormatted;
}
