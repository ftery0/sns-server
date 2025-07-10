import { Router } from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment
} from '../controllers/postController';

const router = Router();

// 게시물 작성
router.post('/', createPost);
// 전체 게시물 조회
router.get('/', getAllPosts);
// 개별 게시물 조회
router.get('/:id', getPostById);
// 게시물 수정
router.put('/:id', updatePost);
// 게시물 삭제
router.delete('/:id', deletePost);
// 게시물 좋아요/취소
router.post('/:id/like', toggleLike);
// 댓글 추가
router.post('/:id/comments', addComment);
// 댓글 삭제
router.delete('/:id/comments/:commentId', deleteComment);

export default router; 