import type { Character, CharacterResponse } from '@/types/rick-morty';
const BASE = 'https://rickandmortyapi.com/api/character';
export const TEN_DAYS = 864000;

export async function getFirstPage(): Promise<CharacterResponse> {
  const response = await fetch(BASE, { cache: 'force-cache', next: { revalidate: TEN_DAYS } });
  if (!response.ok) throw new Error('No se pudo cargar el catálogo');
  return response.json();
}

export async function getCharacter(id: string): Promise<Character | null> {
  const response = await fetch(`${BASE}/${id}`, { next: { revalidate: TEN_DAYS } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('No se pudo cargar el personaje');
  return response.json();
}

export async function getAllCharacterIds(): Promise<string[]> {
  const first = await getFirstPage();
  const pageNumbers = Array.from({ length: first.info.pages - 1 }, (_, i) => i + 2);
  const pages = await Promise.all(pageNumbers.map(async page => {
    const response = await fetch(`${BASE}?page=${page}`, { next: { revalidate: TEN_DAYS } });
    if (!response.ok) throw new Error(`No se pudo cargar la página ${page}`);
    return response.json() as Promise<CharacterResponse>;
  }));
  return [first, ...pages].flatMap(page => page.results.map(person => String(person.id)));
}
