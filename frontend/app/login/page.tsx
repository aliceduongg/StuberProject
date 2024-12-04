import { AuthForm } from '../components/auth-form'
import Layout from '../components/layout'

export default function Login() {
  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-purple-700">
        <AuthForm type="login" />
      </div>
    </Layout>
  )
}

