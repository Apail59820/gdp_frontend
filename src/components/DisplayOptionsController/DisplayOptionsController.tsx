import { log } from 'console';
import React from 'react';
import styles from './DisplayOptionsController.module.scss';

export type Option = {
  key: string;
  icon: React.ReactNode;
};

type Props = {
  options?: Option[];
  currentOption: string;
  setCurrentOption: React.Dispatch<React.SetStateAction<string>>;
};

const defaultOptions: Option[] = [
  {
    key: 'grid',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6 20H2C0.875 20 0 20.9375 0 22V26C0 27.125 0.875 28 2 28H6C7.0625 28 8 27.125 8 26V22C8 20.9375 7.0625 20 6 20ZM6 26H2V22H6V26ZM16 20H12C10.875 20 10 20.9375 10 22V26C10 27.125 10.875 28 12 28H16C17.0625 28 18 27.125 18 26V22C18 20.9375 17.0625 20 16 20ZM16 26H12V22H16V26ZM26 20H22C20.875 20 20 20.9375 20 22V26C20 27.125 20.875 28 22 28H26C27.0625 28 28 27.125 28 26V22C28 20.9375 27.0625 20 26 20ZM26 26H22V22H26V26ZM6 10H2C0.875 10 0 10.9375 0 12V16C0 17.125 0.875 18 2 18H6C7.0625 18 8 17.125 8 16V12C8 10.9375 7.0625 10 6 10ZM6 16H2V12H6V16ZM16 10H12C10.875 10 10 10.9375 10 12V16C10 17.125 10.875 18 12 18H16C17.0625 18 18 17.125 18 16V12C18 10.9375 17.0625 10 16 10ZM16 16H12V12H16V16ZM26 10H22C20.875 10 20 10.9375 20 12V16C20 17.125 20.875 18 22 18H26C27.0625 18 28 17.125 28 16V12C28 10.9375 27.0625 10 26 10ZM26 16H22V12H26V16ZM6 0H2C0.875 0 0 0.9375 0 2V6C0 7.125 0.875 8 2 8H6C7.0625 8 8 7.125 8 6V2C8 0.9375 7.0625 0 6 0ZM6 6H2V2H6V6ZM16 0H12C10.875 0 10 0.9375 10 2V6C10 7.125 10.875 8 12 8H16C17.0625 8 18 7.125 18 6V2C18 0.9375 17.0625 0 16 0ZM16 6H12V2H16V6ZM26 0H22C20.875 0 20 0.9375 20 2V6C20 7.125 20.875 8 22 8H26C27.0625 8 28 7.125 28 6V2C28 0.9375 27.0625 0 26 0ZM26 6H22V2H26V6Z"
          fill="#002559"
        />
      </svg>
    ),
  },
  {
    key: 'list',
    icon: (
      <svg width="32" height="26" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 0H2C0.875 0 0 0.9375 0 2V4C0 5.125 0.875 6 2 6H4C5.0625 6 6 5.125 6 4V2C6 0.9375 5.0625 0 4 0ZM4 4H2V2H4V4ZM4 20H2C0.875 20 0 20.9375 0 22V24C0 25.125 0.875 26 2 26H4C5.0625 26 6 25.125 6 24V22C6 20.9375 5.0625 20 4 20ZM4 24H2V22H4V24ZM11 4H31C31.5 4 32 3.5625 32 3.0625C32 2.5 31.5 2 31 2H11C10.4375 2 10 2.5 10 3C10 3.5625 10.4375 4 11 4ZM31 12H11C10.4375 12 10 12.5 10 13C10 13.5625 10.4375 14 11 14H31C31.5 14 32 13.5625 32 13C32 12.5 31.5 12 31 12ZM31 22H11C10.4375 22 10 22.5 10 23C10 23.5625 10.4375 24 11 24H31C31.5 24 32 23.5625 32 23C32 22.5 31.5 22 31 22ZM4 10H2C0.875 10 0 10.9375 0 12V14C0 15.125 0.875 16 2 16H4C5.0625 16 6 15.125 6 14V12C6 10.9375 5.0625 10 4 10ZM4 14H2V12H4V14Z"
          fill="#002559"
        />
      </svg>
    ),
  },
];
const defaultCurrentOption = defaultOptions[0].key;

const DisplayOptionsController = ({
  options = defaultOptions,
  currentOption = defaultCurrentOption,
  setCurrentOption,
}: Props) => {
  return (
    <div className={styles.displayOptionsController}>
      {options.map((option: Option) => (
        <div
          key={option.key}
          className={`${styles.option} ${option.key !== currentOption ? styles.inactive : ''}`}
          onClick={() => setCurrentOption(option.key)}
        >
          {option.icon}
        </div>
      ))}
    </div>
  );
};

export default DisplayOptionsController;
