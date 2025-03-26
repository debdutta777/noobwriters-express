'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getUser, signOut } from '@/app/lib/supabase';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  image: string;
  bio: string;
}

interface UserNovel {
  _id: string;
  title: string;
  coverImage: string;
  synopsis: string;
  genre: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [novels, setNovels] = useState<UserNovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editImage, setEditImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<'novels' | 'favorites' | 'settings'>('novels');

  useEffect(() => {
    // In a real implementation, this would fetch data from API
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Mock data for now
        const mockUserData = {
          _id: '1',
          name: '',
          email: 'user@example.com',
          bio: '',
          profileImage: '/images/default-avatar.jpg',
          joinedDate: '2024-01-01T00:00:00.000Z'
        };
        
        const mockNovels = [];
        
        setUser(mockUserData);
        setNovels(mockNovels);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // In a real implementation, this would be an API call to update the profile
      // const formData = new FormData();
      // formData.append('name', editName);
      // formData.append('bio', editBio);
      // if (editImage) {
      //   formData.append('image', editImage);
      // }
      
      // const response = await fetch(`/api/users/${profile?._id}`, {
      //   method: 'PATCH',
      //   body: formData,
      // });
      
      // const data = await response.json();
      // if (data.success) {
      //   setProfile(data.user);
      //   setIsEditing(false);
      // } else {
      //   throw new Error(data.error || 'Failed to update profile');
      // }
      
      // For demo purposes, just update the local state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (profile) {
        const updatedProfile = {
          ...profile,
          name: editName,
          bio: editBio,
          image: imagePreview || profile.image,
        };
        
        setProfile(updatedProfile);
        setIsEditing(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating your profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/sign-in');
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign out');
      console.error('Error signing out:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 p-4 rounded-md mb-6">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">Profile not found. Please sign in again.</p>
            <Link 
              href="/sign-in"
              className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-8">
              <div className="md:flex">
                <div className="md:flex-shrink-0 mb-6 md:mb-0 md:mr-6">
                  <div className="relative h-40 w-40 rounded-full overflow-hidden">
                    <Image 
                      src={profile.image || '/images/default-cover.jpg'}
                      alt={profile.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold">{profile.name}</h1>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{profile.email}</p>
                  <p className="text-gray-700">{profile.bio}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Edit Profile Form */}
          {isEditing && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Image
                      </label>
                      <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img 
                            src={imagePreview} 
                            alt="Profile Preview" 
                            className="h-40 w-40 object-cover rounded-full border" 
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('novels')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 focus:outline-none ${
                    activeTab === 'novels'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Novels
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 focus:outline-none ${
                    activeTab === 'favorites'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Favorites
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 focus:outline-none ${
                    activeTab === 'settings'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Account Settings
                </button>
              </nav>
            </div>
            
            <div className="p-8">
              {/* My Novels Tab */}
              {activeTab === 'novels' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">My Novels</h2>
                    <Link 
                      href="/novels/create"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Create New Novel
                    </Link>
                  </div>
                  
                  {novels.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-6">You haven't created any novels yet.</p>
                      <Link 
                        href="/novels/create"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Start Writing
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {novels.map((novel) => (
                        <div key={novel._id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                          <div className="relative h-48 w-full">
                            <Image 
                              src={novel.coverImage}
                              alt={novel.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                                {novel.genre}
                              </span>
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                novel.status === 'ongoing' 
                                  ? 'bg-green-100 text-green-600' 
                                  : novel.status === 'completed'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-yellow-100 text-yellow-600'
                              }`}>
                                {novel.status.charAt(0).toUpperCase() + novel.status.slice(1)}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">{novel.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{novel.synopsis}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                              <span>{novel.views} views</span>
                              <span>{novel.likes} likes</span>
                            </div>
                            <div className="flex space-x-2">
                              <Link 
                                href={`/novels/${novel._id}`}
                                className="flex-1 px-3 py-2 bg-indigo-600 text-white text-center rounded-md hover:bg-indigo-700"
                              >
                                View
                              </Link>
                              <Link 
                                href={`/novels/${novel._id}/edit`}
                                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-center rounded-md hover:bg-gray-300"
                              >
                                Edit
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Favorites Tab */}
              {activeTab === 'favorites' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Favorite Novels</h2>
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-6">You haven't added any novels to your favorites yet.</p>
                    <Link 
                      href="/novels"
                      className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Browse Novels
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Account Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                  
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Danger Zone</h3>
                    <p className="text-red-700 mb-4">These actions are irreversible. Please proceed with caution.</p>
                    
                    <div className="flex space-x-4">
                      <button
                        onClick={handleSignOut}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      >
                        Sign Out
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 