import TodoList from "../components/TodoList";
import AddTodo from "../components/AddTodo";
import SideBar from "../components/SideBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

export default function Home() {
  return (
    <div>
      <Box sx={{ display:'flex'}}>
      <SideBar />
      <Stack
      justifyContent="center"
      alignItems="center" 
      spacing={{ xs: 1, sm: 2, md: 4 }}
      sx = {{ flexGrow: 2, pt: 10 }}
      >
        <AddTodo />
        <TodoList />
      </ Stack>
      </Box>
    </div>
  )
}
