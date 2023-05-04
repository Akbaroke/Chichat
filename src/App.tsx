import { BrowserRouter } from 'react-router-dom'
import Router from './router'
import Layout from './components/Layout'
import { QueryClient, QueryClientProvider } from 'react-query'

export default function App() {
  const queryClient = new QueryClient()
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Router />
        </Layout>
      </QueryClientProvider>
    </BrowserRouter>
  )
}
