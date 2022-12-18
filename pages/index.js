import TodoList from "../components/TodoList";
import AddTodo from "../components/AddTodo";
import Container from '@mui/material/Container';

export default function Home() {
  return (
    <div>
      <Container maxWidth="sm">
        <h1>Simple To-Do App</h1>
        <AddTodo />
        <TodoList />
      </ Container>
    </div>
  )
}
