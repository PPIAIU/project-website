import { useEffect, useState, useMemo } from "react";
import { Calendar, User, Search, X, Filter, Tag, BookOpen } from "lucide-react";
import { Link } from "react-router";
import { useData } from "../contexts/DataContext";
import { useLanguage } from "../contexts/LanguageContext";
import { TranslationKey } from "../i18n/translations";
import { SEO } from "../components/SEO";

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

// Helper to infer category if not explicitly specified
const resolveCategory = (category?: string, title?: string, excerpt?: string): string => {
  if (category && category.trim()) return category;
  
  const text = `${title || ""} ${excerpt || ""}`.toLowerCase();
  if (text.includes("beasiswa") || text.includes("webinar") || text.includes("studi") || text.includes("akademik") || text.includes("pendidikan")) {
    return "Akademik";
  }
  if (text.includes("budaya") || text.includes("kemerdekaan") || text.includes("festival") || text.includes("seni") || text.includes("indiversion")) {
    return "Budaya & Seni";
  }
  if (text.includes("bakti") || text.includes("sosial") || text.includes("gathering") || text.includes("peduli") || text.includes("olahraga")) {
    return "Sosial & Bakti";
  }
  if (text.includes("kewirausahaan") || text.includes("ekonomi") || text.includes("bisnis") || text.includes("workshop")) {
    return "Ekonomi & Bisnis";
  }
  if (text.includes("mubes") || text.includes("raker") || text.includes("organisasi") || text.includes("studi banding")) {
    return "Internal Organisasi";
  }
  return "Umum";
};

// Category badge color mapper
const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case "Akademik":
      return "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "Budaya & Seni":
      return "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    case "Sosial & Bakti":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    case "Ekonomi & Bisnis":
      return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    case "Internal Organisasi":
      return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const CATEGORIES = [
  "Semua",
  "Akademik",
  "Budaya & Seni",
  "Sosial & Bakti",
  "Ekonomi & Bisnis",
  "Internal Organisasi",
];

const getCategoryLabel = (category: string, t: TranslationKey): string => {
  switch (category) {
    case "Semua":
      return t.blog.categories.all;
    case "Akademik":
      return t.blog.categories.academic;
    case "Budaya & Seni":
      return t.blog.categories.culture;
    case "Sosial & Bakti":
      return t.blog.categories.social;
    case "Ekonomi & Bisnis":
      return t.blog.categories.economy;
    case "Internal Organisasi":
      return t.blog.categories.internal;
    case "Umum":
      return t.blog.categories.general;
    default:
      return category;
  }
};

export function Blog() {
  const { blogPosts, blogLoaded, fetchBlogPosts } = useData();
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  // Prepared posts with resolved categories
  const preparedPosts = useMemo(() => {
    return blogPosts.map((post) => ({
      ...post,
      computedCategory: resolveCategory(post.category, post.title, post.excerpt),
    }));
  }, [blogPosts]);

  // Calculate counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: preparedPosts.length };
    for (const cat of CATEGORIES) {
      if (cat !== "Semua") counts[cat] = 0;
    }
    for (const post of preparedPosts) {
      if (counts[post.computedCategory] !== undefined) {
        counts[post.computedCategory]++;
      } else {
        counts[post.computedCategory] = (counts[post.computedCategory] || 0) + 1;
      }
    }
    return counts;
  }, [preparedPosts]);

  // Filtered posts based on search and category
  const filteredPosts = useMemo(() => {
    return preparedPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "Semua" || post.computedCategory === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q) ||
        post.computedCategory.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [preparedPosts, selectedCategory, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Semua");
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <SEO title={t.blog.title} description={t.blog.subtitle} />

      {/* Header Banner */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">{t.blog.title}</h1>
          <p className="text-center mt-3 text-lg opacity-90 max-w-2xl mx-auto">
            {t.blog.subtitle}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Filter Controls */}
        <div className="max-w-5xl mx-auto bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm mb-10 space-y-5">
          {/* Search Bar Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.blog.searchPlaceholder}
              className="w-full pl-12 pr-10 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground"
                title={t.blog.resetFilter}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Filter size={14} />
              <span>{t.blog.filterCategory}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                const count = categoryCounts[cat] || 0;
                const label = getCategoryLabel(cat, t);

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-sm font-semibold"
                        : "bg-muted/40 hover:bg-muted text-foreground border-border"
                    }`}
                  >
                    <span>{label}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-muted-foreground/10 text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search Results Summary */}
        {(searchQuery || selectedCategory !== "Semua") && (
          <div className="max-w-5xl mx-auto flex items-center justify-between mb-6 px-1">
            <p className="text-sm text-muted-foreground">
              {t.blog.showing} <span className="font-bold text-foreground">{filteredPosts.length}</span> {t.blog.activities}
              {searchQuery && (
                <>
                  {" "}
                  {t.blog.forSearch} <span className="font-semibold text-primary">"{searchQuery}"</span>
                </>
              )}
              {selectedCategory !== "Semua" && (
                <>
                  {" "}
                  {t.blog.inCategory} <span className="font-semibold text-primary">"{getCategoryLabel(selectedCategory, t)}"</span>
                </>
              )}
            </p>

            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <X size={14} /> {t.blog.resetFilter}
            </button>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {!blogLoaded ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredPosts.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-card border border-border rounded-xl p-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
                <BookOpen size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">{t.blog.notFoundTitle}</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {t.blog.notFoundDesc}
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
              >
                {t.blog.showAllBtn}
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative overflow-hidden h-48 bg-muted">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        style={{
                          objectPosition: getObjectPosition(post.image_url),
                          transform: `${getScaleTransform(post.image_url)} translateZ(0)`,
                          transformOrigin: "center",
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        {t.blog.noImage}
                      </div>
                    )}
                    {/* Category Badge on Top Right of Card */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border shadow-sm flex items-center gap-1 ${getCategoryBadgeClass(
                          post.computedCategory
                        )}`}
                      >
                        <Tag size={12} />
                        {getCategoryLabel(post.computedCategory, t)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 border-t border-border/50 mt-auto">
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-4">
                    <div className="flex items-center space-x-1.5 font-medium">
                      <User size={15} className="text-primary" />
                      <span className="truncate max-w-[120px]">{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 font-medium">
                      <Calendar size={15} />
                      <span>
                        {new Date(post.date).toLocaleDateString(
                          language === "id" ? "id-ID" : "en-US",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}