import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/src/lib/firebase';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, CheckCircle2, ThumbsUp, HelpCircle, Plus, Search } from 'lucide-react';
import { useAuthStore } from '@/src/store/useAuthStore';
import { formatDistanceToNow } from 'date-fns';

interface Question {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  body: string;
  subject: string;
  caLevel: string;
  status: 'open' | 'solved' | 'closed';
  createdAt: any;
  answerCount?: number;
}

export const QAView: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const { profile } = useAuthStore();

  useEffect(() => {
    const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const qs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
      setQuestions(qs || []);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'questions');
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center">
            <HelpCircle className="w-6 h-6 mr-2 text-orange-500" />
            Doubt Solving
          </h1>
          <p className="text-zinc-500 text-sm">Ask anything related to your syllabus and get answers from experts.</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Ask Question
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {questions.length > 0 ? (
          questions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
            <div className="max-w-xs mx-auto space-y-4">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto text-orange-500">
                <HelpCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-zinc-900 text-lg">No questions yet</p>
                <p className="text-sm text-zinc-500">Be the first to clear a doubt or help others by starting a discussion.</p>
              </div>
              <Button variant="outline" className="rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50">
                Post First Question
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const QuestionCard = ({ question }: { question: Question }) => {
  const timeAgo = question.createdAt?.toDate ? formatDistanceToNow(question.createdAt.toDate(), { addSuffix: true }) : 'just now';

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer bg-white overflow-hidden group">
      <CardHeader className="p-4 flex flex-row items-start space-y-0 gap-4">
        <div className="hidden sm:flex flex-col items-center justify-center w-12 pt-1 border-r border-zinc-50 shrink-0">
          <span className="text-sm font-bold text-zinc-900">{question.answerCount || 0}</span>
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Answers</span>
          {question.status === 'solved' && <CheckCircle2 className="w-4 h-4 text-green-500 mt-2" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="outline" className="rounded-lg text-[10px] font-bold border-zinc-100 text-zinc-400">
              {question.subject?.toUpperCase()}
            </Badge>
            <span className="text-[10px] text-zinc-300">•</span>
            <span className="text-[10px] text-zinc-400 font-medium">{timeAgo}</span>
          </div>
          <CardTitle className="text-base font-bold text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {question.title}
          </CardTitle>
          <p className="text-sm text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
            {question.body}
          </p>
          <div className="flex items-center mt-3 space-x-2">
             <div className="flex -space-x-1">
               <div className="w-5 h-5 rounded-full bg-zinc-200 border border-white flex items-center justify-center text-[10px] font-bold">
                 {question.authorName?.[0]}
               </div>
             </div>
             <span className="text-[10px] text-zinc-500 font-medium">{question.authorName}</span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
