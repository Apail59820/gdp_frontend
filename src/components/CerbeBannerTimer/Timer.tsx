import { useState } from 'react';

type Props = {
    daysToWait?: number;
    hoursToWait?: number;
    minutesToWait?: number;
    secondsToWait?: number;
}

export default function Timer({daysToWait, hoursToWait, minutesToWait, secondsToWait}: Props) {

    return (
        <>
            {secondsToWait} seconds
        </>
    );
}