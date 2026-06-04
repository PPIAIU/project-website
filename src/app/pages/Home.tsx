import { Link } from "react-router";
import {
  Users,
  BookOpen,
  FileText,
  Calendar,
  User,
  ArrowRight,
  Award,
} from "lucide-react";
import { motion } from "motion/react";
import heroVideo from "../../imports/hero_background-1.mp4";
import communityPhoto from "../../imports/DSC_0428__1_.JPG";
import { getRecentPosts } from "../data/blogPosts";
import { useLanguage } from "../contexts/LanguageContext";

export function Home() {
  const { t, language } = useLanguage();
  const recentPosts = getRecentPosts(3);

  // Video URLs - Ganti dengan link yang sebenarnya
  const indiversionVideoUrl =
    "https://www.youtube.com/embed/EzmKLeWBFGo"; // YouTube - Ganti dengan link Indiversion
  const aiuMamVideoUrl =
    "https://www.instagram.com/reel/DITlSWGzD7D/embed"; // Instagram Reels - Ganti REEL_ID dengan ID reels AIU MAM

  return (
    <div>
      <section className="relative bg-primary text-primary-foreground min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={heroVideo}
        >
          {/* Fallback jika video tidak tersedia */}
        </video>

        {/* Konten */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{
              textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            {t.home.hero.title}
          </h1>
          <p
            className="text-xl md:text-2xl mb-8 opacity-90"
            style={{
              textShadow: "2px 2px 6px rgba(0,0,0,0.8)",
            }}
          >
            {t.home.hero.subtitle}
          </p>
          <Link
            to="/about"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors shadow-lg"
          >
            {t.home.hero.cta}
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-white/10 rounded-lg p-8">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <div className="text-5xl font-bold mb-2">
                  200+
                </div>
                <p className="text-lg opacity-90">
                  {t.home.stats.students}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-white/10 rounded-lg p-8">
                <BookOpen className="w-12 h-12 mx-auto mb-4" />
                <div className="text-5xl font-bold mb-2">
                  100+
                </div>
                <p className="text-lg opacity-90">
                  {t.home.stats.activities}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
            >
              <div className="bg-white/10 rounded-lg p-8">
                <Award className="w-12 h-12 mx-auto mb-4" />
                <div className="text-5xl font-bold mb-2">
                  300+
                </div>
                <p className="text-lg opacity-90">
                  {t.home.stats.alumni}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t.home.about.title}
            </h2>

            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="text-center md:text-left">
                <p className="text-lg mb-6">
                  {t.home.about.desc1}
                </p>
                <p className="text-lg mb-6">
                  {t.home.about.desc2}
                </p>
                <Link
                  to="/about"
                  className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  <span>{t.home.about.readMore}</span>
                  <ArrowRight size={20} />
                </Link>
              </div>

              <div>
                <div className="rounded-xl overflow-hidden shadow-xl border-4 border-primary/20">
                  <img
                    src={communityPhoto}
                    alt={t.home.about.photoCaption}
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground mt-3 italic">
                  {t.home.about.photoCaption}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            {t.home.featuredPrograms.title}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t.home.featuredPrograms.subtitle}
          </p>

          <div className="space-y-16 max-w-6xl mx-auto">
            {/* Indiversion */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-primary/10 inline-block px-4 py-1 rounded-full text-primary font-semibold text-sm mb-4">
                  {t.home.featuredPrograms.badge}
                </div>
                <h3 className="text-3xl font-bold mb-4">
                  {t.home.featuredPrograms.indiversion.title}
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  {t.home.featuredPrograms.indiversion.desc}
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-start space-x-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>
                      {
                        t.home.featuredPrograms.indiversion
                          .feature1
                      }
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>
                      {
                        t.home.featuredPrograms.indiversion
                          .feature2
                      }
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>
                      {
                        t.home.featuredPrograms.indiversion
                          .feature3
                      }
                    </span>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="bg-muted rounded-lg overflow-hidden shadow-lg aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={indiversionVideoUrl}
                    title="Indiversion - Festival Budaya Indonesia"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* AIU MAM */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div
                  className="bg-muted rounded-lg overflow-hidden shadow-lg"
                  style={{ height: "600px" }}
                >
                  <iframe
                    width="100%"
                    height="100%"
                    src={aiuMamVideoUrl}
                    title="AIU Model ASEAN Meeting"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    scrolling="no"
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
              <div>
                <div className="bg-primary/10 inline-block px-4 py-1 rounded-full text-primary font-semibold text-sm mb-4">
                  {t.home.featuredPrograms.badge}
                </div>
                <h3 className="text-3xl font-bold mb-4">
                  {t.home.featuredPrograms.aiuMam.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 italic">
                  {t.home.featuredPrograms.aiuMam.subtitle}
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  {t.home.featuredPrograms.aiuMam.desc}
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-start space-x-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>
                      {t.home.featuredPrograms.aiuMam.feature1}
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>
                      {t.home.featuredPrograms.aiuMam.feature2}
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>
                      {t.home.featuredPrograms.aiuMam.feature3}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">
              {t.home.activities.title}
            </h2>
            <Link
              to="/blog"
              className="flex items-center space-x-2 text-primary hover:underline font-semibold"
            >
              <span>{t.home.activities.viewAll}</span>
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
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
                  <h3 className="text-xl font-bold mb-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User size={16} />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>
                        {new Date(post.date).toLocaleDateString(
                          language === "id" ? "id-ID" : "en-US",
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t.home.features.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Link
              to="/members"
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-bold mb-2">
                {t.home.features.board}
              </h3>
              <p className="text-muted-foreground">
                {t.home.features.boardDesc}
              </p>
            </Link>

            <Link
              to="/blog"
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <BookOpen className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-bold mb-2">
                {t.home.features.activities}
              </h3>
              <p className="text-muted-foreground">
                {t.home.features.activitiesDesc}
              </p>
            </Link>

            <Link
              to="/foundation"
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <FileText className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-bold mb-2">
                {t.home.features.documents}
              </h3>
              <p className="text-muted-foreground">
                {t.home.features.documentsDesc}
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}