import { useEffect } from "react";
import { Calendar, User } from "lucide-react";
import { Link } from "react-router";
import { useData } from "../contexts/DataContext";

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow animate-pulse">
      <div className="h-48 bg-muted"></div>
      <div className="p-6">
        <div className="h-5 bg-muted rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-muted rounded w-full mb-2"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
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

export function Blog() {
  const { blogPosts, blogLoaded, fetchBlogPosts } = useData();

  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

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
          {!blogLoaded
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : blogPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="bg-card border border-border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow block"
                >
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      style={{ 
                        objectPosition: getObjectPosition(post.image_url),
                        transform: `${getScaleTransform(post.image_url)} translateZ(0)`,
                        transformOrigin: 'center'
                      }}
                      className="w-full h-48 object-cover will-change-transform"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
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
                        <span>
                          {new Date(post.date).toLocaleDateString("id-ID")}
                        </span>
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