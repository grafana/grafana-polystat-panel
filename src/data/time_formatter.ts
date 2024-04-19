import { dateTime } from '@grafana/data';

export const TimeFormatter = (timeZone: string, timestamp: number, timestampFormat: string): string => {
  const timestampFormatted =
    timeZone === 'utc'
      ? dateTime(timestamp)
        .utc()
        .format(timestampFormat)
      : dateTime(timestamp).format(timestampFormat);
  return timestampFormatted;
}
