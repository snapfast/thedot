"use client";

import React, { useState } from "react";
import {
  X,
  Search,
  Bell,
  MessageSquare,
  Plus,
  User,
  Home,
  Flame,
  Globe,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Share2,
  MoreHorizontal,
  ChevronDown,
  Rocket
} from "lucide-react";

interface Post {
  id: string;
  subreddit: string;
  author: string;
  createdAt: number; // Use timestamp for easier sorting
  title: string;
  content?: string;
  upvotes: number;
  comments: number;
}

const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    subreddit: "r/nextjs",
    author: "frontend_dev",
    createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    title: "Next.js 15 is amazing! Here are my favorite new features",
    content: "The new routing features and performance improvements have made building applications so much faster. What do you all think?",
    upvotes: 1200,
    comments: 124,
  },
  {
    id: "2",
    subreddit: "r/webdev",
    author: "css_master",
    createdAt: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
    title: "Tailwind CSS v4 is a game changer",
    content: "I've been using the beta of Tailwind v4 and the new JIT engine and reduced configuration make it incredibly easy to use.",
    upvotes: 3500,
    comments: 412,
  },
  {
    id: "3",
    subreddit: "r/programming",
    author: "code_ninja",
    createdAt: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
    title: "Understanding the event loop in JavaScript",
    content: "Many developers struggle with async programming. Here's a deep dive into how the event loop actually works under the hood.",
    upvotes: 842,
    comments: 56,
  }
];

function formatTimeAgo(timestamp: number): string {
  const diffInMinutes = Math.floor((Date.now() - timestamp) / (1000 * 60));
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
}

function formatUpvotes(upvotes: number): string {
  if (upvotes >= 1000) {
    return (upvotes / 1000).toFixed(1) + 'k';
  }
  return upvotes.toString();
}

