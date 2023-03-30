import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { Link, Navigate } from 'react-router-dom'
import Layout from './Layout'
import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material'
import Box from '@mui/material/Box';

function Classes() {

    const navigate = useNavigate();
    const [classes, setClasses] = useState([[]]);
    const [userName, setUserName] = useState("");



    useEffect(() => {
        async function fetchData() {
            //fetch classes list
            const classList = JSON.parse(sessionStorage.getItem('classes'))
            setClasses(classList);
            setUserName(sessionStorage.getItem('name'))
        }
        fetchData();

    }, []);

    async function removeClass(credentials) {
        return fetch("http://localhost:5000/removeClass", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        })
            .then(
                res => res.json()
            )
    }

    const removeItem = async (index) =>{
        const token = await removeClass({
            classID: classes[index][0],
        })
        if (token.status == "Success"){
            const temp = [...classes]
            temp.splice(index, 1)
            setClasses(temp)
            sessionStorage.setItem('classes', JSON.stringify(temp))
        }
    }

    const handleChange = (index) => {
        navigate("/classlist/" + classes[index][0]);
    }


    // let listClasses = inputs.map((x) =>
    //     <>
    //         <ListItem disablePadding onClick={(e) => handleChange(e)}>
    //             <ListItemButton >
    //                 <ListItemText primary={x} />
    //             </ListItemButton>
    //         </ListItem>

    //     </>
    // );


    if (sessionStorage.getItem('accesslevel') != 5) {
        return <Navigate replace to="/" />
    }
    return (
        <div>
            <Layout />
            <p>Classes</p>
            <Link to="/create-class">Create Class</Link>
            <h2>{userName}'s Classes</h2>
            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <nav aria-label="main mailbox folders">
                <p>{classes.map((classInfo, index) => (
                <div>
                    <button onClick={() => handleChange(index)}>{classInfo[1]}</button>
                    <button onClick={() => removeItem(index)}>Delete</button>
                </div>
            ))}</p>
                </nav>
            </Box>
        </div>
    )
}

export default Classes