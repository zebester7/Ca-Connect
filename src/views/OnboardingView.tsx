import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/src/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { GraduationCap, Briefcase, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OnboardingView: React.FC = () => {
  const { user, syncProfile } = useAuthStore();
  const [role, setRole] = useState<'student' | 'senior' | 'alumni' | 'faculty'>('student');
  const [level, setLevel] = useState('Foundation');
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      await syncProfile(user, role, level);
      navigate('/');
    } catch (error) {
      console.error("Onboarding failed", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="border-none shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
            <CardDescription>Tell us a bit more about your journey in the CA world.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                placeholder="How should we call you?"
              />
            </div>

            <div className="space-y-2">
              <Label>I am a...</Label>
              <div className="grid grid-cols-2 gap-3">
                <RoleCard 
                  active={role === 'student'} 
                  onClick={() => setRole('student')}
                  icon={<GraduationCap className="w-5 h-5" />}
                  label="Student"
                />
                <RoleCard 
                  active={role === 'senior'} 
                  onClick={() => setRole('senior')}
                  icon={<BookOpen className="w-5 h-5" />}
                  label="Senior"
                />
                <RoleCard 
                  active={role === 'alumni'} 
                  onClick={() => setRole('alumni')}
                  icon={<Briefcase className="w-5 h-5" />}
                  label="Alumni"
                />
                <RoleCard 
                  active={role === 'faculty'} 
                  onClick={() => setRole('faculty')}
                  icon={<Users className="w-5 h-5" />}
                  label="Faculty"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Current CA Level</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Foundation">Foundation</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Final">Final</SelectItem>
                  <SelectItem value="Qualified CA">Qualified CA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSubmit} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              size="lg"
              disabled={submitting || !fullName}
            >
              {submitting ? "Saving..." : "Start Learning"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const RoleCard = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
      active 
        ? 'border-blue-600 bg-blue-50 text-blue-600' 
        : 'border-zinc-100 bg-zinc-50 text-zinc-400 hover:border-zinc-200'
    }`}
  >
    {icon}
    <span className="text-xs font-semibold mt-2">{label}</span>
  </button>
);