export default function RedditClone() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'best' | 'hot' | 'new'>('best');

  // Create Post Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostSubreddit, setNewPostSubreddit] = useState("r/nextjs");

  // Track user votes to prevent infinite voting: { [postId]: 'up' | 'down' | null }
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down' | null>>({});

  const [isJoined, setIsJoined] = useState(false);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;

    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      subreddit: newPostSubreddit,
      author: "current_user",
      createdAt: Date.now(),
      title: newPostTitle,
      content: newPostContent,
      upvotes: 1,
      comments: 0
    };

    setPosts([newPost, ...posts]);
    setUserVotes(prev => ({ ...prev, [newPost.id]: 'up' })); // Self-upvote by default

    // Reset form
    setNewPostTitle("");
    setNewPostContent("");
    setIsCreateModalOpen(false);
  };

  const handleVote = (postId: string, direction: 'up' | 'down') => {
    const currentVote = userVotes[postId];
    let voteChange = 0;

    if (currentVote === direction) {
      // Un-vote
      voteChange = direction === 'up' ? -1 : 1;
      setUserVotes(prev => ({ ...prev, [postId]: null }));
    } else {
      // New vote or change vote
      if (currentVote === null || currentVote === undefined) {
          voteChange = direction === 'up' ? 1 : -1;
      } else {
          // Changing direction (e.g. up to down means -2 upvotes)
          voteChange = direction === 'up' ? 2 : -2;
      }
      setUserVotes(prev => ({ ...prev, [postId]: direction }));
    }

    setPosts(currentPosts =>
      currentPosts.map(post => {
        if (post.id !== postId) return post;
        return { ...post, upvotes: post.upvotes + voteChange };
      })
    );
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.subreddit.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'new') {
      return b.createdAt - a.createdAt;
    } else if (sortBy === 'best') {
      return b.upvotes - a.upvotes;
    } else { // 'hot'
      // simplified hotness algorithm: upvotes + some weight for freshness
      const aHotness = a.upvotes + (a.createdAt / 1000000000);
      const bHotness = b.upvotes + (b.createdAt / 1000000000);
      return bHotness - aHotness;
    }
  });

  return (
    <div className="min-h-screen bg-[#DAE0E6] text-gray-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between h-12 px-4 bg-white border-b border-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">r</span>
          </div>
          <span className="text-xl font-bold hidden sm:block tracking-tight">reddit</span>
        </div>

        <div className="flex-1 max-w-2xl px-4 hidden md:block">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search Reddit"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-1.5 pl-10 pr-4 bg-gray-100 border border-transparent hover:border-blue-500 focus:bg-white focus:border-blue-500 rounded-full text-sm outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-700 hover:text-gray-900 cursor-pointer" />
            <MessageSquare className="w-5 h-5 text-gray-700 hover:text-gray-900 cursor-pointer" />
            <div
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-semibold">Create</span>
            </div>
          </div>

          <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </header>

      <div className="flex justify-center max-w-[1200px] mx-auto pt-6 px-4 gap-6">
        {/* Left Sidebar */}
        <aside className="w-64 hidden lg:block shrink-0">
          <div className="bg-white rounded border border-gray-300 overflow-hidden">
            <div className="p-4 space-y-1">
              <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded text-sm font-semibold text-gray-800 transition-colors bg-gray-100">
                <Home className="w-5 h-5" />
                Home
              </button>
              <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded text-sm font-medium text-gray-800 transition-colors">
                <Flame className="w-5 h-5" />
                Popular
              </button>
              <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded text-sm font-medium text-gray-800 transition-colors">
                <Globe className="w-5 h-5" />
                All
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-[640px]">
          {/* Create Post */}
          <div className="bg-white p-3 rounded border border-gray-300 flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
            <input
              type="text"
              placeholder="Create Post"
              onClick={() => setIsCreateModalOpen(true)}
              readOnly
              className="flex-1 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:bg-white focus:border-blue-500 rounded p-2 text-sm outline-none transition-colors cursor-text"
            />
          </div>

          {/* Sort Filter */}
          <div className="bg-white p-3 rounded border border-gray-300 flex items-center gap-3 mb-4">
            <button
              onClick={() => setSortBy('best')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${sortBy === 'best' ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Rocket className="w-4 h-4" />
              Best
            </button>
            <button
              onClick={() => setSortBy('hot')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${sortBy === 'hot' ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Flame className="w-4 h-4" />
              Hot
            </button>
            <button
              onClick={() => setSortBy('new')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${sortBy === 'new' ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <span className="font-bold">New</span>
            </button>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {sortedPosts.map((post) => (
              <div key={post.id} className="bg-white rounded border border-gray-300 hover:border-gray-400 cursor-pointer flex transition-colors">
                {/* Vote Sidebar */}
                <div className="w-10 bg-gray-50 p-2 flex flex-col items-center rounded-l border-r border-gray-100 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleVote(post.id, 'up'); }}
                    className={`p-1 rounded transition-colors ${userVotes[post.id] === 'up' ? 'text-orange-500 bg-orange-100' : 'text-gray-400 hover:bg-gray-200 hover:text-orange-500'}`}
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                  <span className={`text-xs font-bold my-1 ${userVotes[post.id] === 'up' ? 'text-orange-500' : userVotes[post.id] === 'down' ? 'text-blue-500' : 'text-gray-800'}`}>
                    {formatUpvotes(post.upvotes)}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleVote(post.id, 'down'); }}
                    className={`p-1 rounded transition-colors ${userVotes[post.id] === 'down' ? 'text-blue-500 bg-blue-100' : 'text-gray-400 hover:bg-gray-200 hover:text-blue-500'}`}
                  >
                    <ArrowDown className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="p-2 pt-3 flex-1">
                  <div className="flex items-center gap-1 text-xs mb-2">
                    <span className="font-bold text-gray-900 hover:underline">{post.subreddit}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">Posted by u/{post.author}</span>
                    <span className="text-gray-500">{formatTimeAgo(post.createdAt)}</span>
                  </div>

                  <h2 className="text-lg font-medium text-gray-900 mb-2 leading-tight">{post.title}</h2>

                  {post.content && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">{post.content}</p>
                  )}

                  <div className="flex items-center gap-1">
                    <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-xs font-bold text-gray-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments} Comments
                    </button>
                    <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-xs font-bold text-gray-500 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded text-gray-500 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 hidden xl:block shrink-0 space-y-4">
          <div className="bg-white rounded border border-gray-300 overflow-hidden">
            <div className="bg-blue-500 p-3">
              <h3 className="text-white font-bold text-sm">About Community</h3>
            </div>
            <div className="p-3">
              <p className="text-sm text-gray-600 mb-3">
                A community for learning, sharing, and discussing the best in web development, design, and software engineering.
              </p>
              <div className="flex gap-4 border-b border-gray-200 pb-3 mb-3">
                <div>
                  <div className="font-bold text-gray-900">1.5m</div>
                  <div className="text-xs text-gray-500">Members</div>
                </div>
                <div>
                  <div className="font-bold text-gray-900 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    1.2k
                  </div>
                  <div className="text-xs text-gray-500">Online</div>
                </div>
              </div>
              <button
                onClick={() => setIsJoined(!isJoined)}
                className={`w-full font-bold rounded-full py-1.5 text-sm transition-colors ${isJoined ? 'bg-white border border-gray-400 hover:border-gray-500 text-gray-800' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                {isJoined ? 'Joined' : 'Join Community'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded border border-gray-300 p-3">
            <h3 className="font-bold text-sm text-gray-900 mb-3">Rules</h3>
            <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li className="border-b border-gray-100 pb-2">Be respectful to others</li>
              <li className="border-b border-gray-100 pb-2">No self-promotion</li>
              <li className="border-b border-gray-100 pb-2">Keep posts relevant</li>
              <li className="pb-1">Use clear titles</li>
            </ol>
          </div>
        </aside>
      </div>

      {/* Create Post Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-[600px] overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold">Create a post</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto">
              <form id="create-post-form" onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <select
                    value={newPostSubreddit}
                    onChange={(e) => setNewPostSubreddit(e.target.value)}
                    className="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded p-2 text-sm outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="r/nextjs">r/nextjs</option>
                    <option value="r/webdev">r/webdev</option>
                    <option value="r/programming">r/programming</option>
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded p-2 text-sm outline-none focus:border-blue-500"
                    maxLength={300}
                    required
                  />
                </div>

                <div>
                  <textarea
                    placeholder="Text (optional)"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded p-2 text-sm outline-none focus:border-blue-500 min-h-[150px] resize-y"
                  />
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-1.5 rounded-full text-sm font-bold text-gray-500 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-post-form"
                disabled={!newPostTitle.trim()}
                className="px-4 py-1.5 rounded-full text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
