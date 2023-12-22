import { useContext, useEffect, useState } from "react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { AuthContext } from "../../../providers/AuthProvider";
import { totalTasks, completedTasks } from "../todo/TodoList";


const Profile = () => {
    const axiosPublic = useAxiosPublic(); 
    const {user} = useContext(AuthContext);
    const [userData, setUserData] = useState({});


    useEffect(() => {
        axiosPublic.get(`/users/${user?.email}`)
        .then(result => {
            setUserData(result.data[0]);
        })
    },[user?.email])

    console.log(userData);

    return (
        <div>
            <div class="relative mx-auto p-8 my-10 overflow-hidden bg-white shadow-lg rounded-xl md:w-72 lg:w-1/2 dark:bg-gray-800">

                {/* Title */}
                <h1 className="text-2xl font-bold text-center mb-6 " style={{ 
                        background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', 
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }
                }>USER PROFILE</h1>

                {/*  */}
                <a href="#" class="block w-full h-full">
                    <div class="flex items-center w-full">
                        <a href="#" class="relative block">
                            <img alt="profil" src={userData.photoURL} class="mx-auto object-cover rounded-full h-10 w-10 "/>
                        </a>
                        <div class="items-center ml-4">
                            <h1 class="dark:text-white">
                                {userData.name}
                            </h1>
                            <h1 class="text-sm text-gray-400 dark:text-gray-300">
                                {userData.email}
                            </h1>
                            <h1 class="text-sm text-gray-400 dark:text-gray-300">
                                Profession : {userData.job}
                            </h1>
                        </div>
                    </div>
                    <div class="flex items-center justify-between my-2 mt-4">
                        <p class="text-sm text-gray-400">
                            {completedTasks}/{totalTasks} task completed
                        </p>
                    </div>
                    <progress className="progress progress-info w-full h-3" value={completedTasks} max={totalTasks}></progress>
                    {/* <div class="w-full h-2 bg-blue-200 rounded-full">
                        <div class="w-2/3 h-full text-xs text-center text-white bg-blue-600 rounded-full">
                        </div>
                    </div> */}
                </a>
            </div>

        </div>
    );
};

export default Profile;