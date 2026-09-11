import members from '../content/members.json';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/Reveal';
import { Divider } from '../components/Divider';
import { Needed, NeededBox, NeededPanel } from '../components/Needed';
import { GlassCard, GlassLayer } from '../components/Glass';
import { photoByPrefix } from '../lib/photos';

function MemberCard({ member, index }) {
  return (
    <Reveal delay={(index % 3) * 90}>
      <GlassCard tone="light" tilt spotlight className="group flex h-full flex-col overflow-hidden">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className="aspect-[3/4] w-full object-cover"
          />
        ) : (
          <NeededBox aspect="aspect-[3/4]" className="rounded-none border-0 border-b-2">
            Headshot for {member.name}
          </NeededBox>
        )}

        <GlassLayer className="flex flex-1 flex-col p-6">
          {member.mr && <p className="font-display text-xl text-marigold">{member.mr}</p>}
          <h2 className="mt-0.5 font-display text-2xl text-espresso">{member.name}</h2>
          <p className="mt-1 font-body text-sm font-600 uppercase tracking-[0.1em] text-terracotta">
            {member.role ?? <Needed>Role</Needed>}
          </p>
          <div className="mt-3 flex-1 font-body text-espresso/70">
            {member.bio ? <p>{member.bio}</p> : <Needed>Short bio</Needed>}
          </div>
        </GlassLayer>
      </GlassCard>
    </Reveal>
  );
}

export function Members() {
  const items = members.items;
  // A group-* photo in src/assets/photos wins over the JSON path, so dropping
  // a file in is enough — no content edit needed.
  const group = members.groupPhoto ?? photoByPrefix('group-')?.src ?? null;

  return (
    <>
      <PageHeader
        mr="सदस्य"
        en="The Collective"
        lead="The people behind the sound."
      />

      <section className="texture-cloth">
        <div className="mx-auto max-w-7xl px-5 py-18 sm:px-8">
          {/* Group shot */}
          <Reveal>
            {group ? (
              <img
                src={group}
                alt="The Folklok collective"
                loading="lazy"
                decoding="async"
                className="aspect-[21/9] w-full rounded-xl object-cover"
              />
            ) : (
              <NeededBox aspect="aspect-[21/9]">
                A group shot of the whole collective — ideally with the
                instruments, somewhere that looks like you.
              </NeededBox>
            )}
          </Reveal>

          <Reveal delay={100} className="mt-8">
            {members.howWeMet ? (
              <p className="mx-auto max-w-prose text-center font-body text-lg text-espresso/80">
                {members.howWeMet}
              </p>
            ) : (
              <NeededPanel title="How the collective came together">
                A short paragraph on how the members found each other. Sits under
                the group photo.
              </NeededPanel>
            )}
          </Reveal>

          <Divider />

          {items.length === 0 ? (
            <Reveal>
              <NeededPanel title="No members added yet">
                Add one entry per member to{' '}
                <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">
                  src/content/members.json
                </code>{' '}
                — name, Devanagari name, role or instrument, a short bio and a
                photo path. Cards build themselves from that file, so nothing
                here needs editing as the line-up changes.
              </NeededPanel>
            </Reveal>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((m, i) => (
                <MemberCard key={m.name ?? i} member={m} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
