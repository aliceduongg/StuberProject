"use client";

import { Dashboard } from '../components/dashboard';
import {withAuth} from '../components/protected-route';


function DashboardPage() {
  return <Dashboard />;
}

export default withAuth(DashboardPage);



