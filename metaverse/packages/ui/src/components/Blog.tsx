import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Calendar, 
  User, 
  Search,
  Plus,
  X} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: Date;
  image: string;
  category: string;
}

const Blog: React.FC = () => {
  const [showAddPost, setShowAddPost] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'The Future of Virtual Reality in Gaming',
      content: 'Virtual reality has come a long way since its inception...',
      author: 'John Carmack',
      date: new Date('2024-03-15'),
      image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=1000&q=80',
      category: 'Technology'
    },
    {
      id: '2',
      title: 'Building Immersive Digital Experiences',
      content: 'The key to creating engaging virtual worlds lies in...',
      author: 'Tim Sweeney',
      date: new Date('2024-03-14'),
      image: 'https://images.unsplash.com/photo-1614729375564-c7f0816a5324?auto=format&fit=crop&w=1000&q=80',
      category: 'Design'
    },
    {
      id: '3',
      title: 'The Rise of Web-Based Metaverse',
      content: 'As browsers become more powerful, web-based virtual reality...',
      author: 'Mark Zuckerberg',
      date: new Date('2024-03-13'),
      image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=1000&q=80',
      category: 'Future'
    }
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    author: '',
    category: '',
    image: ''
  });

  const handleAddPost = () => {
    if (!newPost.title || !newPost.content || !newPost.author) return;

    const post: BlogPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: newPost.author,
      date: new Date(),
      image: newPost.image || 'https://images.unsplash.com/photo-1614729375564-c7f0816a5324?auto=format&fit=crop&w=1000&q=80',
      category: newPost.category || 'Uncategorized'
    };

    setPosts([post, ...posts]);
    setShowAddPost(false);
    setNewPost({
      title: '',
      content: '',
      author: '',
      category: '',
      image: ''
    });
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-cyan-100">
      {/* Header */}
      <div className="bg-gradient-to-b from-cyan-950/50 to-transparent">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Metaverse Insights
            </motion.h1>
            <motion.p 
              className="text-xl text-cyan-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Explore the latest thoughts and insights from industry leaders
            </motion.p>

            {/* Search Bar */}
            <motion.div 
              className="relative max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-cyan-950/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-cyan-100 placeholder-cyan-500"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-cyan-300">Latest Articles</h2>
          <button
            onClick={() => setShowAddPost(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Post</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <motion.article
              key={post.id}
              className="bg-cyan-950/30 rounded-lg overflow-hidden border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-cyan-600/90 rounded-full text-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-cyan-300 mb-2">
                  {post.title}
                </h3>
                <p className="text-cyan-400 mb-4 line-clamp-2">
                  {post.content}
                </p>
                <div className="flex items-center justify-between text-sm text-cyan-500">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{format(post.date, 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Add Post Modal */}
      {showAddPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <motion.div 
            className="bg-gradient-to-br from-cyan-950/50 to-blue-950/50 rounded-xl border border-cyan-500/30 w-full max-w-2xl p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl text-cyan-300">Add New Blog Post</h3>
              <button
                onClick={() => setShowAddPost(false)}
                className="text-cyan-500 hover:text-cyan-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-cyan-400 mb-2">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-700/50 text-cyan-100 px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <label className="block text-cyan-400 mb-2">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-700/50 text-cyan-100 px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 h-32"
                  placeholder="Enter post content"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-400 mb-2">Author</label>
                  <input
                    type="text"
                    value={newPost.author}
                    onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                    className="w-full bg-black/50 border border-cyan-700/50 text-cyan-100 px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                    placeholder="Enter author name"
                  />
                </div>
                <div>
                  <label className="block text-cyan-400 mb-2">Category</label>
                  <input
                    type="text"
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    className="w-full bg-black/50 border border-cyan-700/50 text-cyan-100 px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                    placeholder="Enter category"
                  />
                </div>
              </div>
              <div>
                <label className="block text-cyan-400 mb-2">Image URL</label>
                <input
                  type="text"
                  value={newPost.image}
                  onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                  className="w-full bg-black/50 border border-cyan-700/50 text-cyan-100 px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                  placeholder="Enter image URL"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowAddPost(false)}
                  className="flex-1 px-4 py-3 border border-cyan-700/50 text-cyan-400 rounded-lg hover:bg-cyan-950/30 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddPost}
                  className="flex-1 px-4 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors"
                >
                  Publish Post
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Blog;