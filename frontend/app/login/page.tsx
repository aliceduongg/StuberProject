import { AuthForm } from '../components/auth-form'
import Layout from '../components/layout'

export default function Login() {
  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <AuthForm type="login" />
      </div>
    </Layout>
  )
}

