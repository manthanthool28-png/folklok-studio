import blog from '../content/blog.json';
import { photoByPrefix } from './photos';

/** Posts newest first. Undated entries sort last rather than disappearing. */
export function sortedPosts() {
  return [...blog.posts].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });
}

export function findPost(slug) {
  return blog.posts.find((p) => p.slug === slug) ?? null;
}

export function formatPostDate(post) {
  if (!post.date) return 'Undated';
  const d = new Date(`${post.date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return 'Undated';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** A post's image: an explicit path, or a prefix looked up in the photo folder. */
export function postPhoto(post) {
  if (!post.photo) return null;
  if (post.photo.includes('/') || post.photo.includes('.')) return post.photo;
  return photoByPrefix(post.photo)?.src ?? null;
}
