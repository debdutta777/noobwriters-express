'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { getUser } from '@/app/lib/supabase';

// Remove the ReactQuill imports and use textarea instead

interface WritingPrompt {
  _id: string;
  title: string;
  content: string;
  category: string;
}

export default function CreateNovel() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Novel form state
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [genre, setGenre] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  
  // Chapter form state
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterContent, setChapterContent] = useState('');
  
  // Writing prompts state
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(null);
  const [promptCategory, setPromptCategory] = useState<string>('all');
  const [showPromptsPanel, setShowPromptsPanel] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    async function checkAuth() {
      const userData = await getUser();
      setUser(userData);
    }
    
    checkAuth();
  }, []);
  
  // Fetch writing prompts
  useEffect(() => {
    // In a real implementation, this would fetch data from an API
    // For now, use mock data
    const mockPrompts: WritingPrompt[] = [
      {
        _id: 'p1',
        title: 'Character Background',
        content: 'Describe your protagonist\'s childhood memory that shaped their worldview. What formative experience defines who they are today?',
        category: 'Character Development',
      },
      {
        _id: 'p2',
        title: 'World Building',
        content: 'Describe a unique cultural tradition or celebration in your story\'s world. How does it reflect the values of the society?',
        category: 'Setting Description',
      },
      {
        _id: 'p3',
        title: 'Plot Twist',
        content: 'Introduce an unexpected revelation that forces your protagonist to re-evaluate everything they believed about a key relationship.',
        category: 'Plot Twist',
      },
      {
        _id: 'p4',
        title: 'Tense Conversation',
        content: 'Write a dialogue between two characters who want different things but can\'t directly state what they want.',
        category: 'Dialogue',
      },
      {
        _id: 'p5',
        title: 'Sensory Description',
        content: 'Describe a location using all five senses to create an immersive experience for the reader.',
        category: 'Setting Description',
      },
      {
        _id: 'p6',
        title: 'Internal vs. External',
        content: 'Create a scene where your protagonist\'s internal desires directly conflict with external expectations or obligations.',
        category: 'Conflict',
      },
      {
        _id: 'p7',
        title: 'Symbol Introduction',
        content: 'Introduce an object, place, or recurring motif that represents your story\'s central theme.',
        category: 'Theme',
      },
    ];
    
    setPrompts(mockPrompts);
  }, []);

  // Handle file upload for cover image
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle adding tags
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // Handle removing tags
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle tag input keypress (add tag on Enter)
  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Filter prompts by category
  const filteredPrompts = promptCategory === 'all'
    ? prompts
    : prompts.filter(prompt => prompt.category === promptCategory);

  // Handle selecting a prompt
  const handleSelectPrompt = (prompt: WritingPrompt) => {
    setSelectedPrompt(prompt);
  };

  // Handle applying a prompt to the chapter content
  const handleApplyPrompt = () => {
    if (!selectedPrompt) return;
    
    // Add the prompt at the end of the current content with a separator
    const updatedContent = chapterContent + 
      (chapterContent ? '\n\n' : '') + 
      `Prompt: ${selectedPrompt.content}\n\nYour response here...\n`;
    
    setChapterContent(updatedContent);
    setSelectedPrompt(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Basic validation
    if (!title || !synopsis || !genre || !chapterTitle || !chapterContent) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    try {
      // In a real implementation, this would be an API call to create the novel
      // const formData = new FormData();
      // formData.append('title', title);
      // formData.append('synopsis', synopsis);
      // formData.append('genre', genre);
      // formData.append('tags', JSON.stringify(tags));
      // formData.append('chapterTitle', chapterTitle);
      // formData.append('chapterContent', chapterContent);
      // if (coverImage) {
      //   formData.append('coverImage', coverImage);
      // }
      
      // const response = await fetch('/api/novels', {
      //   method: 'POST',
      //   body: formData,
      // });
      
      // const data = await response.json();
      // if (data.success) {
      //   setSuccess(true);
      //   router.push(`/novels/${data.novel._id}`);
      // } else {
      //   throw new Error(data.error || 'Failed to create novel');
      // }
      
      // For demo purposes, we'll just simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => {
        router.push('/novels');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating your novel');
      console.error('Error creating novel:', err);
    } finally {
      setLoading(false);
    }
  };

  const genres = ['Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Horror', 'Thriller', 'Adventure', 'Historical', 'Other'];

  if (!user && typeof window !== 'undefined') {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/novels" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Novels
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Create a New Novel</h1>
        
        {success ? (
          <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg mb-8">
            <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">Success!</h2>
            <p className="text-green-700 dark:text-green-300">Your novel has been created successfully. You will be redirected shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 dark:bg-red-900 p-4 rounded-md mb-6">
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
            
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Novel Details</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="synopsis" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Synopsis <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="synopsis"
                      value={synopsis}
                      onChange={(e) => setSynopsis(e.target.value)}
                      rows={4}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Genre <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="genre"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select a genre</option>
                      {genres.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Cover Image
                    </label>
                    <input
                      type="file"
                      id="coverImage"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    
                    {coverPreview && (
                      <div className="mt-2 relative h-40 w-40">
                        <Image
                          src={coverPreview}
                          alt="Cover preview"
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tags
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleTagKeyPress}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Add tags and press Enter"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="ml-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600"
                      >
                        Add
                      </button>
                    </div>
                    
                    {tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">First Chapter</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <div className="mb-4">
                    <label htmlFor="chapterTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Chapter Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="chapterTitle"
                      value={chapterTitle}
                      onChange={(e) => setChapterTitle(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="chapterContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Chapter Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="chapterContent"
                      value={chapterContent}
                      onChange={(e) => setChapterContent(e.target.value)}
                      rows={15}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowPromptsPanel(!showPromptsPanel)}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      {showPromptsPanel ? 'Hide Prompts' : 'Show Writing Prompts'}
                    </button>
                    
                    {showPromptsPanel && (
                      <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                        <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">Writing Prompts</h3>
                        
                        <div className="mb-4">
                          <label htmlFor="promptCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Filter by Category
                          </label>
                          <select
                            id="promptCategory"
                            value={promptCategory}
                            onChange={(e) => setPromptCategory(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="all">All Categories</option>
                            <option value="Character Development">Character Development</option>
                            <option value="Setting Description">Setting Description</option>
                            <option value="Plot Twist">Plot Twist</option>
                            <option value="Dialogue">Dialogue</option>
                            <option value="Conflict">Conflict</option>
                            <option value="Theme">Theme</option>
                          </select>
                        </div>
                        
                        <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                          {filteredPrompts.map((prompt) => (
                            <div
                              key={prompt._id}
                              className={`p-3 border rounded-md cursor-pointer ${
                                selectedPrompt?._id === prompt._id
                                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900 dark:border-indigo-400'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                              }`}
                              onClick={() => handleSelectPrompt(prompt)}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-gray-800 dark:text-white">{prompt.title}</h4>
                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                  {prompt.category}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{prompt.content}</p>
                            </div>
                          ))}
                        </div>
                        
                        {selectedPrompt && (
                          <button
                            type="button"
                            onClick={handleApplyPrompt}
                            className="w-full px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600"
                          >
                            Apply Selected Prompt
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 dark:bg-indigo-700 text-white font-medium rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Novel'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 