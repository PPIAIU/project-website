import { useState, useEffect } from "react";
import { Calendar, User } from "lucide-react";
import { Link } from "react-router";
import { supabase, type BlogPost as SupabaseBlogPost } from "../../lib/supabase";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  author: string;
  date: string;
}

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching blog posts:', error);
        setLoading(false);
        return;
      }

      const formattedPosts: BlogPost[] = (data || []).map((post) => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || '',
        image_url: post.image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
        author: post.author || 'PPI AIU',
        date: post.published_at || post.created_at,
      }));

      setPosts(formattedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg">Memuat aktivitas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">Rekam Jejak Aktivitas</h1>
          <p className="text-center mt-4 opacity-90">
            Kegiatan dan program kerja PPI AIU
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="bg-card border border-border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow block"
            >
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User size={16} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>{new Date(post.date).toLocaleDateString("id-ID")}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
