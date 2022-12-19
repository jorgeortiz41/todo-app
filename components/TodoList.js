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

  //handle task deletion by id!!!!MISSING!!!!
  const handleDelete = (id) => {
    const deleteTask = async () => {
        const response = await fetch('http://localhost:5000/api/erasetask/' + id.toString(), {
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
    //if checked, delete task from database
    if (checked.includes(id)) {
      deleteTask()
          .then(res => console.log(res))
          .catch(err => console.log(err));
      window.location.reload(false);
    }
}

  //handle checkbox behavior
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    let isDone = !currentIndex;

    if (currentIndex === -1) {
      newChecked.push(value);
      isDone = true;
    } else {
      newChecked.splice(currentIndex, 1);
      isDone = false;
    }

    setChecked(newChecked);
    //update isDone property of task in database to match checkbox state
    const updateTask = async () => {
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
    updateTask()
        .then(res => console.log(res))
        .catch(err => console.log(err));
        console.log("task has been updated");
  };

  //displayed when loading or no data
  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No task data</p>



  return (
    <>
    <List sx={{ width: '100%', maxWidth: "80%", bgcolor: 'background.paper' }}>
    {data.map((task) => {
      const labelId = `checkbox-list-label-${task.name}`;

      return (
        <>
        <ListItem
          key={task.id}
          secondaryAction={
            <ButtonGroup variant="outlined" aria-label="text button group" style={{ width: 100, justifyContent: "space-evenly" }}>
              <IconButton edge='end' aria-label='edit'>
                <EditIcon />
              </IconButton>
              <IconButton edge='end' aria-label='delete' onClick={handleDelete} >
                <DeleteIcon />
              </IconButton>
            </ButtonGroup>
          }
          disablePadding

        >
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
        <Divider />
        </>
      );
    })}
  </List>
  <List sx={{ width: '100%', maxWidth: "80%", bgcolor: 'background.paper' }}>
    <ListSubheader>Completed</ListSubheader>
    {/* Display checked list items */}
  </List>
  </>
  )
}
