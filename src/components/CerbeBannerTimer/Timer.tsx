import React, { useEffect, useState } from "react";
import { Skeleton } from 'antd';

type Props = {
    deadline: string;
}
const Timer = ( { deadline }: Props ) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  function later(delay: number) {
    return new Promise(function(resolve) {
      setTimeout(resolve, delay);
    });
  }

  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  useEffect(() => {
    later((1000)).then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
      <>
        {
          isLoading ? <Skeleton.Input active={isLoading} /> : (
              <>
                {days ? `${days} jours ` : ''}
                {hours ? `${hours} heures ` : ''}
                {minutes ? `${minutes} minutes ` : ''}
                {seconds ? `${seconds} secondes` : ''}
              </>
          )
        }
      </>
  );
};

export default Timer;
