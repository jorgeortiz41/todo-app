import TodoList from "../components/TodoList";
import AddTodo from "../components/AddTodo";
import { Container, Stack } from "@mui/material";

export default function Home() {
  return (
    <div>
      <Container maxWidth="lg">
      <Stack
      justifyContent="center"
      alignItems="center" 
      spacing={2}
      >
        <h1>Simple To-Do App</h1>
        <AddTodo />
        <TodoList />
      </ Stack>
      </Container>
    </div>
  )
}
