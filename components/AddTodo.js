import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';

export default function AddTodo() {
    return(
        <div>
            <TextField
            style={{ width: 500, height: 60 }}
            id="filled-basic" 
            label="Add a task" 
            variant="filled" />

            <Button
            style={{ width: 100, height: 55 }}
            variant="contained" 
            endIcon={<AddIcon />}
             >
            Add
            </Button>
        </div>
    )
};
