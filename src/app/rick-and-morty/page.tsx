import type { Metadata } from 'next';
import CharacterExplorer from '@/components/character-explorer';
import { getFirstPage } from '@/lib/rick-morty';
import './rick-theme.css';

export const metadata: Metadata = { title: 'Rick and Morty | Multiverso', description: 'Explora y filtra personajes del multiverso' };

export default async function RickAndMortyPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  await searchParams;
  const initial = await getFirstPage();
  return (
    <main className="rm-site min-h-screen text-white">
      <div className="rm-glow rm-glow-one" aria-hidden="true" />
      <div className="rm-glow rm-glow-two" aria-hidden="true" />
      <div className="rm-shell mx-auto max-w-7xl px-4">
        <header className="rm-nav">
          <div className="rm-brand" aria-label="Rick and Morty">R<span>&</span>M <small>UNIVERSE</small></div>
        </header>
        <div className="rm-hero">
          <div className="rm-hero-copy">
            <p className="rm-eyebrow">Explorador interdimensional</p>
            <h1>RICK <span>&</span> MORTY</h1>
            <p className="rm-description">Conoce a los personajes de todos los universos. Busca, filtra y descubre sus historias.</p>
          </div>
          <div className="rm-art" aria-hidden="true"><div className="rm-portal"><div className="rm-portal-inner" /></div><span className="rm-orbit rm-orbit-one"/><span className="rm-orbit rm-orbit-two"/></div>
        </div>
        <CharacterExplorer initial={initial} />
        <footer className="rm-footer" aria-hidden="true"><span>R&M // MULTIVERSE</span><span>◈</span></footer>
      </div>
    </main>
  );
}
