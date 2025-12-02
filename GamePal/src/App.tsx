import { useState } from 'react';
import { ParentDashboard } from './components/parent/ParentDashboard';

export type Child = {
  id: string;
  name: string;
  age: number;
  avatar: string;
  games: string[];
  bio: string;
  language: string[];
  hobbies: string[];
  interests: string[];
  playType: string[];
  theme: string[];
};

export type Parent = {
  id: string;
  name: string;
  email: string;
  children: Child[];
};

export default function App() {
  const mockParent: Parent = {
    id: 'parent1',
    name: 'Alice',
    email: 'alice@example.com',
    children: [
      {
        id: 'child1',
        name: 'Charlie',
        age: 8,
        avatar: '',
        games: [],
        bio: '',
        language: [],
        hobbies: [],
        interests: [],
        playType: [],
        theme: [],
      },
    ],
  };

  const [currentParent] = useState<Parent>(mockParent);

  
  return (
    <ParentDashboard
      parent={currentParent}
    />
  );
}
