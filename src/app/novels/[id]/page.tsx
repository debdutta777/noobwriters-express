'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface Chapter {
  _id: string;
  title: string;
  order: number;
}

interface Novel {
  _id: string;
  title: string;
  synopsis: string;
  coverImage: string;
  genre: string;
  author: {
    _id: string;
    name: string;
    image: string;
  };
  status: 'ongoing' | 'completed' | 'hiatus';
  tags: string[];
  views: number;
  likes: number;
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
}

export default function NovelDetail() {
  const params = useParams();
  const router = useRouter();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // In a real implementation, this would fetch data from an API
    const fetchNovel = async () => {
      try {
        // For demo purposes, simulate API fetch delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Return empty novel data structure
        // This would normally be populated from API response
        return {
          _id: '',
          title: '',
          synopsis: 'A journey to the edge of the known universe unveils secrets that threaten humanity\'s existence. As Captain Elena Rodriguez and her crew venture beyond the solar system, they encounter mysterious phenomena and alien civilizations that challenge their understanding of reality.',
          coverImage: '/images/default-cover.jpg',
          genre: '',
          author: {
            _id: '',
            name: '',
            image: '/images/default-avatar.jpg'
          },
          chapters: [],
          status: 'ongoing' as const,
          tags: [],
          views: 0,
          likes: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error fetching novel:', error);
        throw new Error('Failed to fetch novel');
      }
    };
    
    fetchNovel().then(setNovel).catch(setError).finally(() => setLoading(false));
  }, [params.id]);

  const handleLike = async () => {
    // In a real implementation, this would be an API call to like/unlike the novel
    // try {
    //   const response = await fetch(`/api/novels/${params.id}/like`, {
    //     method: 'POST',
    //   });
    //   const data = await response.json();
    //   if (data.success) {
    //     setLiked(!liked);
    //     setNovel(prev => prev ? {
    //       ...prev,
    //       likes: liked ? prev.likes - 1 : prev.likes + 1
    //     } : null);
    //   }
    // } catch (err) {
    //   console.error('Error liking/unliking novel:', err);
    // }
    
    // For now, just toggle the state
    setLiked(!liked);
    setNovel(prev => prev ? {
      ...prev,
      likes: liked ? prev.likes - 1 : prev.likes + 1
    } : null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading novel...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !novel) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 p-4 rounded-md mb-8">
            <p className="text-red-800">{error || 'Novel not found'}</p>
            <button 
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              onClick={() => router.push('/novels')}
            >
              Back to Browse
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/novels" className="text-indigo-600 hover:text-indigo-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Browse
          </Link>
        </div>
        
        {/* Novel Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:flex-shrink-0 relative h-96 md:h-auto md:w-64">
              <Image 
                src={novel.coverImage}
                alt={novel.title}
                fill
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-8">
              <div className="flex items-center mb-2">
                <span className="inline-block px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full mr-2">
                  {novel.genre}
                </span>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full 
                  ${novel.status === 'ongoing' ? 'bg-green-100 text-green-600' : 
                    novel.status === 'completed' ? 'bg-blue-100 text-blue-600' : 
                    'bg-yellow-100 text-yellow-600'}`}
                >
                  {novel.status.charAt(0).toUpperCase() + novel.status.slice(1)}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{novel.title}</h1>
              <p className="text-gray-600 mb-4">
                by <Link href={`/authors/${novel.author._id}`} className="text-indigo-600 hover:text-indigo-800">{novel.author.name}</Link>
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <span className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {novel.views} views
                </span>
                <button 
                  onClick={handleLike}
                  className={`flex items-center text-sm ${liked ? 'text-red-500' : 'text-gray-500'}`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-1" 
                    fill={liked ? "currentColor" : "none"} 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {novel.likes} likes
                </button>
                <span className="text-sm text-gray-500">
                  Last updated: {new Date(novel.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Synopsis</h3>
                <p className="text-gray-700">{novel.synopsis}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {novel.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chapters Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Chapters</h2>
          {novel.chapters.length === 0 ? (
            <p className="text-gray-600">No chapters available yet.</p>
          ) : (
            <div className="space-y-4">
              {novel.chapters.map((chapter) => (
                <div key={chapter._id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition">
                  <Link 
                    href={`/novels/${novel._id}/chapters/${chapter._id}`}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <span className="text-gray-500 mr-2">Chapter {chapter.order}:</span>
                      <span className="font-medium">{chapter.title}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Comments and Ratings Section (placeholder) */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Comments & Reviews</h2>
          <div className="text-center p-10">
            <p className="text-gray-600">Comments and reviews feature coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
} 