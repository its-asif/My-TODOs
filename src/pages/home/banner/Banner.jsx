import React from 'react';
import { Link } from 'react-router-dom';

const Banner = () => {
    return (
        <div>
            <div className="relative z-20 flex items-center overflow-hidden bg-white dark:bg-gray-800">
                <div className="container relative flex px-6 py-16 mx-auto">

                    {/* left side */}
                    <div className="relative z-20 flex flex-col sm:w-2/3 lg:w-2/5">
                        <span className="w-20 h-2 mb-12 bg-gray-800 dark:bg-white">
                        </span>
                        <h1 className="flex flex-col text-5xl md:text-6xl font-black leading-none text-gray-800 uppercase font-bebas-neue dark:text-white">
                            Empower 
                            <span className="">
                            Your Productivity
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mt-4 font-bold text-gray-700 dark:text-white">
                        TaskFlow - Where Tasks <br /> Meet Efficiency
                        </p>
                        <div className="flex mt-8">
                            <Link to={'/login'} className="px-4 py-2 text-pink-500 uppercase bg-transparent border-2 border-pink-400 hover:border-0 rounded-lg dark:text-white hover:bg-pink-600 hover:text-white font-bold text-md">
                                Lets Explore
                            </Link>
                        </div>
                    </div>
                    
                    {/* right side */}
                    <div className="relative hidden sm:block sm:w-1/3 lg:w-3/5">
                        <img src="https://i.ibb.co/ZxB4Tzy/deadline-concept-illustration-114360-6313.jpg" 
                        className="max-w-xs m-auto lg:max-w-lg"/>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Banner;