import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react'
import * as React from 'react';


export default function AddTodo() {

    const [task, setTask] = useState('')
    const [error, setError] = useState(false)

    const handleSubmit = (e) => {
      //if task is empty, set error to true
        if(task === ''){
            e.preventDefault();
            setError(true)
        } else {

        const sendEvent = async () => {
            const response = await fetch('http://localhost:5000/api/addtask/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: task,
              }),
            });
            const body = await response.json();
            if (response.status !== 200) {
              throw Error(body.message)
            }
            return body;
          };
          sendEvent()
            .then(res => console.log(res))
            .catch(err => console.log(err));
      
        // e.preventDefault();
        window.location.reload(false);
        setTask('');
        }
    }

    return(
        <div style={{ width: "80%", justifyContent:"center"}} >
            <form onSubmit={handleSubmit}>
                <TextField
                error={error}
                type = "text"
                onChange={(e) => {setTask(e.target.value), setError(false)}}
                value={task}
                style={{ width: "70%", height: 60 }}
                id="filled-basic" 
                label="Add a task" 
                helperText={error ? "Please enter a task" : ""}
                variant="filled" />

                <Button
                style={{ width: "30%", height: 55}}
                variant="contained" 
                endIcon={<AddIcon />}
                type="submit"
                >
                Add
                </Button>
            </form>
        </div>
    )
};
