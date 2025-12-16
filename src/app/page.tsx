import Header from '@/components/Header';
import VideoSection from '@/components/VideoSection';

export default function Home() {
  return (
    <main style={{ position: 'relative', width: '1080px', height: '1920px', overflow: 'hidden' }}>
      <VideoSection />
      <Header />
    </main>
  );
}
