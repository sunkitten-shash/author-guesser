import { readFileSync, writeFileSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';

// This is probably necessary for allowing both GET and PATCH in the same route
// per https://github.com/vercel/next.js/discussions/69331
export const dynamic = 'force-dynamic';

export async function GET() {
  let shipMappings = readFileSync('./app/_data/ship_mappings.json', 'utf-8');
  shipMappings = JSON.parse(shipMappings);

  return NextResponse.json(shipMappings ?? {});
}

export async function PATCH(request: NextRequest) {
  const newShipMappings = await request.json();
  writeFileSync(
    './app/_data/ship_mappings.json',
    JSON.stringify(newShipMappings),
  );

  return NextResponse.json({});
}
