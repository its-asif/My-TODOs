import axios from "axios";

const axiosPublic = axios.create({
    baseURL: 'https://taskflow-azure.vercel.app/',
});

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;