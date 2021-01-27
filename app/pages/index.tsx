import { BlitzPage } from "blitz"
import Layout from "app/layouts/Layout"
import Todos from "app/todos/pages/todos"

const Home: BlitzPage = () => {
  return <Todos />
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
