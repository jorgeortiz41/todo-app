import { useState, useEffect } from 'react'
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ButtonGroup } from '@mui/material';
import { Divider } from '@mui/material';
import ListSubheader from '@mui/material/ListSubheader';


export default function TodoList() {

  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [checked, setChecked] = React.useState([0]);

  //fetch tasks from api
  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:5000/api/tasks')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
        console.log(data)
      })
  }, [])

  //function to get tasks from database
  const getTasks = async () => {
    const response = await fetch('http://localhost:5000/api/tasks');
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message)
    }

    return body;
  };

  //handle task editing by id!!!!MISSING!!!!
  // const handleEdit = (id) => {
  //   const editTask = async () => {
  //       const response = await fetch('http://localhost:5000/api/edittask/' + id, {
  //           method: 'PUT',
  //           headers: {
  //               'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({
  //               name: 'edited task',
  //           }),
  //       });
  //       const body = await response.json();
  //       if (response.status !== 200) {
  //           throw Error(body.message)
  //       }
  //       return body;
  //   };
  //   editTask()
  //       .then(res => console.log(res))
  //       .catch(err => console.log(err));
  //   window.location.reload(false);
  // }


  //handle task deletion by id
  const handleDelete = (id) => {
    const deleteTask = async () => {
        const response = await fetch('http://localhost:5000/api/erasetask/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };
    deleteTask()
        .then(res => console.log(res))
        .catch(err => console.log(err));
  }

  //handle task isDone property update by id
  const updateStatusTask = async (value) => {
    const isDone = !value.isDone;
    const response = await fetch('http://localhost:5000/api/updatetask/' + value._id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            isDone: isDone,
        }),
    });
    const body = await response.json();
    if (response.status !== 200) {
        throw Error(body.message)
    }
    return body;
  }

  //handle checkbox behavior
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    let newData = [...data];
    let newTask = newData.find(task => task._id === value._id);


    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    
    setChecked(newChecked);
    
    //update isDone property of task in database to match checkbox state
    updateStatusTask(value)
        .then(res => {
          console.log(res)
          newTask.isDone = res.isDone;
          console.log(newTask);
          newData[newData.findIndex(task => task._id == newTask._id )] = newTask;
          setData(newData);
          console.log(data);
        })
        .catch(err => console.log(err));
        console.log("task has been updated");
  };


  //displayed when loading or no data
  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No task data</p>



  return (
    <>
    <List sx={{ width: '100%', maxWidth: "80%", bgcolor: 'background.paper' }}>
    {/* Display tasks checked if isDone is true and unchecked if isDone is false */}
    {data.map((task) => {
      const labelId = `checkbox-list-label-${task._id}`;

      if (task.isDone) {
        return (
          <ListItem key={task._id} secondaryAction={
            <ButtonGroup>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(task._id)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(task._id)}>
                <DeleteIcon />
              </IconButton>
            </ButtonGroup>
          } disablePadding>
            <ListItemButton role={undefined} onClick={handleToggle(task)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(task) == -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={task.name} />
            </ListItemButton>
          </ListItem>
        )
      }
      else {

      return (
        <ListItem key={task._id} secondaryAction={
          <ButtonGroup>
            <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(task._id)}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(task._id)}>
              <DeleteIcon />
            </IconButton>
          </ButtonGroup>
        } disablePadding>
          <ListItemButton role={undefined} onClick={handleToggle(task)} dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(task) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={task.name} />
          </ListItemButton>
        </ListItem>
      )
      }
    })}
  </List>
  <List sx={{ width: '100%', maxWidth: "80%", bgcolor: 'background.paper' }}>
    <ListSubheader>Completed</ListSubheader>
    {/* Display checked list items */}
  </List>
  </>
  )
}
