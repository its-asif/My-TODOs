import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from "../../../providers/AuthProvider";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import app from '../../../firebase/firebase.config';


const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard/profile';

    const { signIn} = useContext(AuthContext);

    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    const handleGoogleSignIn = () =>{
        signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            const {displayName, photoURL, email} = user;
            const createdAt = user?.metadata?.creationTime;
  
            const newUser = { name : displayName, email, photoURL, job: "", isAdmin: false, uid: user.uid}
            // const newUser = {email, createdAt : createdAt, myCart: [], appliedJobs: [], myJobs: [], displayName, photoURL};
            fetch('http://localhost:8000/users', {
                method: 'POST',
                headers:{
                    'content-type': 'application/json'
                },
                body: JSON.stringify(newUser)
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data.acknowledged);
                    if(data.acknowledged){
                        // navigate to dashboard
                        navigate('/dashboard');
                    }
                }
                )
            setUser({displayName, photoURL, email});
            toast.success("Successfully Logged In")
            // ...
        }).catch((error) => {
            console.log(error);
        }
        );
    }


    const handleLogin = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        // console.log(email, password)
        signIn(email, password)
        .then( result => {
            const user = result.user;
            console.log(user);
            Swal.fire({
                title: "Good job!",
                text: "Successfully Logged in!",
                icon: "success"
              });
              navigate('/dashboard');
        })
    }


    return (
        <div className="hero min-h-screen bg-base-200">
        <Helmet>
            <title>TaskFlow | Login</title>
        </Helmet>
        <div className="hero-content w-1/2 flex-col">
            <div className="text-center md:w-full lg:text-left">
                <h1 className="text-5xl font-bold mx-auto text-center my-5">Login now!</h1>
            </div>
            <div className="card md:w-full shadow-2xl bg-base-100">

            <div className="mt-5 mx-5">
            <button type="button" 
            onClick={handleGoogleSignIn}
            class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              <svg class="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none">
                <path d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z" fill="#4285F4"/>
                <path d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z" fill="#34A853"/>
                <path d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z" fill="#FBBC05"/>
                <path d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z" fill="#EB4335"/>
              </svg>
              Sign in with Google
            </button>

            <div class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ms-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">Or</div>
            </div>

            <form className="card-body mt-0 pt-0" onSubmit={handleLogin}>

                {/* Email */}
                <div className="form-control">
                <label className="label">
                    <span className="label-text">Email</span>
                </label>
                <input type="email" placeholder="email" name="email" className="input input-bordered" required />
                </div>

                {/* Password */}
                <div className="form-control">
                <label className="label">
                    <span className="label-text">Password</span>
                </label>
                <input type="password" name="password" placeholder="password" className="input input-bordered" required />
                <label className="label">
                    <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                </label>
                </div>

                <div className="form-control mt-6">
                <input className="btn btn-primary" type="submit" value="Login" />
                </div>
            </form>
            <p className='text-center'><small>New Here? <Link to='/register' className='text-blue-700'>Create an account</Link></small></p>
            
            </div> 
        </div>
        </div>
    );
};

export default Login;