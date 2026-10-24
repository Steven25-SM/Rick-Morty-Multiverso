
import { NextRequest, NextResponse } from "next/server";

const API = "https://rickandmortyapi.com/api/character";

export async function GET(request: NextRequest) {
  const params = new URLSearchParams();

  const allowed = ["page", "name", "status", "type", "gender"];

  for (const key of allowed) {
    const value = request.nextUrl.searchParams.get(key);
    if (value) {
      params.set(key, value);
    }
  }

  try {
    const response = await fetch(`${API}?${params.toString()}`, {
        next: {
            revalidate: 3600,
        },
    });

    if (response.status === 404) {
      return NextResponse.json({
        info: {
          count: 0,
          pages: 0,
          next: null,
          prev: null,
        },
        results: [],
      });
    }

    if (response.status === 429) {
  return NextResponse.json(
    {
      error:
        "La API está recibiendo demasiadas solicitudes. Intenta nuevamente más tarde.",
    },
    {
      status: 503,
      headers: {
        "Retry-After": response.headers.get("retry-after") ?? "60",
      },
    }
  );
}

    if (!response.ok) {
  console.error(
    "Error de Rick and Morty API:",
    response.status,
    response.statusText
  );

  return NextResponse.json(
    {
      error: `Error de API externa: ${response.status}`,
    },
    { status: response.status }
  );
}

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error consultando personajes:", error);

    return NextResponse.json(
      { error: "Error de conexión con Rick and Morty API" },
      { status: 502 }
    );
  }
}
