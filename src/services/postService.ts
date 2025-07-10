import Post, { IPost, IComment } from '../models/Post';
import mongoose from 'mongoose';

export const createPostService = async (
  author: mongoose.Types.ObjectId,
  content: string,
  image?: string
): Promise<IPost> => {
  return Post.create({ author, content, image, likes: [], comments: [] });
};

export const getAllPostsService = async (): Promise<IPost[]> => {
  return Post.find()
    .populate('author', 'nickname profileImage')
    .populate('comments.user', 'nickname profileImage')
    .sort({ createdAt: -1 });
};

export const getPostByIdService = async (postId: mongoose.Types.ObjectId): Promise<IPost | null> => {
  return Post.findById(postId)
    .populate('author', 'nickname profileImage')
    .populate('comments.user', 'nickname profileImage');
};

export const updatePostService = async (
  postId: mongoose.Types.ObjectId,
  author: mongoose.Types.ObjectId,
  content?: string,
  image?: string
): Promise<IPost | null> => {
  return Post.findOneAndUpdate(
    { _id: postId, author },
    { content, image },
    { new: true }
  );
};

export const deletePostService = async (
  postId: mongoose.Types.ObjectId,
  author: mongoose.Types.ObjectId
): Promise<IPost | null> => {
  return Post.findOneAndDelete({ _id: postId, author });
};

export const toggleLikeService = async (
  postId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
): Promise<{ liked: boolean; likesCount: number }> => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('게시물을 찾을 수 없습니다.');
  const liked = post.likes.some(id => id.equals(userId));
  if (liked) {
    post.likes = post.likes.filter(id => !id.equals(userId));
  } else {
    post.likes.push(userId);
  }
  await post.save();
  return { liked: !liked, likesCount: post.likes.length };
};

export const addCommentService = async (
  postId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  text: string
): Promise<IPost> => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('게시물을 찾을 수 없습니다.');
  const comment: IComment = { user: userId, text, createdAt: new Date() };
  post.comments.push(comment);
  await post.save();
  return post;
};

export const deleteCommentService = async (
  postId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  commentId: string
): Promise<IPost> => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('게시물을 찾을 수 없습니다.');
  const comment = post.comments.id(commentId);
  if (!comment) throw new Error('댓글을 찾을 수 없습니다.');
  if (!comment.user.equals(userId)) throw new Error('삭제 권한이 없습니다.');
  comment.remove();
  await post.save();
  return post;
}; 