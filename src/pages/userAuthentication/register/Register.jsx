import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { set, useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../../providers/AuthProvider";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Register = () => {
    const axiosPublic = useAxiosPublic(); 
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    const {createUser, updateUserProfile} = useContext(AuthContext);
    const navigate = useNavigate(null);
    const [jobs, setJobs] = useState([]);
    const [jobId, setJobId] = useState(0);
    const [confirmPass, setConfirmPass] = useState("");

    // fetching data of jobs from json file
    useEffect(() => {
        fetch('jobs.json')
        .then(res => res.json())
        .then(data => {
            setJobs(data.jobTypes);
        })
    },[])


    // creating user and updating user profile
    const onSubmit = async (data) => {

        // image upload to imgbb and then get an url
        const imageFile = {image : data.photoURL[0]};
        const res = await axiosPublic.post(image_hosting_api, imageFile,{
            headers: {
                'content-type': 'multipart/form-data'
            }
        });
        
        data.photoURL = res.data.data.url;
            
            createUser(data.email, data.password)
            .then(result => {
                const user = result.user;
                // console.log(user);
                updateUserProfile(data.name, data.photoURL)
                .then(result => {
                    const userInfo = {
                        name: data.name,
                        email: data.email,
                        photoURL: data.photoURL,
                        job: data.job,
                        uid: user.uid,
                        isAdmin: false,
                    }
                    console.log("done ",result);
                    axiosPublic.post('/users', userInfo)
                    .then( result => { 
                        if(result.data.insertedId){
                            console.log("user added to the database")
                            reset();
                            Swal.fire({
                                title: "Good job!",
                                text: "Successfully Registered!",
                                icon: "success",
                                showConfirmButton: false,
                                timer: 1500
                            });
                            

                            navigate('/dashboard');
                            window.location.reload();

                        }
                    })
                })
                .catch(error => {
                    console.log(error);
                })
            })

    };

    // handling confirm password
    const handleConfirmPass = (e) => {
        const newPassword = e.target.value;
        setConfirmPass(newPassword);

        // console.log(e.target.value, watch('password'));
        if(e.target.value !== watch('password')){
            console.log("Passwords Don't Match");
        }else{
            console.log("matched");
        }
    }


    return (
        <div className="hero min-h-screen bg-base-200 w-full">
        <Helmet>
            <title>TaskFlow | Register</title>
        </Helmet>
        <div className="hero-content w-1/2 flex-col ">
           
            <h1 className="text-5xl font-bold my-4">Register now!</h1>

            <div className="card md:w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleSubmit(onSubmit)}>

                {/* Name */}
                <div className="form-control">
                <label className="label">
                    <span className="label-text">Name</span>
                </label>
                <input type="text" placeholder="name" {...register("name", { required: true })} name="name" className="input input-bordered" />
                {errors.name && <span className="text-red-600 text-sm">* This field is required</span>}
                </div>

                {/* Photo */}
                <div className="form-control">
                <label className="label">
                    <span className="label-text">Photo URL</span>
                </label>
                <input type="file" {...register("photoURL", { required: true })} name="photoURL" className="file-input w-full max-w-xs" />
                {errors.photoURL && <span className="text-red-600 text-sm">* This field is required</span>}
                </div>


                {/* Job */}
                <div className="form-control">
                <label className="label">
                    <span className="label-text">Job</span>
                </label>
                <select className="select select-bordered w-full text-black" {...register("job", { required: true })} name="job" onChange={(e) => setJobId(e.target.selectedIndex.toString())}>
                    <option disabled="disabled" selected="selected">Select Job</option>
                    {
                        jobs.map( (job, index) => 
                            <option  key={index} value={job}
                        >{job}</option>)
                    }
                </select>
                {errors.job && <span className="text-red-600 text-sm">* This field is required</span>}
                </div>



                {/* Email */}
                <div className="form-control">
                <label className="label">
                    <span className="label-text">Email</span>
                </label>
                <input type="email" placeholder="email" name="email" {...register("email", { required: true })} className="input input-bordered" />
                {errors.email && <span className="text-red-600 text-sm">* This field is required</span>}
                </div>

                {/* Password */}
                <div className="form-control">
                <label className="label">
                    <span className="label-text">Password</span>
                </label>
                <input type="password" name="password" {...register("password", { 
                    required: true,
                    minLength: 6,
                    maxLength: 20,
                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{6,20}$/  ,
                    })} placeholder="password" className="input input-bordered" />
                {errors.password?.type === 'required' && <span className="text-red-600 text-sm">* This field is required</span>}
                {errors.password?.type === 'minLength' && <span className="text-red-600 text-sm">* Password must be atleast 6 characters</span>}
                {errors.password?.type === 'maxLength' && <span className="text-red-600 text-sm">* Password must be less then 20 characters</span>}
                {errors.password?.type === 'pattern' && <span className="text-red-600 text-sm">* Must include at least one digit, one lowercase, one uppercase, and one special character</span>}

                {/* <label className="label">
                    <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                </label> */}
                </div>

                {/* Confirm Password */}
                <div className="form-control">
                <label className="label">
                    <span className="label-text">Confirm Password</span>
                </label>
                <input type="password" name="confirmPassword" placeholder="confirm password" onChange={handleConfirmPass} className="input input-bordered" />

                {/* <label className="label">
                    <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                </label> */}
                </div>
                
                {/* message if confirm password not matched */}
                <div className="form-control mt-6">
                    <input  className="btn btn-primary" type="submit" value="Register"/>
                    {confirmPass !== watch('password') && 
                        <span className="text-red-600 text-sm">* Passwords Don't Match</span>}
                </div>
                
            </form>
            <p className="text-center"><small>Already have an account? <Link to='/login' className="text-blue-700">Login Please</Link></small></p>
               
            </div>
        </div>
        </div>
    );
};

export default Register;