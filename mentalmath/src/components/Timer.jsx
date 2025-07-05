import { useState, useEffect } from "react";

function CountdownTimer({ duration, onComplete }) {
    
    const [timeLeft, setTimeLeft] = useState(duration)

    useEffect(() => {
        if (timeLeft <= 0) {
            if (onComplete) onComplete()
            return;
        }

    const interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)
    }, 1000)

    return() => clearInterval(interval)
    }, [timeLeft])

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0')
        const s = (seconds % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }


    return (
        <div className = 'countdown-timer'>
            <h2>Time Left: {formatTime(timeLeft)}</h2>
        </div>
    )
}

export default CountdownTimer