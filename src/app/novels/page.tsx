'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Novel type definition
interface Novel {
  _id: string;
  title: string;
  synopsis: string;
  coverImage: string;
  genre: string;
  author: {
    _id: string;
    name: string;
  };
  status: 'ongoing' | 'completed' | 'hiatus';
  tags: string[];
  views: number;
  likes: number;
  createdAt: string;
}

export default function BrowseNovels() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [filteredNovels, setFilteredNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');

  const genres = ['Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Horror', 'Thriller', 'Adventure', 'Historical', 'Other'];
  const statuses = ['All', 'Ongoing', 'Completed', 'Hiatus'];

  // For demo purposes, we'll use static data until the API is implemented
  useEffect(() => {
    // In a real implementation, this would be an API call
    // const fetchNovels = async () => {
    //   try {
    //     const response = await fetch('/api/novels');
    //     const data = await response.json();
    //     if (data.success) {
    //       setNovels(data.novels);
    //       setFilteredNovels(data.novels);
    //     } else {
    //       throw new Error(data.error || 'Failed to fetch novels');
    //     }
    //   } catch (err: any) {
    //     setError(err.message);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    
    // fetchNovels();
    
    // For now, use mock data
    const mockNovels: Novel[] = [];
    
    setNovels(mockNovels);
    setFilteredNovels(mockNovels);
    setLoading(false);
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    let result = [...novels];
    
    if (selectedGenre) {
      result = result.filter(novel => novel.genre === selectedGenre);
    }
    
    if (selectedStatus && selectedStatus !== 'All') {
      result = result.filter(novel => novel.status.toLowerCase() === selectedStatus.toLowerCase());
    }
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        novel => 
          novel.title.toLowerCase().includes(search) || 
          novel.synopsis.toLowerCase().includes(search) ||
          novel.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'mostViewed':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'mostLiked':
        result.sort((a, b) => b.likes - a.likes);
        break;
      default:
        break;
    }
    
    setFilteredNovels(result);
  }, [novels, selectedGenre, selectedStatus, searchTerm, sortBy]);

  // Reset filters
  const resetFilters = () => {
    setSelectedGenre('');
    setSelectedStatus('');
    setSearchTerm('');
    setSortBy('newest');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading novels...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 p-4 rounded-md mb-8">
            <p className="text-red-800">{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Browse Novels</h1>
        
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-grow">
              <div className="w-full sm:w-auto">
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Genre</label>
                <select
                  id="genre"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="w-full sm:w-auto">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  id="status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="w-full sm:w-auto">
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="newest">Newest</option>
                  <option value="mostViewed">Most Viewed</option>
                  <option value="mostLiked">Most Liked</option>
                </select>
              </div>
            </div>
            
            <div className="w-full md:w-1/3">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
              <input
                type="text"
                id="search"
                placeholder="Search by title, synopsis, or tags"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Reset Filters
            </button>
            <button
              onClick={() => {
                // Toggle dark mode
                const isDark = document.documentElement.classList.toggle('dark');
                // Save preference
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
              }}
              className="ml-4 px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
            >
              Toggle Dark Mode
            </button>
          </div>
        </div>
        
        {/* Results */}
        {filteredNovels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNovels.map((novel) => (
              <div key={novel._id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transform transition hover:scale-105 hover:shadow-lg">
                <div className="relative h-60 w-full">
                  <Image 
                    src={novel.coverImage}
                    alt={novel.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                      {novel.genre}
                    </span>
                    <span className={`ml-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      novel.status === 'ongoing' ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900' : 
                      novel.status === 'completed' ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900' : 
                      'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900'
                    }`}>
                      {novel.status.charAt(0).toUpperCase() + novel.status.slice(1)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{novel.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">by {novel.author.name}</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{novel.synopsis}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {novel.tags.map((tag) => (
                      <span key={tag} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {novel.views.toLocaleString()}
                      </span>
                      <span className="flex items-center text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        {novel.likes.toLocaleString()}
                      </span>
                    </div>
                    <Link 
                      href={`/novels/${novel._id}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-10 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Novels Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">There are currently no novels in this category. Be the first to publish one!</p>
            <Link 
              href="/novels/create" 
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
            >
              Start Writing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 