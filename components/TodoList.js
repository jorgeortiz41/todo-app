import { useState, useEffect } from 'react'
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


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
      })
  }, [])

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
  };

  //displayed when loading or no data
  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No task data</p>



  return (
    <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
    {data.map((task) => {
      const labelId = `checkbox-list-label-${task.name}`;

      return (
        <ListItem
          key={task.id}
          secondaryAction={
            <IconButton edge="end" aria-label="comments">
              <CommentIcon />
              <EditIcon />
              <DeleteIcon />
            </IconButton>
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
      );
    })}
  </List>
  )
}
