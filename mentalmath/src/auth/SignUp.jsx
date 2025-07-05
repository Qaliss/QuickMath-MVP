import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

function SignUp () {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            alert('Success! You can log in now.')

        }
        catch (err) {
            alert('Sign up failed')
        }
    }

    return (
        <form onSubmit = {handleLogin}>
            <input type='email' placeholder = 'E-mail' value={email} onChange={e => setEmail(e.target.value)} required/>
            <input type='password' placeholder = 'Password' value={password} onChange={e => setPassword(e.target.value)} required/>
            <button type='submit'>Sign up</button>
        </form>
    )

}

export default SignUp