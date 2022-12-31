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
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ListIcon from '@mui/icons-material/List';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

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
    icon: <PriorityHighIcon/>},
    {title: 'Tasks',
    icon: <AssignmentIcon/>},
];
const folders = [
    {title: 'CustomList',
    icon: <ListIcon/>},
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

export default function SideBar(props) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [dopen, setDopen] = useState(false);
    const [name, setName] = useState('')
    const [lists, setLists] = useState(null)
    const [selectedIndex, setSelectedIndex] = React.useState(0);
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
        .then(res => console.log(res))
        .catch(err => console.log(err));
  
    // e.preventDefault();
    window.location.reload(false);
    setName('');
    setDopen(false);
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
            </ListItem>
            </>
          ))}
        </List>
        <Divider />
        <ListItem key="add" disablePadding sx={{ display: 'block'}}>
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
            <ListItemText primary="Add New List" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
        <Dialog open={dopen} onClose={handleDialogClose}>
        <DialogTitle>Add New List</DialogTitle>
        <DialogContent>
          
          <DialogContentText>
            Please enter the name of the new list
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="List Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            <ListItem key={i} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
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
            </ListItem>
          ))}
        </List>
      </Drawer>
      <DrawerHeader />
        </>
    )
};
