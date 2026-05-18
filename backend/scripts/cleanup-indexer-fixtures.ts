/**
 * Removes the integration-test fixture footprint that leaks into the catalog
 * when the API suite runs against a shared database (no isolated test DB).
 *
 * createIndexerFixture marks everything with stable prefixes:
 *   tickets/onchain_events  contract_address  C_IDX_*
 *   events                  slug              indexer-*
 *   venues                  name              Indexer Venue *
 *   organizers              legal_name        Indexer Organizer *
 *   users                   email             indexer-*@stellar-tickets.local
 *   event_categories        code              IDX
 *
 * Shared real rows (city Medellín) are upserted by the fixture and left alone.
 *
 * Usage:
 *   cd backend
 *   npx tsx scripts/cleanup-indexer-fixtures.ts          # dry-run
 *   APPLY=1 npx tsx scripts/cleanup-indexer-fixtures.ts  # delete
 */
import dotenv from 'dotenv';
dotenv.config({ path: process.env.ENV_FILE || '.env', override: true });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const apply = process.env.APPLY === '1';

async function main() {
  const events = await prisma.events.findMany({
    where: { slug: { startsWith: 'indexer-' } },
    select: { id: true, slug: true, title: true },
  });
  const tickets = await prisma.tickets.count({
    where: { contract_address: { startsWith: 'C_IDX_' } },
  });
  const onchain = await prisma.onchain_events.count({
    where: { contract_address: { startsWith: 'C_IDX_' } },
  });
  const venues = await prisma.venues.findMany({
    where: { name: { startsWith: 'Indexer Venue ' } },
    select: { id: true },
  });
  const organizers = await prisma.organizers.findMany({
    where: { legal_name: { startsWith: 'Indexer Organizer ' } },
    select: { id: true },
  });
  const users = await prisma.users.findMany({
    where: { email: { startsWith: 'indexer-', endsWith: '@stellar-tickets.local' } },
    select: { id: true },
  });

  console.log(`Mode: ${apply ? 'APPLY' : 'DRY_RUN'}`);
  console.log(`tickets(C_IDX_*):        ${tickets}`);
  console.log(`onchain_events(C_IDX_*): ${onchain}`);
  console.log(`events(indexer-*):       ${events.length}`);
  console.log(`venues(Indexer Venue):   ${venues.length}`);
  console.log(`organizers(Indexer Org): ${organizers.length}`);
  console.log(`users(@...local):        ${users.length}`);
  for (const e of events) console.log(`  event ${e.slug} :: ${e.title}`);

  if (!apply) {
    await prisma.$disconnect();
    return;
  }

  // FK order: dependent rows first. tickets/onchain_events link by string
  // (no FK). events cascade their children. venues/organizers/category are
  // NOT NULL parents of events, so delete events before them.
  const dTickets = await prisma.tickets.deleteMany({
    where: { contract_address: { startsWith: 'C_IDX_' } },
  });
  const dOnchain = await prisma.onchain_events.deleteMany({
    where: { contract_address: { startsWith: 'C_IDX_' } },
  });
  const dEvents = await prisma.events.deleteMany({
    where: { id: { in: events.map((e) => e.id) } },
  });
  const dVenues = await prisma.venues.deleteMany({
    where: { id: { in: venues.map((v) => v.id) } },
  });
  const dOrganizers = await prisma.organizers.deleteMany({
    where: { id: { in: organizers.map((o) => o.id) } },
  });
  const dUsers = await prisma.users.deleteMany({
    where: { id: { in: users.map((u) => u.id) } },
  });

  const remainingIdxEvents = await prisma.events.count({
    where: { event_categories: { code: 'IDX' } },
  });
  let dCategory = 0;
  if (remainingIdxEvents === 0) {
    const r = await prisma.event_categories.deleteMany({ where: { code: 'IDX' } });
    dCategory = r.count;
  }

  console.log(
    `Deleted -> tickets:${dTickets.count} onchain:${dOnchain.count} ` +
      `events:${dEvents.count} venues:${dVenues.count} ` +
      `organizers:${dOrganizers.count} users:${dUsers.count} category:${dCategory}`,
  );
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
