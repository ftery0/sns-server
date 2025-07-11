import { Request, Response } from 'express';
import Post from '../models/Post';
import { IPost } from '../models/Post';

// 베스트 게시물 조회 (좋아요+댓글 수 기준 상위 10개)
export const getBestPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate('author', 'nickname profileImage');
    
    // 좋아요+댓글 수 기준으로 정렬 (상위 10개)
    const sorted = posts.sort((a: IPost, b: IPost) => (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length)).slice(0, 10);
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: '베스트 게시물 조회 실패', error: err });
  }
}; 