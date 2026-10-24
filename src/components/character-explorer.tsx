'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Character, CharacterResponse } from '@/types/rick-morty';

interface Props { initial: CharacterResponse }
const API = '/api/characters';
const statuses = ['', 'alive', 'dead', 'unknown'];
const genders = ['', 'female', 'male', 'genderless', 'unknown'];

export default function CharacterExplorer({ initial }: Props) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [gender, setGender] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CharacterResponse>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!name && !status && !type && !gender && page === 1) {
      setData(initial);
      setError('');
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({ page: String(page) });
      if (name.trim()) params.set('name', name.trim());
      if (status) params.set('status', status);
      if (type.trim()) params.set('type', type.trim());
      if (gender) params.set('gender', gender);
      try {
        const res = await fetch(`${API}?${params}`, { signal: controller.signal });
        if (res.status === 404) {
          setData({ info: { count: 0, pages: 0, next: null, prev: null }, results: [] });
          return;
        }
        if (!res.ok) throw new Error('No se pudo consultar la API');
        setData(await res.json());
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Error de búsqueda');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 800);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [name, status, type, gender, page, initial]);

  const inputClass = 'w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-lime-400';
  const selectOptions = (values: string[]) => values.map(v => <option key={v} value={v}>{v ? v[0].toUpperCase() + v.slice(1) : 'Todos'}</option>);
  return (
    <section className="rm-explorer">
      <div className="rm-search-panel grid gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-5 md:grid-cols-4">
        <label className="text-sm text-slate-300">Nombre
          <input className={`${inputClass} mt-2`} placeholder="Busca a Rick, Morty..." value={name} onChange={e => { setName(e.target.value); setPage(1); }} />
        </label>
        <label className="text-sm text-slate-300">Estado
          <select className={`${inputClass} mt-2`} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>{selectOptions(statuses)}</select>
        </label>
        <label className="text-sm text-slate-300">Tipo
          <input className={`${inputClass} mt-2`} placeholder="Ej.: Parasite" value={type} onChange={e => { setType(e.target.value); setPage(1); }} />
        </label>
        <label className="text-sm text-slate-300">Género
          <select className={`${inputClass} mt-2`} value={gender} onChange={e => { setGender(e.target.value); setPage(1); }}>{selectOptions(genders)}</select>
        </label>
      </div>
      <div className="rm-results-bar my-6 flex flex-wrap items-center justify-between gap-3 text-slate-300">
        <p aria-live="polite">{loading ? 'Buscando...' : `${data.info.count} personajes encontrados`}</p>
        <button className="rm-clear-btn rounded-lg border border-slate-600 px-4 py-2 hover:bg-slate-800" onClick={() => { setName(''); setStatus(''); setType(''); setGender(''); setPage(1); }}>Limpiar filtros</button>
      </div>
      {error && <p role="alert" className="mb-6 rounded-lg bg-red-950 p-4 text-red-200">{error}</p>}
      {data.results.length === 0 && !loading && !error && <p className="py-16 text-center text-slate-300">No encontramos personajes con esos filtros.</p>}
      <div className="rm-cards grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {data.results.map((character: Character) => (
          <Link key={character.id} href={`/rick-and-morty/${character.id}`} className="rm-card group overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-xl transition hover:-translate-y-1 hover:border-lime-400">
            <div className="rm-card-photo relative aspect-square overflow-hidden">
              <Image src={character.image} alt={character.name} fill loading="lazy" unoptimized sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-300 group-hover:scale-105" />
            </div>
            <div className="rm-card-content p-4">
              <span className="rm-card-id text-xs font-bold text-lime-400">#{String(character.id).padStart(3, '0')}</span>
              <h2 className="rm-card-name mt-1 line-clamp-1 text-xl font-bold">{character.name}</h2>
              <p className="rm-card-meta mt-2 text-sm text-slate-400">{character.species} · {character.gender}</p>
              <p className="rm-card-status mt-2 text-sm"><span className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${character.status === 'Alive' ? 'bg-green-400' : character.status === 'Dead' ? 'bg-red-500' : 'bg-gray-400'}`} />{character.status}</p>
            </div>
          </Link>
        ))}
      </div>
      {data.info.pages > 1 && <nav aria-label="Paginación" className="rm-pagination mt-10 flex items-center justify-center gap-5">
        <button disabled={page <= 1 || loading} onClick={() => { setPage(p => p - 1); }} className="rounded-xl bg-lime-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-40">Anterior</button>
        <span className="text-slate-200">Página {page} de {data.info.pages}</span>
        <button disabled={page >= data.info.pages || loading} onClick={() => { setPage(p => p + 1); }} className="rounded-xl bg-lime-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-40">Siguiente</button>
      </nav>}
    </section>
  );
}
