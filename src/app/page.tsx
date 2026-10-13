"use client";

import React, { useState } from "react";
import {
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
  timeAgo: string;
  title: string;
  content?: string;
  upvotes: string;
  comments: number;
}

const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    subreddit: "r/nextjs",
    author: "frontend_dev",
    timeAgo: "2 hours ago",
    title: "Next.js 15 is amazing! Here are my favorite new features",
    content: "The new routing features and performance improvements have made building applications so much faster. What do you all think?",
    upvotes: "1.2k",
    comments: 124,
  },
  {
    id: "2",
    subreddit: "r/webdev",
    author: "css_master",
    timeAgo: "4 hours ago",
    title: "Tailwind CSS v4 is a game changer",
    content: "I've been using the beta of Tailwind v4 and the new JIT engine and reduced configuration make it incredibly easy to use.",
    upvotes: "3.5k",
    comments: 412,
  },
  {
    id: "3",
    subreddit: "r/programming",
    author: "code_ninja",
    timeAgo: "6 hours ago",
    title: "Understanding the event loop in JavaScript",
    content: "Many developers struggle with async programming. Here's a deep dive into how the event loop actually works under the hood.",
    upvotes: "842",
    comments: 56,
  }
];

export default function RedditClone() {
  const [posts] = useState<Post[]>(INITIAL_POSTS);

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
              className="w-full py-1.5 pl-10 pr-4 bg-gray-100 border border-transparent hover:border-blue-500 focus:bg-white focus:border-blue-500 rounded-full text-sm outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-700 hover:text-gray-900 cursor-pointer" />
            <MessageSquare className="w-5 h-5 text-gray-700 hover:text-gray-900 cursor-pointer" />
            <div className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full cursor-pointer transition-colors">
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
              className="flex-1 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:bg-white focus:border-blue-500 rounded p-2 text-sm outline-none transition-colors"
            />
          </div>

          {/* Sort Filter */}
          <div className="bg-white p-3 rounded border border-gray-300 flex items-center gap-3 mb-4">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-blue-600 rounded-full text-sm font-bold">
              <Rocket className="w-4 h-4" />
              Best
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded-full text-sm font-bold transition-colors">
              <Flame className="w-4 h-4" />
              Hot
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded-full text-sm font-bold transition-colors">
              <span className="font-bold">New</span>
            </button>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded border border-gray-300 hover:border-gray-400 cursor-pointer flex transition-colors">
                {/* Vote Sidebar */}
                <div className="w-10 bg-gray-50 p-2 flex flex-col items-center rounded-l border-r border-gray-100 shrink-0">
                  <button className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-orange-500 transition-colors">
                    <ArrowUp className="w-5 h-5" />
                  </button>
                  <span className="text-xs font-bold my-1 text-gray-800">{post.upvotes}</span>
                  <button className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-blue-500 transition-colors">
                    <ArrowDown className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="p-2 pt-3 flex-1">
                  <div className="flex items-center gap-1 text-xs mb-2">
                    <span className="font-bold text-gray-900 hover:underline">{post.subreddit}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">Posted by u/{post.author}</span>
                    <span className="text-gray-500">{post.timeAgo}</span>
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
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full py-1.5 text-sm transition-colors">
                Join Community
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
    </div>
  );
}
