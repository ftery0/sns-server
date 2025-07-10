import { Request, Response } from 'express';
import Post from '../models/Post';

// 게시물 작성
export const createPost = async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  try {
    const { content, image } = req.body;
    const post = await Post.create({
      author: (req.user as any)._id,
      content,
      image,
      likes: [],
      comments: [],
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: '게시물 작성 실패', error: err });
  }
};

// 전체 게시물 조회 (최신순)
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate('author', 'nickname profileImage')
      .populate('comments.user', 'nickname profileImage')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: '게시물 조회 실패', error: err });
  }
};

// 개별 게시물 조회
export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'nickname profileImage')
      .populate('comments.user', 'nickname profileImage');
    if (!post) return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: '게시물 조회 실패', error: err });
  }
};

// 게시물 수정
export const updatePost = async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  try {
    const { content, image } = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: (req.user as any)._id },
      { content, image },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: '수정 권한이 없거나 게시물이 없습니다.' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: '게시물 수정 실패', error: err });
  }
};

// 게시물 삭제
export const deletePost = async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, author: (req.user as any)._id });
    if (!post) return res.status(404).json({ message: '삭제 권한이 없거나 게시물이 없습니다.' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: '게시물 삭제 실패', error: err });
  }
};

// 게시물 좋아요/취소
export const toggleLike = async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    const userId = (req.user as any)._id;
    const liked = post.likes.includes(userId);
    if (liked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.json({ liked: !liked, likesCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: '좋아요 처리 실패', error: err });
  }
};

// 댓글 추가
export const addComment = async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    post.comments.push({ user: (req.user as any)._id, text, createdAt: new Date() });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: '댓글 추가 실패', error: err });
  }
};

// 댓글 삭제
export const deleteComment = async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    if (comment.user.toString() !== (req.user as any)._id.toString()) {
      return res.status(403).json({ message: '삭제 권한이 없습니다.' });
    }
    comment.remove();
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: '댓글 삭제 실패', error: err });
  }
}; 