import Link from 'next/link';
import '../rick-theme.css';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllCharacterIds, getCharacter } from '@/lib/rick-morty';

export const revalidate = 864000;
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacter(id);
  return { title: character ? `${character.name} | Rick and Morty` : 'Personaje no encontrado' };
}

export default async function CharacterDetail({ params }: Props) {
  const { id } = await params;
  const person = await getCharacter(id);
  if (!person) notFound();
  const entries = [
    ['ID', person.id], ['Nombre', person.name], ['Estado', person.status], ['Especie', person.species],
    ['Tipo', person.type || 'Sin especificar'], ['Género', person.gender],
    ['Origen', person.origin.name], ['URL del origen', person.origin.url || 'Sin URL'],
    ['Última ubicación', person.location.name], ['URL de ubicación', person.location.url || 'Sin URL'],
    ['URL del personaje', person.url], ['Creado', new Date(person.created).toLocaleString('es-PE')],
    ['URL de imagen', person.image],
  ] as const;
  return (
    <main className="rm-site min-h-screen px-4 py-10 text-white">
      <div className="rm-detail-shell mx-auto max-w-5xl">
        <Link href="/rick-and-morty" className="font-bold text-lime-400 hover:underline">← Regresar al multiverso</Link>
        <div className="rm-detail-panel mt-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
          <div className="grid md:grid-cols-[320px_1fr]">
            <div className="rm-detail-portrait relative aspect-square md:aspect-auto md:min-h-[400px]">
              <Image src={person.image} alt={person.name} fill priority unoptimized sizes="(max-width: 768px) 100vw, 320px" className="object-cover" />
            </div>
            <div className="p-6 md:p-10">
              <p className="text-sm font-bold uppercase tracking-widest text-lime-400">Ficha #{person.id}</p>
              <h1 className="rm-detail-heading mt-3 text-4xl font-black md:text-5xl">{person.name}</h1>
              <p className="mt-4 text-lg text-slate-300">{person.species} · {person.status}</p>
              <h2 className="rm-detail-section-heading mb-4 mt-8 text-2xl font-bold">Todos los campos de la API</h2>
              <dl className="grid gap-3 sm:grid-cols-2">
                {entries.map(([label, value]) => <div key={label} className="rm-detail-cell min-w-0 rounded-xl bg-slate-800 p-3"><dt className="text-xs uppercase tracking-wider text-slate-400">{label}</dt><dd className="mt-1 break-all font-medium">{String(value)}</dd></div>)}
              </dl>
            </div>
          </div>
          <div className="border-t border-white/10 p-6 md:p-10">
            <h2 className="rm-detail-section-heading text-2xl font-bold">Episodios ({person.episode.length})</h2>
            <p className="mt-1 text-sm text-slate-400">Se muestran todas las referencias recibidas en el campo episode.</p>
            <div className="mt-5 flex flex-wrap gap-2">{person.episode.map(url => <a key={url} href={url} target="_blank" rel="noreferrer" className="rm-episode rounded-lg bg-slate-800 px-3 py-2 text-sm text-lime-300 hover:bg-slate-700">Episodio {url.split('/').pop()} ↗</a>)}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
