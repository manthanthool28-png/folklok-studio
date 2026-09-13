import { Link } from 'react-router-dom';
import blog from '../content/blog.json';
import { PageHeader } from '../components/PageHeader';
import { ScatteredInstruments } from '../components/ScatteredInstruments';
import { Reveal } from '../components/Reveal';
import { Divider } from '../components/Divider';
import { GlassCard, GlassLayer } from '../components/Glass';
import { Needed, NeededPanel } from '../components/Needed';
import { IconArrow } from '../components/Icons';
import { photoByPrefix } from '../lib/photos';
import { sortedPosts, formatPostDate, postPhoto } from '../lib/blog';

/** The founder's byline card — shared between the listing and each post. */
export function AuthorCard({ compact = false }) {
  const { author } = blog;
  const portrait = author.photo ?? photoByPrefix('author-')?.src ?? null;

  return (
    <GlassCard
      tone="light"
      spotlight
      className={`flex items-center gap-5 ${compact ? 'p-5' : 'p-7'}`}
    >
      {portrait ? (
        <img
          src={portrait}
          alt={author.name ?? 'The founder of Folklok'}
          loading="lazy"
          decoding="async"
          className="h-16 w-16 shrink-0 rounded-full object-cover sm:h-20 sm:w-20"
        />
      ) : (
        <span
          data-needed
          title="Portrait needed"
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-dashed
            border-terracotta/60 bg-terracotta/8 font-display text-2xl text-terracotta sm:h-20 sm:w-20"
        >
          ◆
        </span>
      )}

      <div className="min-w-0">
        <p className="font-body text-[0.68rem] font-600 uppercase tracking-[0.18em] text-terracotta">
          {author.role}
        </p>
        <p className="mt-1 font-display text-xl text-espresso">
          {author.name ?? <Needed>Founder's name</Needed>}
        </p>
        {!compact && (
          <div className="mt-2 font-body text-espresso/70">
            {author.bio ?? <Needed>Short bio</Needed>}
          </div>
        )}
      </div>
    </GlassCard>
  );
}

export function Blog() {
  const posts = sortedPosts();

  return (
    <>
      <PageHeader
        mr="मनोगत"
        en="From the Founder"
        lead="Notes on the songs, the road, and why any of this is worth doing."
      />

      <section className="texture-cloth relative overflow-hidden">
        <ScatteredInstruments preset="reeds" tone="light" />
        <div className="mx-auto max-w-4xl px-5 py-18 sm:px-8">
          <Reveal>
            <AuthorCard />
          </Reveal>

          <Divider />

          {posts.length === 0 ? (
            <Reveal>
              <NeededPanel title="No posts written yet">
                Add entries to{' '}
                <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">
                  src/content/blog.json
                </code>
                . Each needs a slug, title, date and a body made of blocks —{' '}
                <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">p</code>,{' '}
                <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">h2</code> or{' '}
                <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">quote</code>. The file
                has a worked example under <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-sm">_post_shape</code>.
                Posts sort themselves by date, newest first.
              </NeededPanel>
            </Reveal>
          ) : (
            <div className="space-y-6">
              {posts.map((post, i) => {
                const photo = postPhoto(post);
                return (
                  <Reveal key={post.slug} delay={Math.min(i, 5) * 90}>
                    <GlassCard
                      tone="light"
                      spotlight
                      as={Link}
                      to={`/blog/${post.slug}`}
                      className="group block overflow-hidden"
                    >
                      <div className={photo ? 'grid sm:grid-cols-[14rem_1fr]' : ''}>
                        {photo && (
                          <img
                            src={photo}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="h-48 w-full object-cover sm:h-full"
                          />
                        )}
                        <GlassLayer className="p-7">
                          <p className="font-body text-[0.68rem] font-600 uppercase tracking-[0.18em] text-terracotta">
                            {formatPostDate(post)}
                          </p>
                          {post.titleMr && (
                            <p className="mt-2 font-display text-lg text-marigold">{post.titleMr}</p>
                          )}
                          <h2 className="mt-0.5 font-display text-2xl text-espresso">{post.title}</h2>
                          {post.excerpt && (
                            <p className="mt-2 font-body text-espresso/70">{post.excerpt}</p>
                          )}
                          <span className="mt-5 inline-flex items-center gap-1.5 font-body text-sm font-600 text-espresso">
                            Read
                            <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                          </span>
                        </GlassLayer>
                      </div>
                    </GlassCard>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
