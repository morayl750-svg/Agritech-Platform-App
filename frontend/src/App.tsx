import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { PageLoader } from '@/components/layout/PageLoader'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { LanguageProvider } from '@/context/LanguageContext'
import AuthPage from '@/pages/AuthPage'
import PWAInstallBanner from '@/components/layout/PWAInstallBanner'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const AIAgronomist = lazy(() => import('@/pages/AIAgronomist'))
const WeatherPage = lazy(() => import('@/pages/WeatherPage'))
const Marketplace = lazy(() => import('@/pages/Marketplace'))
const VegetableMarket = lazy(() => import('@/pages/VegetableMarket'))
const LivestockCrops = lazy(() => import('@/pages/LivestockCrops'))
const FinancialLedger = lazy(() => import('@/pages/FinancialLedger'))
const Community = lazy(() => import('@/pages/Community'))
const Profile = lazy(() => import('@/pages/Profile'))
const Settings = lazy(() => import('@/pages/Settings'))
const ComingSoon = lazy(() => import('@/pages/ComingSoon'))

// Features 02-06
const FarmMap = lazy(() => import('@/pages/FarmMap'))
const CropDiseaseAI = lazy(() => import('@/pages/CropDiseaseAI'))
const MarketPrices = lazy(() => import('@/pages/MarketPrices'))
const YieldPrediction = lazy(() => import('@/pages/YieldPrediction'))

// Features 07-12
const Messages = lazy(() => import('@/pages/Messages'))
const CropSchedule = lazy(() => import('@/pages/CropSchedule'))
const AdminAnalytics = lazy(() => import('@/pages/AdminAnalytics'))

function ProtectedApp() {
  return (
    <MainLayout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-agronomist" element={<AIAgronomist />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/cimilada" element={<WeatherPage />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/pesticides" element={<Marketplace />} />
          <Route path="/khudaar" element={<VegetableMarket />} />
          <Route path="/dalabka-khudaarta" element={<VegetableMarket />} />
          <Route path="/produce" element={<VegetableMarket />} />
          <Route path="/livestock-crops" element={<LivestockCrops />} />
          <Route path="/livestock" element={<LivestockCrops />} />
          <Route path="/financial-ledger" element={<FinancialLedger />} />
          <Route path="/ledger" element={<FinancialLedger />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

          {/* Features 02-06 Routes */}
          <Route path="/farm-map" element={<FarmMap />} />
          <Route path="/crop-disease" element={<CropDiseaseAI />} />
          <Route path="/diagnose" element={<CropDiseaseAI />} />
          <Route path="/market-prices" element={<MarketPrices />} />
          <Route path="/prices" element={<MarketPrices />} />
          <Route path="/yield-prediction" element={<YieldPrediction />} />
          <Route path="/yield-predict" element={<YieldPrediction />} />

          {/* Features 07-12 Routes */}
          <Route path="/messages" element={<Messages />} />
          <Route path="/schedule" element={<CropSchedule />} />
          <Route path="/admin" element={<AdminAnalytics />} />

          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={<Navigate to="/dashboard" replace />} />
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
      <PWAInstallBanner />
    </MainLayout>
  )
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <PageLoader />
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<AuthPage />} />
      </Routes>
    )
  }

  return <ProtectedApp />
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  )
}
