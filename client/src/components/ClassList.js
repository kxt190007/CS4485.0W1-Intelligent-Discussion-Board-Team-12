import { useLoaderData } from "react-router-dom";
import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
export async function loader({ params }) {
    console.log(params.classID)
    //const classInfo = await getClass(params.classID);
    return params.classID
}
export function ClassList() {

    const [className, setClassName] = useState("");
    const [instructorList, setInstructorList] = useState([[]])
    const [studentList, setStudentList] = useState([])
    const [moderatorList, setModeratorList] = useState([])
    const [studentLabel, setStudentLabel] = useState("")
    const [moderatorLabel, setModeratorLabel] = useState("")
    const [instructorLabel, setInstructorLabel] = useState("")
    const classID = useLoaderData();
    const navigate = useNavigate()
    async function getStudents(credentials) {
        return fetch("http://localhost:5000/getStudents", {
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
    async function promote(credentials) {
        return fetch("http://localhost:5000/promote", {
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
    async function demote(credentials) {
        return fetch("http://localhost:5000/demote", {
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
    async function remove(credentials) {
        return fetch("http://localhost:5000/removeStudent", {
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
    useEffect(() => {
        async function fetchData() {
            const token = await getStudents({
                classID,
            });
            console.log(token.instructors)
            console.log(sessionStorage.getItem('token'))
            var found = 0
            for(let i = 0; i<token.instructors.length; i++ ){
                if(token.instructors[i][0] == sessionStorage.getItem('token')){
                    found = 1
                }
            }
            if(found === 1){
                setClassName(token.classname)
                const temp = [...token.instructors]
                setInstructorList(temp)
                const temp1 = [...token.students]
                setStudentList(temp1)
                const temp2 = [...token.moderators]
                setModeratorList(temp2)
                setStudentLabel("Students")
                setModeratorLabel("Moderators")
                setInstructorLabel("Instructors")
            }
            else{
                navigate("/")
            }
        }
        fetchData();
    }, []);
    const demoteStudent = async (index) =>{
        const token = await demote({
            studentID: moderatorList[index][0],
            classID,
        })
        const student = moderatorList[index]
        const temp = [...moderatorList]
        temp.splice(index, 1)
        setModeratorList(temp)
        const temp1 = [...studentList,student]
        setStudentList(temp1)
    }
    const promoteStudent = async (index) =>{
        const token = await promote({
            studentID: studentList[index][0],
            classID,
        })
        const student = studentList[index]
        const temp = [...studentList]
        temp.splice(index, 1)
        setStudentList(temp)
        const temp1 = [...moderatorList,student]
        setModeratorList(temp1)
    }
    const removeClassM = async (index) =>{
        const token = await remove({
            studentID: moderatorList[index][0],
            classID,
        })
        const temp = [...moderatorList]
        temp.splice(index, 1)
        setModeratorList(temp)
    }
    const removeClassS = async (index) =>{
        const token = await remove({
            studentID: studentList[index][0],
            classID,
        })
        const temp = [...studentList]
        temp.splice(index, 1)
        setStudentList(temp)
    }
    
    if (sessionStorage.getItem('accesslevel') != 5) {
        return <Navigate replace to="/" />
    }
    return (
        <div>
            
            <Layout />
            <p>{className}</p>
            <label>{instructorLabel}</label>
            <p>{instructorList.map((prof, index) => (
                <div>

                    {prof[3]}{" "}{prof[4]}
                </div>
            ))}</p>
            <label>{moderatorLabel}</label>
            <p>{moderatorList.map((moderator, index) => (
                <div>

                    {moderator[3]}{" "}{moderator[4]}
                    <button onClick={() => demoteStudent(index)}>Demote to student</button>
                    <button onClick={() => removeClassM(index)}>Remove from class</button>
                </div>
            ))}</p>
            <label>{studentLabel}</label>
            <p>{studentList.map((student, index) => (
                <div>

                    {student[3]}{" "}{student[4]}
                    <button onClick={() => promoteStudent(index)}>Promote to moderator</button>
                    <button onClick={() => removeClassS(index)}>Remove from class</button>
                </div>
            ))}</p>
        </div>
    )
}
export default ClassList