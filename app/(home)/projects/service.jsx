import React,{useEffect,useState} from "react";
import axios from "axios";

export const useFetchProjects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // mock api
        axios.get('/api/projects')
            .then(response => {
                setProjects(response.data);
                console.log ("fetch data!!")
            })
            .catch(error => {
                console.error('There was an error fetching the projects!', error);
            });
    }, []);

    return(
        projects
    );
}