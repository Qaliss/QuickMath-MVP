import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../css/Login.css"

function Login ({ setUser }) {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            await setPersistence(auth, browserLocalPersistence)
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            navigate('/play')

        }
        catch (err) {
            alert('Sign in failed')
            console.log(err)
        }
    }

    return (
        <div className='login-screen'>
            <div className='login-box'>
                <h1 className='login-title'>MentalMath</h1>
                <h2 className='login'>Log in</h2>
                <form onSubmit = {handleLogin}>
                    <input className='email' type='email' placeholder = 'E-mail' value={email} onChange={e => setEmail(e.target.value)} required/>
                    <input className='password' type='password' placeholder = 'Password' value={password} onChange={e => setPassword(e.target.value)} required/>
                    <button type='submit'>Log in</button>
                    <p>Not a member? <Link to="/signup">Sign Up</Link></p>
                </form>
            </div>

        </div>
    )

}

export default Login