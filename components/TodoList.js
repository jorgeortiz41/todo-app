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
  const [name, setName] = useState('')
  const [stat, setStat] = useState('')
  const [notes, setNotes] = useState('')
  const [category, setCategory] = useState('')


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

  ////////////////////////////ON-CHANGE EFFECTS/////////////////////////////////////////////////

  const handleNameChange = (event) => {
    //use setTask to update the task object
    setName(event.target.value)
  };

  const handleStatusChange = (event) => {
    // event.target.value
    if (event.target.value === "to-do") {
      setStat("to-do");
    } else if (event.target.value === "in-progress") {
      setStat("in-progress");
    } else {
      setStat("done");
    }
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value)
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value)
  };

  //////////////////////////CRUD/////////////////////////////////////////////////

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

  //async function to take dialog field values and update task in database
  const updateTask = async (value) => {
    const newName = name === '' ? value.name : name;
    const newNotes = notes === '' ? value.notes : notes;
    const newCategory = category === '' ? value.cat : category;
    const newStat = stat === '' ? value.status : stat;
    const response = await fetch('http://localhost:5000/api/updatetask/' + value._id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: newName,
            notes: newNotes,
            cat: newCategory,
            status: newStat,
        }),
    });
    const body = await response.json();
    if (response.status !== 200) {
        throw Error(body.message)
    }

    return body;
  };

  //handle task isDone property update by id
  const checkboxUpdateStatusTask = async (value) => {
    let isDone = '';

    if (value.status === 'to-do') {
      isDone = 'done';
    } else if (value.status === 'in-progress') {
      isDone = 'done';
    } else {
      isDone = 'to-do';
    }

    const response = await fetch('http://localhost:5000/api/updatetask/' + value._id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            status: isDone,
        }),
    });
    const body = await response.json();
    if (response.status !== 200) {
        throw Error(body.message)
    }
    return body;
  };

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
  };

  ////////////////////////////TOGGLES/////////////////////////////////////

  //handle checkbox behavior
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];    


    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    
    setChecked(newChecked);
    
    //update isDone property of task in database to match checkbox state
    checkboxUpdateStatusTask(value)
        .then(res => console.log(res))
        .catch(err => console.log(err));
        console.log("task has been updated");
        
    window.location.reload(false);
  };

  //handle task dialog toggle
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

  //handle task importance toggle
  const handleImportantToggle = (value) => () => {
    //call updateImportanceTask function
    updateImportanceTask(value)
        .then(res => console.log(res))
        .catch(err => console.log(err));
        console.log("task importance has been updated");

    window.location.reload(false);
  };

  //handle task dialog submit
  const handleClose = (value) => {
    //update task in database
    updateTask(value)
        .then(res => console.log(res))
        .catch(err => console.log(err));
        console.log("task has been edited");
    
    handleDialogToggle(value);
    window.location.reload(false);
  };

  //displayed when loading or no data
  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No task data</p>



  return (
    <>
    <List sx={{ width: '100%', maxWidth: "80%", bgcolor: 'background.paper' }}>
    <ListSubheader>To-do</ListSubheader>
    <Divider variant="middle" />
    {/* Display tasks checked if isDone is true and unchecked if isDone is false */}
    {data.map((task, i) => {
      const labelId = `checkbox-list-label-${task._id}`;

      if (task.status == "to-do") {
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
                value={name}
                defaultValue={task.name}
                onChange= {handleNameChange}
                type="text"
                fullWidth
                variant="outlined"
                helperText="Change task name"
  
              />
            </DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                id="outlined-select-status"
                select
                label={task.status}
                placeholder={task.status}
                defaultValue='to-do' 
                helperText="Change status"
                value={stat}
                onChange={handleStatusChange}
              >
                {status.map((stat) => (
                  <MenuItem key={stat.value} value={stat.value}>
                    {stat.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="dense"
                id="outlined-select-category"
                select
                placeholder={task.cat}
                label={task.cat}
                defaultValue={task.cat} 
                value={category}
                onChange={handleCategoryChange}
                helperText="Change category"
                sx={{ml: 2}}
              >
                {categories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label={task.notes}
                value={notes}
                defaultValue={task.notes}
                onChange= {handleNotesChange}
                type="text"
                fullWidth
                variant="outlined"
                multiline
                helperText="Notes"
                maxRows={6}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogToggle(task)}>Cancel</Button>
              <Button onClick={() => handleClose(task)}>Confirm</Button>
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
    {/* Display in-progress list items */}
    {data.map((task, i) => {
      const labelId = `checkbox-list-label-${task._id}`;

      if (task.status == "in-progress") {
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
                value={name}
                defaultValue={task.name}
                onChange= {handleNameChange}
                type="text"
                fullWidth
                variant="outlined"
                helperText="Change task name"
  
              />
            </DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                id="outlined-select-status"
                select
                placeholder={task.status}
                label={task.status}
                defaultValue='to-do' 
                helperText="Change status"
                value={stat}
                onChange={handleStatusChange}
                
              >
                {status.map((stat) => (
                  <MenuItem key={stat.value} value={stat.value}>
                    {stat.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="dense"
                id="outlined-select-category"
                select
                placeholder={task.cat}
                label={task.cat}
                defaultValue={task.cat} 
                value={category}
                onChange={handleCategoryChange}
                helperText="Change category"
                sx={{ml: 2}}
              >
                {categories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label={task.notes}
                value={notes}
                defaultValue={task.notes}
                onChange= {handleNotesChange}
                type="text"
                fullWidth
                variant="outlined"
                multiline
                helperText="Notes"
                maxRows={6}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogToggle(task)}>Cancel</Button>
              <Button onClick={() => handleClose(task)}>Confirm</Button>
            </DialogActions>
            </Dialog>
    
        </>
        )
      }
    })}
  </List>
  <List sx={{ width: '100%', maxWidth: "80%", bgcolor: 'background.paper' }}>
    <ListSubheader>Done</ListSubheader>
    <Divider variant="middle" />
    {/* Display checked list items */}
    {data.map((task, i) => {
      const labelId = `checkbox-list-label-${task._id}`;

      if (task.status == "done") {
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
                value={name}
                defaultValue={task.name}
                onChange= {handleNameChange}
                type="text"
                fullWidth
                variant="outlined"
                helperText="Change task name"
  
              />
            </DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                id="outlined-select-status"
                select
                placeholder={task.status}
                label={task.status}
                defaultValue='to-do' 
                helperText="Change status"
                value={stat}
                onChange={handleStatusChange}
                
              >
                {status.map((stat) => (
                  <MenuItem key={stat.value} value={stat.value}>
                    {stat.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="dense"
                id="outlined-select-category"
                select
                placeholder={task.cat}
                label={task.cat}
                defaultValue={task.cat} 
                value={category}
                onChange={handleCategoryChange}
                helperText="Change category"
                sx={{ml: 2}}
              >
                {categories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label={task.notes}
                value={notes}
                defaultValue={task.notes}
                onChange= {handleNotesChange}
                type="text"
                fullWidth
                variant="outlined"
                multiline
                helperText="Notes"
                maxRows={6}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogToggle(task)}>Cancel</Button>
              <Button onClick={() => handleClose(task)}>Confirm</Button>
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
