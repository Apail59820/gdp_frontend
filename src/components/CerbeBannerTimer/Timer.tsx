import React, { useEffect, useState } from "react";


type Props = {
    deadline: string;
}
const Timer = ( { deadline }: Props ) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();

    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {days ? `${days} jours ` : ''}
      {hours ? `${hours} heures ` : ''}
      {minutes ? `${minutes} minutes ` : ''}
      {seconds ? `${seconds} secondes` : ''}
    </>
  );
};

export default Timer;
