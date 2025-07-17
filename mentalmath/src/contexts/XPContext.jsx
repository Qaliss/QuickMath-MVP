import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const XPContext = createContext()

export function XPProvider({ children }) {
    const {user} = useAuth()
    const [xp, setXP] = useState(0)
    const [level, setLevel] = useState(1)
    const [xpForNextLevel, setXPForNextLevel] = useState(100)
    const [xpProgress, setXPProgress] = useState(0)

    const calculateXPForLevel = (level) => {

        if (level <= 1) {
            return 0;
        }

        const baseXP = 100;
        const growthFactor = 1.5;

        let XPNeeded = 0;

        for (let i = 2; i <= level; i++) {
            XPNeeded += Math.floor(baseXP * Math.pow(growthFactor, i - 2));
        }

        return XPNeeded
    }

    const calculateLevelFromXP = (currentXP) => {
        let level = 1
        let totalXPNeeded = 0

        while (totalXPNeeded <= currentXP) {
            level ++
            totalXPNeeded = calculateXPForLevel(level)
        }

        return level - 1
    }

    const fetchXPAndLevel = useCallback(async () => {
            if (!user) {
                return
            }
            try {
                const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'quiz_results'))

                let totalXP = 0
                const allXPValues = []

                querySnapshot.forEach((doc) => {
                    const xp = doc.data().xp || 0
                    allXPValues.push(xp)
                    totalXP += xp
                })

                const newLevel = calculateLevelFromXP(totalXP)
                const currentLevelXP = calculateXPForLevel(newLevel)
                const nextLevelXP = calculateXPForLevel(newLevel + 1)
                const progress = (((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100).toFixed(1)
            
                console.log(`Total quizzes completed: ${allXPValues.length}`)
                console.log(`Total XP: ${totalXP}`)

                setXP(totalXP)
                setLevel(newLevel)
                setXPForNextLevel(nextLevelXP)
                setXPProgress(progress)

            } catch (error) {
                console.error(error)
            }
        }, [user])


    useEffect(() => {
        fetchXPAndLevel()
    }, [fetchXPAndLevel])



    const value = {
        xp,
        level: level,
        xpProgress,
        xpForNextLevel,
        currentLevelXP: calculateXPForLevel(level),
        refreshXP: fetchXPAndLevel


    }

    return (
        <XPContext.Provider value={value}>
            {children}
        </XPContext.Provider>
    )

}

export function useXP() {
    return useContext(XPContext)
}
