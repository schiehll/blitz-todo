import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetTodosInput = Pick<Prisma.FindManyTodoArgs, "where" | "orderBy" | "skip" | "take">

export default async function getTodos(
  { where, orderBy, skip = 0, take }: GetTodosInput,
  ctx: Ctx
) {
  // ctx.session.authorize()

  const todos = await db.todo.findMany({
    where,
    orderBy,
    take,
    skip,
  })

  const count = await db.todo.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    todos,
    nextPage,
    hasMore,
    count,
  }
}
