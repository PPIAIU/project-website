import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useData } from "../contexts/DataContext";
import { supabase } from "../../lib/supabase";

interface BlogDetailPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  date: string;
}

function SkeletonDetail() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="h-4 bg-white/20 rounded w-20 mb-6"></div>
          <div className="h-8 bg-white/20 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-white/20 rounded w-1/3"></div>
        </div>
      </div>
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="w-full h-96 bg-muted rounded-lg animate-pulse mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-4/6 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
      </article>
    </div>
  );
}

const getObjectPosition = (url: string | null) => {
  if (!url) return "center";
  try {
    const urlObj = new URL(url);
    const pos = urlObj.searchParams.get("pos");
    return pos ? `center ${pos}%` : "center";
  } catch (e) {
    const match = url.match(/[?&]pos=(\d+)/);
    return match ? `center ${match[1]}%` : "center";
  }
};

const getScaleTransform = (url: string | null) => {
  if (!url) return "scale(1)";
  try {
    const urlObj = new URL(url);
    const scale = urlObj.searchParams.get("scale");
    return scale ? `scale(${scale})` : "scale(1)";
  } catch (e) {
    const match = url.match(/[?&]scale=([0-9.]+)/);
    return match ? `scale(${match[1]})` : "scale(1)";
  }
};

export function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogPosts, blogLoaded } = useData();
  const [post, setPost] = useState<BlogDetailPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Try to find in cached blog posts first (instant)
    if (blogLoaded && id) {
      const cached = blogPosts.find((p) => p.id === id);
      if (cached) {
        // We need full content, check if cached post has it
        // Blog list doesn't include content, so we still need to fetch
        // But at least we can show title/excerpt immediately
      }
    }

    fetchBlogPost();
  }, [id, blogPosts, blogLoaded]);

  const fetchBlogPost = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    // Try cache first - if the cached post has content, use it
    if (blogLoaded) {
      const cached = blogPosts.find((p) => p.id === id);
      if (cached && (cached as any).content) {
        setPost({
          id: cached.id,
          title: cached.title,
          excerpt: cached.excerpt,
          content: (cached as any).content || cached.excerpt,
          image_url: cached.image_url,
          author: cached.author,
          date: cached.date,
        });
        setLoading(false);
        return;
      }
    }

    // Fetch from Supabase
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .single();

      if (error || !data) {
        console.error("Error fetching blog post:", error);
        setPost(null);
        setLoading(false);
        return;
      }

      setPost({
        id: data.id,
        title: data.title,
        excerpt: data.excerpt || "",
        content: data.content || data.excerpt || "",
        image_url: data.image_url || "",
        author: data.author || "PPI AIU",
        date: data.published_at || data.created_at,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      setPost(null);
      setLoading(false);
    }
  };

  if (loading) {
    return <SkeletonDetail />;
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
              <span>
                {new Date(post.date).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              style={{ 
                objectPosition: getObjectPosition(post.image_url),
                transform: `${getScaleTransform(post.image_url)} translateZ(0)`,
                transformOrigin: 'center'
              }}
              className="w-full h-96 object-cover rounded-lg shadow-lg mb-8 will-change-transform"
            />
          )}

          <div className="prose prose-lg max-w-none">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{
                __html: post.content || post.excerpt,
              }}
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