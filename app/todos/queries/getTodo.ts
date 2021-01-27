import { Ctx, NotFoundError } from "blitz"
import db, { Prisma } from "db"

type GetTodoInput = Pick<Prisma.FindFirstTodoArgs, "where">

export default async function getTodo({ where }: GetTodoInput, ctx: Ctx) {
  // ctx.session.authorize()

  const todo = await db.todo.findFirst({ where })

  if (!todo) throw new NotFoundError()

  return todo
}
