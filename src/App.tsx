import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { StoreProvider } from './store/StoreContext'
import { PlayerProvider } from './context/PlayerContext'
import { ChartPlayerProvider } from './context/ChartPlayerContext'
import { Layout } from './components/Layout'
import { RevealObserver } from './components/RevealObserver'
import { EffectsLayer } from './components/EffectsLayer'
import { SplashScreen } from './components/SplashScreen'
// Temporary: onboarding hidden — restore <Onboarding /> when ready
// import { Onboarding } from './components/Onboarding'
import { AdminSessionSync } from './components/AdminSessionSync'
import { Analytics } from './components/Analytics'
import { Home } from './pages/Home'
import { NewsPage, NewsDetailPage } from './pages/News'
import { VideosPage } from './pages/Videos'
import { RappersPage, RapperDetailPage } from './pages/Rappers'
import { RankingsPage } from './pages/Rankings'
import { AuthPage } from './pages/Auth'
import { ProfilePage } from './pages/Profile'
import { ShopPage, MembershipPage } from './pages/Shop'
import { TicketsPage } from './pages/Tickets'
import { ShortsPage } from './pages/Shorts'
import { ReelsPage } from './pages/Reels'
import { PodcastsPage } from './pages/Podcasts'
import { LivePage } from './pages/Live'
import { WallPage } from './pages/Wall'
import { MusicPage } from './pages/Music'
import { ArtistStudioPage } from './pages/ArtistStudio'
import { BattlePage } from './pages/Battle'
import {
  NbaPage,
  NbaUpdatesPage,
  NbaUpdateDetailPage,
  NbaMambaPage,
  NbaFreeAgencyPage,
  NbaFreeAgencyDetailPage,
  NbaSacfunPage,
  NbaFacebookPage,
  NbaQuizPage,
} from './pages/Nba'
import { AboutPage } from './pages/About'
import {
  ContactPage,
  PartnershipPage,
  AdvertisePage,
  PrivacyPage,
  TermsPage,
} from './pages/Corporate'
import { YoutubePostsPage } from './pages/YoutubePosts'
import { AdminPage } from './pages/Admin'
import './effects.css'

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <PlayerProvider>
          <ChartPlayerProvider>
          <BrowserRouter>
            <Analytics />
            <SplashScreen />
            <AdminSessionSync />
            <EffectsLayer />
            <RevealObserver />
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="news" element={<NewsPage />} />
                <Route path="news/:id" element={<NewsDetailPage />} />
                <Route path="videos" element={<VideosPage />} />
                <Route path="rappers" element={<RappersPage />} />
                <Route path="rappers/:id" element={<RapperDetailPage />} />
                <Route path="rankings" element={<RankingsPage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="tickets" element={<TicketsPage />} />
                <Route path="podcasts" element={<PodcastsPage />} />
                <Route path="live" element={<LivePage />} />
                <Route path="wall" element={<WallPage />} />
                <Route path="music" element={<MusicPage />} />
                <Route path="battle" element={<BattlePage />} />
                <Route path="nba" element={<NbaPage />} />
                <Route path="nba/updates" element={<NbaUpdatesPage />} />
                <Route path="nba/updates/:id" element={<NbaUpdateDetailPage />} />
                <Route path="nba/hot" element={<Navigate to="/nba" replace />} />
                <Route path="nba/hot/:id" element={<Navigate to="/nba" replace />} />
                <Route path="nba/mamba" element={<NbaMambaPage />} />
                <Route path="nba/free-agency" element={<NbaFreeAgencyPage />} />
                <Route path="nba/free-agency/:id" element={<NbaFreeAgencyDetailPage />} />
                <Route path="nba/sacfun" element={<NbaSacfunPage />} />
                <Route path="nba/facebook" element={<NbaFacebookPage />} />
                <Route path="nba/youtube" element={<Navigate to="/nba/facebook" replace />} />
                <Route path="nba/quiz" element={<NbaQuizPage />} />
                <Route path="posts" element={<YoutubePostsPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="partnership" element={<PartnershipPage />} />
                <Route path="advertise" element={<AdvertisePage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="artist" element={<ArtistStudioPage />} />
                <Route path="shorts" element={<ShortsPage />} />
                <Route path="reels" element={<ReelsPage />} />
                <Route path="membership" element={<MembershipPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
              <Route path="auth" element={<AuthPage />} />
              <Route path="admin" element={<AdminPage />} />
            </Routes>
          </BrowserRouter>
          </ChartPlayerProvider>
        </PlayerProvider>
      </StoreProvider>
    </AuthProvider>
  )
}
