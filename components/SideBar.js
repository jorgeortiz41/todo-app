import * as React from 'react';
import { useState, useEffect } from 'react'
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import WorkIcon from '@mui/icons-material/Work';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import ListIcon from '@mui/icons-material/List';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ButtonGroup from '@mui/material/ButtonGroup';
import StarIcon from '@mui/icons-material/Star';
import Tooltip from '@mui/material/Tooltip';


///////////////////////////SIDEBAR SETTINGS/////////////////////////////////////////
const drawerWidth = 240;
const category = [
    {title: 'All',
    icon: <AllInclusiveIcon/>},
    {title: 'Work',
    icon: <WorkIcon/>},
    {title: 'Home',
    icon: <HomeIcon/>},
    {title: 'School',
    icon: <SchoolIcon/>},
    {title: 'Important',
    icon: <StarIcon/>},
    {title: 'Tasks',
    icon: <AssignmentIcon/>},
];

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });
  
const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });
  
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));
  
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));
  
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
    }),
  );

////////////////////////////////////////////////////////////////////////////////////

export default function SideBar(props) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [dopen, setDopen] = useState(false);
    const [edit, setEdit] = useState([0]);
    const [name, setName] = useState('')
    const [lists, setLists] = useState(null)
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [customIndex, setCustomIndex] = React.useState(-1);
    const [isListLoading, setIsListLoading] = useState(true);

    //useEffect to get lists from localhost:5000/lists and set them to data state
    useEffect(() => {
      setIsListLoading(true)
      fetch('http://localhost:5000/api/lists')
        .then((res) => res.json())
        .then((lists) => {
          setLists(lists)
          setIsListLoading(false)
          console.log(lists)
        })
    }, [])
        

    //function on click to filter category and pass to parent component
    const handleClick = (cat, index) => {
        props.parentCallback(cat);
        setSelectedIndex(index);
        setCustomIndex(-1);
    }

    const handleListClick = (list, index) => {
      props.listParentCallback(list);
      setCustomIndex(index);
      setSelectedIndex(-1);
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleDialogOpen = () => {
      setDopen(true);
    };

    const handleDialogClose = () => {
      setDopen(false);
      //reset form fields on close
      setName('');
    };

    //funcion to get lists from localhost:5000/lists and set them to data state and catch error
    const getLists = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/lists')
        const data = await response.json()
        setLists(data)
      } catch (error) {
        console.log(error)
      }
    }

    //handle dialog for custom list edit button
    const handleEdit = (value) => () => {
      const currentIndex = edit.indexOf(value);
      const newEdit = [...edit];
  
      if (currentIndex === -1) {
        newEdit.push(value);
      } else {
        newEdit.splice(currentIndex, 1);
        //reset form fields
        setName('');
      }
  
      setEdit(newEdit);
    };
      
    //handle edit dialog close
    const handleEditConfirm = (list)  => {
      const sendUpdate = async (list) => {
        const newName = name === '' ? list.name : name;
        const response = await fetch('http://localhost:5000/api/updatelist/' + list._id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newName,
          }),
        });
        const body = await response.json();
        if (response.status !== 200) {
          throw Error(body.message)
        }
        return body;
      };

      sendUpdate(list)
        .then(res => {console.log(res)
          getLists()
        })
        .catch(err => console.log(err));
        console.log("list updated");

      // e.preventDefault();
      setName('');
      handleEdit(list);
    };


    //handle add list dialog close
    const handleClose = () => {
      const sendEvent = async () => {
        const response = await fetch('http://localhost:5000/api/addlist/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
          }),
        });
        const body = await response.json();
        if (response.status !== 200) {
          throw Error(body.message)
        }
        return body;
      };

      sendEvent()
        .then(res => {console.log(res)
          getLists()
        })
        .catch(err => console.log(err));
  
    // e.preventDefault();
    setName('');
    setDopen(false);
    };

    //handle delete list by id
    const handleDelete = (id) => {
      const sendEvent = async () => {
        const response = await fetch('http://localhost:5000/api/eraselist/' + id, {
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
      sendEvent()
        .then(res => {console.log(res)
          getLists()
        })
        .catch(err => console.log(err));

    // e.preventDefault();
    };

    if (isListLoading) return <p>Loading...</p>
    if (!lists) return <p>No list data</p>

    return(
        <>
        <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Simple To Do App
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
          <List>
            {category.map((text, i) => (
              <>
              <ListItem key={i} disablePadding sx={{ display: 'block' }}>
              <Tooltip title={text.title} placement="right">
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  selected={selectedIndex === i}
                  onClick={() => handleClick(text.title, i)}
                >
                  
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {text.icon}
                  </ListItemIcon>
                  
                  <ListItemText primary={text.title} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
                </Tooltip>
              </ListItem>
              </>
            ))}
          </List>
        <Divider />
          <ListItem key="add" disablePadding sx={{ display: 'block'}}>
            <Tooltip title="Add Custom List" placement="right">
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                pt: 5,
                pb: 5
              }}
              onClick={handleDialogOpen}
            >

              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <PlaylistAddIcon />
              </ListItemIcon>
              <ListItemText primary="Add Custom List" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
            </Tooltip>
          </ListItem>
          <Dialog open={dopen} onClose={handleDialogClose}>
          <DialogTitle>Add Custom List</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="List Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              helperText="Please enter a name for the custom list."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={() => handleClose()}>Add</Button>
          </DialogActions>
          </Dialog>
        <Divider />
        <List>
          {lists.map((list, i) => (
            <>
            <ListItem 
            key={i} 
            disablePadding 
            sx={{ display: 'block' }}
            secondaryAction={
              <ButtonGroup sx={{
                justifyContent: open ? 'initial' : 'center',
                opacity: open ? 1 : 0 
              }}
              >
              <Tooltip title="Edit" disableInteractive followCursor>
              <IconButton edge="end" aria-label="edit" onClick={handleEdit(list)} disabled={open ? false : true}>
                <EditIcon />
              </IconButton>
              </Tooltip>
              <Tooltip title="Delete" disableInteractive followCursor>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(list._id)} disabled={open ? false : true}> 
                <DeleteIcon />
              </IconButton>
              </Tooltip>
            </ButtonGroup>
            }
            >
              <Tooltip title={list.name} placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                selected={customIndex === i}
                onClick={() => handleListClick(list.name, i)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <ListIcon />
                </ListItemIcon>
                <ListItemText primary={list.name} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
              </Tooltip>
            </ListItem>
            <Dialog open={edit.indexOf(list)!== -1 } onClose={handleEdit(list)}>
              <DialogTitle>Edit Custom List</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label={list.name}
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    helperText="Rename list."
                  />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleEdit(list)}>Cancel</Button>
                <Button onClick={() => handleEditConfirm(list)}>Confirm</Button>
              </DialogActions>
            </Dialog>
            </>
          ))}
        </List>
      </Drawer>
      <DrawerHeader />
        </>
    )
};
