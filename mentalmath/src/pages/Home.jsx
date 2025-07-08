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

function Home() {

    const [userProfile, setUserProfile] = useState(null)
    const [loading, setLoading] = useState(true)

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
            </div>
     
        </div>



    )
}

export default Home