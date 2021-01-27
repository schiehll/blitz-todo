import { Ctx } from "blitz"
import db, { Prisma } from "db"

type DeleteTodoInput = Pick<Prisma.TodoDeleteArgs, "where">

export default async function deleteTodo({ where }: DeleteTodoInput, ctx: Ctx) {
  // ctx.session.authorize()

  const todo = await db.todo.delete({ where })

  return todo
}
