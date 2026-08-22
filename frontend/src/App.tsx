import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { PageLoader } from '@/components/layout/PageLoader'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const AIAgronomist = lazy(() => import('@/pages/AIAgronomist'))
const WeatherPage = lazy(() => import('@/pages/WeatherPage'))
const Marketplace = lazy(() => import('@/pages/Marketplace'))
const LivestockCrops = lazy(() => import('@/pages/LivestockCrops'))
const FinancialLedger = lazy(() => import('@/pages/FinancialLedger'))
const Community = lazy(() => import('@/pages/Community'))
const Profile = lazy(() => import('@/pages/Profile'))
const Settings = lazy(() => import('@/pages/Settings'))
const ComingSoon = lazy(() => import('@/pages/ComingSoon'))

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-agronomist" element={<AIAgronomist />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/cimilada" element={<WeatherPage />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/livestock-crops" element={<LivestockCrops />} />
            <Route path="/livestock" element={<LivestockCrops />} />
            <Route path="/financial-ledger" element={<FinancialLedger />} />
            <Route path="/ledger" element={<FinancialLedger />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="*"
              element={
                <ComingSoon
                  title="Page Not Found"
                  description="The page you requested is under construction or does not exist."
                />
              }
            />
          </Routes>
        </Suspense>
      </MainLayout>
    </BrowserRouter>
  )
}
