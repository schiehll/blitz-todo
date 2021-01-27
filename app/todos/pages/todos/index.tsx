import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { usePaginatedQuery, useRouter, useMutation, BlitzPage } from "blitz"
import getTodos from "app/todos/queries/getTodos"
import createTodo from "app/todos/mutations/createTodo"
import updateTodo from "app/todos/mutations/updateTodo"
import deleteTodo from "app/todos/mutations/deleteTodo"
import {
  Box,
  InputGroup,
  InputRightAddon,
  Flex,
  Heading,
  Input,
  Button,
  IconButton,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react"
import { RiCheckboxLine, RiCheckboxBlankLine, RiCloseLine } from "react-icons/ri"

const ITEMS_PER_PAGE = 5

export const TodosList = () => {
  const router = useRouter()
  const [createTodoMutation] = useMutation(createTodo)
  const [updateTodoMutation] = useMutation(updateTodo)
  const [deleteTodoMutation] = useMutation(deleteTodo)
  const page = Number(router.query.page) || 0
  const [{ todos, hasMore }, { refetch, setQueryData }] = usePaginatedQuery(getTodos, {
    orderBy: { createdAt: "desc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  const addTodo = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.target)
      const text = formData.get("text")?.toString() || ""

      if (!text) {
        return
      }

      const data = {
        text,
        done: formData.get("done") === "on",
      }
      await createTodoMutation({ data })
      const updated = await refetch()
      await setQueryData(updated)
    } catch (error) {
      console.log(error)
    } finally {
      e.target.reset()
    }
  }

  const toggleDone = async (todo) => {
    try {
      await updateTodoMutation({
        where: { id: todo.id },
        data: { text: todo.text, done: !todo.done },
      })
      const updated = await refetch()
      await setQueryData(updated)
    } catch (error) {
      console.log(error)
    }
  }

  const removeTodo = async (todo) => {
    try {
      await deleteTodoMutation({
        where: { id: todo.id },
      })
      const updated = await refetch()
      await setQueryData(updated)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Box my="2rem">
        <form onSubmit={addTodo}>
          <InputGroup>
            <Input name="text" type="text" placehodler="Add todo" />
            <InputRightAddon>
              <Button type="submit">Add</Button>
            </InputRightAddon>
          </InputGroup>
        </form>
      </Box>
      <List mb="2rem">
        {todos.map((todo) => (
          <ListItem key={todo.id} boxShadow="xs" mb="1rem">
            <Flex justify="space-between" align="center">
              <Box p="1rem">
                <button onClick={() => toggleDone(todo)}>
                  <ListIcon
                    as={todo.done ? RiCheckboxLine : RiCheckboxBlankLine}
                    color={todo.done ? "green.500" : "gray.300"}
                  />
                  {todo.text}
                </button>
              </Box>

              <IconButton
                aria-label="delete"
                minH="100%"
                mr=".5rem"
                icon={<RiCloseLine />}
                onClick={() => removeTodo(todo)}
              />
            </Flex>
          </ListItem>
        ))}
      </List>

      <Flex justify="space-between">
        <Button disabled={page === 0} onClick={goToPreviousPage}>
          Previous
        </Button>
        <Button disabled={!hasMore} onClick={goToNextPage}>
          Next
        </Button>
      </Flex>
    </>
  )
}

const TodosPage: BlitzPage = () => {
  return (
    <Box maxW="500px" mx="auto" my="6rem">
      <Heading as="h1" size="2xl">
        TODOS
      </Heading>

      <Suspense fallback={<div>Loading...</div>}>
        <TodosList />
      </Suspense>
    </Box>
  )
}

TodosPage.getLayout = (page) => <Layout title={"Todos"}>{page}</Layout>

export default TodosPage
