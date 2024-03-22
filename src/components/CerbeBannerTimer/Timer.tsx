import React from "react";
import { useTimer } from "react-timer-hook";

export default function Timer({ expiryTimestamp }) {
  const { seconds, minutes, hours, days, isRunning } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });
  return (
      <>
        {days ? `${days} jours `: ''}
        {hours ? `${hours} heures `: ''}
        {minutes ? `${minutes} minutes `: ''}
        {seconds ? `${seconds} secondes `: ''}
        <br />
        {isRunning? 'Veuillez remplir vos données CERBE avant le 1er avril' : ''}
      </>
  );
}
