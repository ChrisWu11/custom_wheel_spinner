import { WheelData, HistoryRecord } from '../types';

export const loadWheelData = (): WheelData | null => {
  const savedData = localStorage.getItem('wheelData');
  return savedData ? JSON.parse(savedData) : null;
};

export const saveWheelData = (data: WheelData): void => {
  localStorage.setItem('wheelData', JSON.stringify(data));
};

export const loadHistory = (): HistoryRecord[] => {
  const savedHistory = localStorage.getItem('wheelHistory');
  return savedHistory ? JSON.parse(savedHistory) : [];
};

export const saveHistory = (history: HistoryRecord[]): void => {
  localStorage.setItem('wheelHistory', JSON.stringify(history));
};