import Link from 'next/link';
export default function NotFound() {
  return <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#071319] p-8 text-center text-white"><h1 className="text-7xl font-black text-lime-400">404</h1><p className="text-2xl font-bold">Este personaje se perdió en otra dimensión.</p><Link href="/rick-and-morty" className="rounded-xl bg-lime-400 px-6 py-3 font-bold text-black">Volver al multiverso</Link></main>;
}
