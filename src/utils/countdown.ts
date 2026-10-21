export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  totalSeconds: number;
}

export function calculateTimeLeft(targetDate: string | Date): TimeLeft {
  const difference = new Date(targetDate).getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
      totalSeconds: 0,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    isPast: false,
    totalSeconds: Math.floor(difference / 1000),
  };
}

export function formatTimeLeftString(timeLeft: TimeLeft): string {
  if (timeLeft.isPast) return '00:00:00';
  if (timeLeft.days > 0) {
    return `${timeLeft.days}d ${String(timeLeft.hours).padStart(2, '0')}h ${String(timeLeft.minutes).padStart(2, '0')}m`;
  }
  return `${String(timeLeft.hours).padStart(2, '0')}h ${String(timeLeft.minutes).padStart(2, '0')}m ${String(timeLeft.seconds).padStart(2, '0')}s`;
}

export function isValidFreeFireUid(uid: string): boolean {
  // Free Fire UIDs are numeric strings typically 8 to 12 digits
  return /^[0-9]{8,12}$/.test(uid.trim());
}
