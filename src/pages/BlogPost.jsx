import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/Reveal';
import { Divider } from '../components/Divider';
import { AuthorCard } from './Blog';
import { IconArrow } from '../components/Icons';
import { findPost, formatPostDate, postPhoto, sortedPosts } from '../lib/blog';

/**
 * Body blocks rather than Markdown. A post is a handful of paragraphs, and a
 * parser would cost more in bundle size than the whole interaction layer.
 */
function Block({ block }) {
  if (block.type === 'h2') {
    return <h2 className="mt-10 font-display text-2xl text-espresso sm:text-3xl">{block.text}</h2>;
  }

  if (block.type === 'quote') {
    return (
      <blockquote className="my-8 border-l-4 border-marigold pl-5">
        <p className="font-display text-xl leading-snug text-espresso sm:text-2xl">{block.text}</p>
      </blockquote>
    );
  }

  return <p className="mt-5 font-body text-lg leading-relaxed text-espresso/85">{block.text}</p>;
}

export function BlogPost() {
  const { slug } = useParams();
  const post = findPost(slug);

  if (!post) {
    return (
      <>
        <PageHeader mr="मनोगत" en="Post not found" />
        <section className="texture-cloth">
          <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
            <p className="font-body text-espresso/70">
              That post doesn't exist — it may have been renamed.
            </p>
            <Link
              to="/blog"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3
                font-body text-sm font-600 text-cream transition-colors hover:bg-espresso-light"
            >
              All posts
            </Link>
          </div>
        </section>
      </>
    );
  }

  const photo = postPhoto(post);
  const others = sortedPosts().filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <PageHeader mr={post.titleMr ?? 'मनोगत'} en={post.title} lead={formatPostDate(post)} />

      <section className="texture-cloth">
        <article className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
          {photo && (
            <Reveal>
              <img
                src={photo}
                alt=""
                loading="lazy"
                decoding="async"
                className="mb-10 aspect-[16/9] w-full rounded-3xl object-cover"
              />
            </Reveal>
          )}

          <Reveal>
            {post.excerpt && (
              <p className="font-body text-xl leading-relaxed text-espresso/75 italic">
                {post.excerpt}
              </p>
            )}
            {post.body?.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </Reveal>

          <Divider />

          <Reveal>
            <AuthorCard compact />
          </Reveal>

          {others.length > 0 && (
            <Reveal delay={120} className="mt-12">
              <h2 className="font-display text-xl text-espresso">More writing</h2>
              <ul className="mt-4 space-y-3">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      to={`/blog/${o.slug}`}
                      className="group inline-flex items-center gap-2 font-body font-600 text-espresso
                        underline decoration-marigold decoration-2 underline-offset-4"
                    >
                      {o.title}
                      <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <Reveal delay={160} className="mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-body text-sm font-600 text-espresso/70
                transition-colors hover:text-espresso"
            >
              <IconArrow className="h-4 w-4 rotate-180" />
              All posts
            </Link>
          </Reveal>
        </article>
      </section>
    </>
  );
}
