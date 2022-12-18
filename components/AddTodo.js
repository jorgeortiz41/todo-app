import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function AddTodo() {
    return(
        <div>
            <TextField id="filled-basic" label="Add a task" variant="filled" />
            <Button variant="contained">+</Button>
        </div>
    )
};
