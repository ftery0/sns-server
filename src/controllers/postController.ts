import { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  createPostService,
  getAllPostsService,
  getPostByIdService,
  updatePostService,
  deletePostService,
  toggleLikeService,
  addCommentService,
  deleteCommentService
} from '../services/postService';

// 게시물 작성
export const createPost = async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  try {
    const author = req.user._id as mongoose.Types.ObjectId;
    const { content, image } = req.body as { content: string; image?: string };
    const post = await createPostService(author, content, image);
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: '게시물 작성 실패', error: err });
  }
};

// 전체 게시물 조회 (최신순)
export const getAllPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await getAllPostsService();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: '게시물 조회 실패', error: err });
  }
};

// 개별 게시물 조회
export const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = new mongoose.Types.ObjectId(req.params.id);
    const post = await getPostByIdService(postId);
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
    const postId = new mongoose.Types.ObjectId(req.params.id);
    const author = req.user._id as mongoose.Types.ObjectId;
    const { content, image } = req.body as { content?: string; image?: string };
    const post = await updatePostService(postId, author, content, image);
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
    const postId = new mongoose.Types.ObjectId(req.params.id);
    const author = req.user._id as mongoose.Types.ObjectId;
    const post = await deletePostService(postId, author);
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
    const postId = new mongoose.Types.ObjectId(req.params.id);
    const userId = req.user._id as mongoose.Types.ObjectId;
    const result = await toggleLikeService(postId, userId);
    res.json(result);
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
    const postId = new mongoose.Types.ObjectId(req.params.id);
    const userId = req.user._id as mongoose.Types.ObjectId;
    const { text } = req.body as { text: string };
    const post = await addCommentService(postId, userId, text);
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
    const postId = new mongoose.Types.ObjectId(req.params.id);
    const userId = req.user._id as mongoose.Types.ObjectId;
    const commentId = req.params.commentId;
    const post = await deleteCommentService(postId, userId, commentId);
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: '댓글 삭제 실패', error: err });
  }
}; 