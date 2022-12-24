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
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';


export default function TodoList() { 
  
  const status = [
    {
      value: 'to-do',
      label: 'To Do',
    },
    {
      value: 'done',
      label: 'Done',
    },
    {
      value: 'in-progress',
      label: 'In Progress',
    }
  ]

  const categories = [
    {
      value: 'Work',
      label: 'Work',
    },
    {
      value: 'Home',
      label: 'Home',
    },
    {
      value: 'School',
      label: 'School',
    },
    {
      value: 'Tasks',
      label: 'None',
    }
  ]

  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [checked, setChecked] = React.useState([0]);
  const [open, setOpen] = React.useState([0]);
  const [task, setTask] = useState(null)


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

    window.location.reload(false);
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

  const updateImportanceTask = async (value) => {
    const isImportant = !value.isImportant;
    const response = await fetch('http://localhost:5000/api/updatetask/' + value._id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            isImportant: isImportant,
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
    let newData = [...data];  //copy of data array
    


    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    
    setChecked(newChecked);
    
    //update isDone property of task in database to match checkbox state
    updateStatusTask(value)
        .then(res => console.log(res))
        .catch(err => console.log(err));
        console.log("task has been updated");
        
    window.location.reload(false);
  };

  //handle task dialong toggle
  const handleDialogToggle = (value) => () => {
    const currentIndex = open.indexOf(value);
    const newOpen = [...open];

    if (currentIndex === -1) {
      newOpen.push(value);
    } else {
      newOpen.splice(currentIndex, 1);
    }

    setOpen(newOpen);
  };

  const handleImportantToggle = (value) => () => {
    //call updateImportanceTask function
    updateImportanceTask(value)
        .then(res => console.log(res))
        .catch(err => console.log(err));
        console.log("task importance has been updated");

    window.location.reload(false);
  }



  //displayed when loading or no data
  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No task data</p>



  return (
    <>
    <List sx={{ width: '100%', maxWidth: "80%", bgcolor: 'background.paper' }}>
    <ListSubheader>To-do</ListSubheader>
    <Divider variant="middle" />
    {/* Display tasks checked if isDone is true and unchecked if isDone is false */}
    {data.map((task) => {
      const labelId = `checkbox-list-label-${task._id}`;

      if (!task.isDone) {
        return (
          <>
          <ListItem key={task._id} secondaryAction={
            <ButtonGroup>
              <Rating name="customized-1" defaultValue={task.isImportant ? 1: 0} max={1} sx={{p:1, pr:0}} size='large' onClick={handleImportantToggle(task)}/>
              <IconButton edge="end" aria-label="edit" onClick={handleDialogToggle(task)}>
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
          <Dialog
          fullWidth={true}
          open={open.indexOf(task)!== -1} 
          onClose={handleDialogToggle(task)} 
          key={task._id}
          >
          <DialogTitle>
          <TextField
              autoFocus
              margin="dense"
              id="name"
              label={task.name}
              type="text"
              fullWidth
              variant="outlined"
            />
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              id="outlined-select-status"
              select
              label="Status"
              defaultValue={task.inProg ? 'in-progress': task.isDone ? 'done': 'to-do' } 
              helperText="Change status"
            >
              {status.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              id="outlined-select-category"
              select
              label="Category"
              defaultValue={task.cat} 
              helperText="Change category"
              sx={{ml: 2}}
            >
              {categories.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>       
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogToggle(task)}>Cancel</Button>
            <Button onClick={handleDialogToggle(task)}>Confirm</Button>
          </DialogActions>
        </Dialog>
        </>
        )
      }
    })}
  </List>
  <List sx={{ width: '100%', maxWidth: "80%", bgcolor: 'background.paper' }}>
    <ListSubheader>In progress</ListSubheader>
    <Divider variant="middle" />
  </List>
  <List sx={{ width: '100%', maxWidth: "80%", bgcolor: 'background.paper' }}>
    <ListSubheader>Done</ListSubheader>
    <Divider variant="middle" />
    {/* Display checked list items */}
    {data.map((task, i) => {
      const labelId = `checkbox-list-label-${task._id}`;

      if (task.isDone) {
        return (
          <>
          <ListItem key={task._id} secondaryAction={
            <ButtonGroup>
              <IconButton edge="end" aria-label="edit" onClick={handleDialogToggle(task)}>
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
          <Dialog
          fullWidth={true}
          open={open.indexOf(task)!== -1} 
          onClose={handleDialogToggle(task)} 
          key={task._id}
          >
          <DialogTitle>
          <TextField
              autoFocus
              margin="dense"
              id="name"
              label={task.name}
              type="text"
              fullWidth
              variant="outlined"
            />
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              id="outlined-select-currency"
              select
              label="Status"
              defaultValue={task.inProg ? 'in-progress': task.isDone ? 'done': 'to-do' } 
              helperText="Change status"
            >
              {status.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogToggle(task)}>Cancel</Button>
            <Button onClick={handleDialogToggle(task)}>Confirm</Button>
          </DialogActions>
        </Dialog>
          </>
        )
      }
    })}
  </List>
  </>
  )
}
