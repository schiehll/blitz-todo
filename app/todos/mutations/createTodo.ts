import { Ctx } from "blitz"
import db, { Prisma } from "db"

type CreateTodoInput = Pick<Prisma.TodoCreateArgs, "data">
export default async function createTodo({ data }: CreateTodoInput, ctx: Ctx) {
  // ctx.session.authorize()

  const todo = await db.todo.create({ data })

  return todo
}
