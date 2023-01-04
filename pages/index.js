import TodoList from "../components/TodoList";
import Box from "@mui/material/Box";

export default function Home() {
  return (
    <div>
      <Box sx={{ display:'flex'}}>
        <TodoList />
      </Box>
    </div>
  )
}
