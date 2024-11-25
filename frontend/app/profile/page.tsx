import { Profile } from '../components/profile'
import Layout from '../components/layout'

export default function ProfilePage() {
  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <Profile />
      </div>
    </Layout>
  )
}

