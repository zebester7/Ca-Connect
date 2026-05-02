import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/src/lib/firebase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Hash } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Group {
  id: string;
  name: string;
  description: string;
  groupType: string;
  caLevel: string;
  memberCount?: number;
}

export const GroupsView: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const q = query(collection(db, 'groups'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const groupsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group));
      setGroups(groupsData || []);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'groups');
    });

    return () => unsubscribe();
  }, []);

  // Filtered groups based on type
  const filteredGroups = activeTab === 'all' 
    ? groups 
    : groups.filter(g => g.groupType === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Communities</h1>
          <p className="text-zinc-500 text-sm">Join subject-wise and attempt-wise groups to collaborate.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white border border-zinc-200 p-1 rounded-xl h-11 w-full justify-start space-x-1 overflow-x-auto no-scrollbar">
          <TabsTrigger value="all" className="rounded-lg px-4 text-xs font-semibold data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-900">All</TabsTrigger>
          <TabsTrigger value="subject" className="rounded-lg px-4 text-xs font-semibold data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-900">Subjects</TabsTrigger>
          <TabsTrigger value="level" className="rounded-lg px-4 text-xs font-semibold data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-900">Levels</TabsTrigger>
          <TabsTrigger value="articleship" className="rounded-lg px-4 text-xs font-semibold data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-900">Articleship</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-zinc-400 bg-white rounded-3xl border border-zinc-100 shadow-sm">
                <Hash className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No groups found in this category yet.</p>
                <Button variant="link" className="text-blue-600 mt-2">Become the first to create one!</Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const GroupCard = ({ group }: { group: Group }) => (
  <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white overflow-hidden group">
    <CardHeader className="p-5 flex flex-row items-start justify-between space-y-0">
      <div className="space-y-1">
        <CardTitle className="text-lg font-bold group-hover:text-blue-600 transition-colors">{group.name}</CardTitle>
        <CardDescription className="line-clamp-2">{group.description}</CardDescription>
      </div>
      <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 rounded-lg border-none capitalize">
        {group.groupType}
      </Badge>
    </CardHeader>
    <CardContent className="px-5 pb-5 pt-0">
      <div className="flex items-center space-x-4 text-xs text-zinc-500">
        <div className="flex items-center">
          <Users className="w-3.5 h-3.5 mr-1.5" />
          <span>{group.memberCount || 0} members</span>
        </div>
        <div className="flex items-center">
          <Hash className="w-3.5 h-3.5 mr-1.5" />
          <span>{group.caLevel}</span>
        </div>
      </div>
      <Button className="w-full mt-4 bg-zinc-50 text-zinc-900 hover:bg-zinc-100 border border-zinc-200 rounded-xl font-semibold h-10">
        Join Community
      </Button>
    </CardContent>
  </Card>
);
