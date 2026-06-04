import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  date: string;
}

export function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogPost();
  }, [id]);

  const fetchBlogPost = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();

      if (error || !data) {
        console.error('Error fetching blog post:', error);
        setPost(null);
        setLoading(false);
        return;
      }

      setPost({
        id: data.id,
        title: data.title,
        excerpt: data.excerpt || '',
        content: data.content || data.excerpt || '',
        image_url: data.image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
        author: data.author || 'PPI AIU',
        date: data.published_at || data.created_at,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setPost(null);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg">Memuat artikel...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-primary hover:underline"
          >
            <ArrowLeft size={20} />
            <span>Kembali ke Aktivitas</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 mb-4 hover:underline"
          >
            <ArrowLeft size={20} />
            <span>Kembali</span>
          </button>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center space-x-6 text-sm opacity-90">
            <div className="flex items-center space-x-2">
              <User size={18} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={18} />
              <span>{new Date(post.date).toLocaleDateString("id-ID", {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
        </div>
      </div>

      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg mb-8"
          />

          <div className="prose prose-lg max-w-none">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }}
            />
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <Link
              to="/blog"
              className="inline-flex items-center space-x-2 text-primary hover:underline font-semibold"
            >
              <ArrowLeft size={20} />
              <span>Lihat Artikel Lainnya</span>
            </Link>
          </div>
        </div>
      </article>

      <style>{`
        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .blog-content p {
          margin-bottom: 1rem;
          line-height: 1.75;
        }
        .blog-content ul, .blog-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
        }
        .blog-content strong {
          font-weight: 600;
          color: var(--primary);
        }
      `}</style>
    </div>
  );
}
