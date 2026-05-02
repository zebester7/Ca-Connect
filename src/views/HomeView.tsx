import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/src/lib/firebase';
import { useAuthStore } from '@/src/store/useAuthStore';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, Send, Image as ImageIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  authorId: string;
  content: string;
  createdAt: any;
  authorName?: string;
  authorAvatar?: string;
}

export const HomeView: React.FC = () => {
  const { profile, user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(postsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'posts');
    });

    return () => unsubscribe();
  }, []);

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !user || !profile) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'posts'), {
        authorId: user.uid,
        authorName: profile.fullName,
        authorAvatar: profile.profilePhotoUrl || user.photoURL,
        content: newPostContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        postType: 'discussion',
        visibility: 'public'
      });
      setNewPostContent('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Create Post */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-4">
          <div className="flex space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={profile?.profilePhotoUrl || user?.photoURL || ''} />
              <AvatarFallback>{profile?.fullName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea 
                placeholder="What's on your mind, future CA?" 
                className="min-h-[100px] bg-zinc-50 border-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded-xl resize-none p-3 text-sm"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              <div className="flex items-center justify-between pt-2">
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-blue-600 rounded-lg">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    <span>Media</span>
                  </Button>
                </div>
                <Button 
                  onClick={handleCreatePost} 
                  disabled={isSubmitting || !newPostContent.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
                >
                  {isSubmitting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

const PostCard = ({ post }: { post: Post }) => {
  const timeAgo = post.createdAt?.toDate ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'just now';

  return (
    <Card className="border-none shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-500">
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.authorAvatar} />
            <AvatarFallback>{post.authorName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-900">{post.authorName}</span>
            <span className="text-xs text-zinc-400">{timeAgo}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-zinc-400">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <p className="text-sm text-zinc-800 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </CardContent>
      <CardFooter className="p-2 border-t border-zinc-50 flex items-center justify-between">
        <div className="flex space-x-1 flex-1">
          <Button variant="ghost" size="sm" className="flex-1 text-zinc-500 hover:text-blue-600 rounded-lg h-9">
            <ThumbsUp className="w-4 h-4 mr-2" />
            <span>Like</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 text-zinc-500 hover:text-blue-600 rounded-lg h-9">
            <MessageSquare className="w-4 h-4 mr-2" />
            <span>Comment</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-blue-600 rounded-lg h-9">
          <Share2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
