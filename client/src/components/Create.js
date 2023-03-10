import React, { useState, useEffect } from 'react'
import {Navigate, useNavigate} from 'react-router-dom'
import { Link } from "react-router-dom";
import Layout from './Layout.js'


function Create() {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postTag, setPostTag] = useState("");
  const [chosenclass, setchosenclass] = useState("");
  const [data, setData] = useState([{}]);
  const [classes, setClasses] = useState([{}]);
  const [errorText, setErrorText] = useState("");
  const [inputs, setInputs] = useState([]);
  const navigate = useNavigate();
  useEffect(() =>{
    async function fetchData(){
      //fetch classes list
      const classList = JSON.parse(sessionStorage.getItem('classes'))
      console.log(classList);
      setClasses(classList);
      console.log(classes);
      const temp = [];
      for(let k in classList){
        console.log(k);
        temp.push(
          <option value = {k}>{classList[k]}</option>
        );
        setInputs(temp);
        console.log(inputs);
      }
    }
    fetchData();

  }, []);
  async function createPost(credentials){
    return fetch("http://localhost:5000/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
    .then(
      res=>res.json()
    )
  }
  
  const handleSubmit = async e => {
    console.log(inputs)
    e.preventDefault();
    if(chosenclass === "" || chosenclass === "Select a Class"){
      setErrorText("Please select a class.")
      return;
    }
    await createPost({
      userID: sessionStorage.getItem('token'),
      postContent,
      postTitle,
      postTag,
      chosenclass
    });
    navigate("/")
  }
  const handleChange = (event) =>{
    setchosenclass(event.target.value);
  }

  if(!sessionStorage.getItem('token')){
    return <Navigate replace to="/login"/>
  }
  else if(classes.length === 0){
    return (
      <body>
      <p>No classes found associated with profile. Please sign up for a class before creating a post.</p>
      <Link to="/">Sign Up</Link>
      </body>
      //TODO: Change Link to profile page OR whatever page to sign up for classes.
    )
  }
  return (
    <div>
      <Layout/>
      <h1>Create Post</h1>

      <form onSubmit={handleSubmit}>
      <label>
        Select a class: 
        <select defaultValue="Select a Class" required={true} chosenclass={chosenclass} onChange={handleChange}>
          <option value="Select a Class">Select a Class</option>
          {inputs}
        </select>
      </label> <br/>
        <input
          name="posttitle"
          type="text"
          id="posttitle"
          class="input-box"
          placeholder="Post Title"
          required="required"
          onChange={(e) => setPostTitle(e.target.value)}
        ></input><br />
        <textarea
          name="postcontent"
          id="postcontent"
          class="input-box"
          placeholder="Post content"
          required="required"
          onChange={(e) => setPostContent(e.target.value)}
        ></textarea> <br />
        <label for="tag">Tag (Optional):</label>
        <input list="tagpresets" id="tag" name="tag" onChange={(e) => setPostTag(e.target.value)}></input>

        <datalist id="tagpresets">
          <option value="Homework"></option>
          <option value="Exam"></option>
          <option value="Project"></option>
          <option value="General"></option>
        </datalist> <br />
        <input type="submit" value="Create Post"></input>
      </form>
      <p>{errorText}</p>
    </div>
  )
}

export default Create