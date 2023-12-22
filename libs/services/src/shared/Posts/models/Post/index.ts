/**
 * Represents the structure of a post.
 */
export interface Post {
  /** The unique identifier of the user who created the post. */
  userId: number;

  /** The unique identifier of the post. */
  id: number;

  /** The title of the post. */
  title: string;

  /** The body content of the post. */
  body: string;
}
