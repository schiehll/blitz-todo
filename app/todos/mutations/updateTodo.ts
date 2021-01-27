import { Ctx } from "blitz"
import db, { Prisma } from "db"

type UpdateTodoInput = Pick<Prisma.TodoUpdateArgs, "where" | "data">

export default async function updateTodo({ where, data }: UpdateTodoInput, ctx: Ctx) {
  // ctx.session.authorize()

  const todo = await db.todo.update({ where, data })

  return todo
}
