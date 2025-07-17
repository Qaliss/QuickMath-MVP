import QuestionCard from "../components/QuestionCard";
import Score from "../components/Score";
import { useState, useEffect } from "react";
import CountdownTimer from "../components/Timer";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import NavBar from "../components/NavBar";
import "../css/Home.css"
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts'
import { useXP } from "../contexts/XPContext";


function Home() {

    const [userProfile, setUserProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    const { xp, level, xpProgress, xpForNextLevel, currentLevelXP } = useXP();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const user = auth.currentUser
                const uid = user.uid
                if (user) {
                    const userDocRef = doc(db, 'users', uid)
                    const docSnap = await getDoc(userDocRef)

                    if (docSnap.exists())
                        setUserProfile(docSnap.data())
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserProfile()
    }, [])

    if (loading) {
        return(
            <div>Loading...</div>
        )
    }
    
    return (

        <div className='home'>
            <NavBar />  
            <div className='welcome-box'>
                <h1 className='welcome-message'>Hi, {userProfile?.nickname || 'User'}</h1>
                <h3 className='level'>Level: {level}</h3>
                <h3 className='progress'>{(xp - currentLevelXP)} / {(xpForNextLevel - currentLevelXP)}</h3>
                <h3 className="progress-percent">Progress: {xpProgress}%</h3>
            </div>
     
        </div>



    )
}

export default Home