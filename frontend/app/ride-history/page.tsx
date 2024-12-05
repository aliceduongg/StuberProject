import Layout from '../components/layout';
import RideHistory  from '../components/RideHistory';

export default function RideHistoryPage() {
  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-purple-700">
        <RideHistory />
        </div>
    </Layout>
  );
};
