'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface Chapter {
  _id: string;
  title: string;
  content: string;
  order: number;
}

interface Novel {
  _id: string;
  title: string;
  author: {
    _id: string;
    name: string;
  };
  chapters: Chapter[];
}

export default function ChapterReader() {
  const params = useParams();
  const router = useRouter();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number>(16);
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');

  useEffect(() => {
    // In a real implementation, this would fetch data from an API
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Empty placeholder data
        const chapterData = {
          _id: '',
          title: '',
          content: '',
          order: 1,
        };
        
        const novelData = {
          _id: '',
          title: '',
          chapters: [
            { _id: '', title: '', order: 1 }
          ]
        };
        
        setChapter(chapterData);
        setNovel(novelData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load chapter');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [params.id, params.chapterId]);

  // Function to navigate to previous or next chapter
  const navigateChapter = (direction: 'prev' | 'next') => {
    if (!novel || !chapter) return;
    
    const currentIndex = novel.chapters.findIndex(c => c._id === chapter._id);
    if (currentIndex === -1) return;
    
    let targetIndex;
    if (direction === 'prev' && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    } else if (direction === 'next' && currentIndex < novel.chapters.length - 1) {
      targetIndex = currentIndex + 1;
    } else {
      return;
    }
    
    const targetChapter = novel.chapters[targetIndex];
    router.push(`/novels/${novel._id}/chapters/${targetChapter._id}`);
  };

  // Toggle font size
  const changeFontSize = (delta: number) => {
    setFontSize(prevSize => {
      const newSize = prevSize + delta;
      return newSize >= 12 && newSize <= 24 ? newSize : prevSize;
    });
  };

  // Toggle theme
  const toggleTheme = () => {
    const themes: Array<'light' | 'sepia' | 'dark'> = ['light', 'sepia', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading chapter...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !novel || !chapter) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 p-4 rounded-md mb-8">
            <p className="text-red-800">{error || 'Chapter not found'}</p>
            <Link 
              href={`/novels/${params.id}`}
              className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Back to Novel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Determine classes based on selected theme
  const themeClasses = {
    light: 'bg-white text-gray-900',
    sepia: 'bg-amber-50 text-amber-900',
    dark: 'bg-gray-900 text-gray-100',
  }[theme];

  return (
    <div className={`min-h-screen py-4 ${themeClasses}`}>
      <div className="container mx-auto px-4">
        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-6 py-2 border-b">
          <Link 
            href={`/novels/${novel._id}`}
            className="text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Novel
          </Link>
          
          <div className="flex items-center">
            <div className="hidden md:flex items-center mr-4">
              <span className="text-gray-500 text-sm">{novel.title} by {novel.author.name}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Font Size Controls */}
              <button 
                onClick={() => changeFontSize(-2)}
                className="p-1 rounded hover:bg-gray-200"
                aria-label="Decrease font size"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button 
                onClick={() => changeFontSize(2)}
                className="p-1 rounded hover:bg-gray-200"
                aria-label="Increase font size"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-1 rounded hover:bg-gray-200"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : theme === 'sepia' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Chapter Content */}
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Chapter {chapter.order}: {chapter.title}</h1>
          
          <div 
            className="prose prose-lg max-w-none mb-10"
            style={{ fontSize: `${fontSize}px` }}
            dangerouslySetInnerHTML={{ __html: chapter.content }}
          />
          
          {/* Chapter Navigation */}
          <div className="flex justify-between items-center mt-10 py-4 border-t">
            <button
              onClick={() => navigateChapter('prev')}
              disabled={chapter.order === 1}
              className={`px-4 py-2 rounded-md flex items-center ${
                chapter.order === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Previous Chapter
            </button>
            
            <button
              onClick={() => navigateChapter('next')}
              disabled={chapter.order === novel.chapters.length}
              className={`px-4 py-2 rounded-md flex items-center ${
                chapter.order === novel.chapters.length 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Next Chapter
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 