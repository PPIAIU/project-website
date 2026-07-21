import {
  Eye,
  Target,
  Heart,
  Award,
  Shield,
  Sparkles,
  Users,
  Globe,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import mubesPhoto from "../../imports/mubes-1-1.jpeg";
import festivalBudayaPhoto from "../../imports/image-6.png";
import aiuMamPhoto from "../../imports/image-7.png";
import { useLanguage } from "../contexts/LanguageContext";

export function About() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            {t.about.hero.title}
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            {t.about.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              {t.about.story.title}
            </h2>

            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg mb-4">
                  {t.about.story.description1}
                </p>
                <p className="text-lg mb-4">
                  {t.about.story.description2}
                </p>
                <p className="text-lg">
                  {t.about.story.description3}
                </p>
              </div>

              <div>
                <div className="bg-card rounded-xl overflow-hidden shadow-xl border-4 border-primary/20">
                  <img
                    src={mubesPhoto}
                    alt={t.about.story.photoCaption}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                  <div className="bg-primary text-primary-foreground p-4 text-center">
                    <p className="font-bold text-lg">
                      {t.about.story.photoCaption}
                    </p>
                    <p className="text-sm opacity-90 mt-1">
                      {t.about.story.photoDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            {t.about.vision.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Vision */}
            <div className="bg-primary text-primary-foreground rounded-xl p-8 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Eye className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">
                  {t.about.vision.visionTitle}
                </h3>
              </div>
              <p className="text-lg leading-relaxed">
                {t.about.vision.visionText}
              </p>
            </div>

            {/* Mission */}
            <div className="bg-card border-2 border-primary rounded-xl p-8 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">
                  {t.about.vision.missionTitle}
                </h3>
              </div>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t.about.vision.mission1}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t.about.vision.mission2}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t.about.vision.mission3}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t.about.vision.mission4}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{t.about.vision.mission5}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            {t.about.values.title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg hover:border-primary transition-all">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-bold text-lg mb-2">
                {t.about.values.unity}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t.about.values.unityDesc}
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg hover:border-primary transition-all">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-bold text-lg mb-2">
                {t.about.values.excellence}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t.about.values.excellenceDesc}
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg hover:border-primary transition-all">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-bold text-lg mb-2">
                {t.about.values.integrity}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t.about.values.integrityDesc}
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg hover:border-primary transition-all">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-bold text-lg mb-2">
                {t.about.values.culture}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t.about.values.cultureDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            {t.about.whatWeDo.title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                {t.about.whatWeDo.community}
              </h3>
              <p className="text-muted-foreground">
                {t.about.whatWeDo.communityDesc}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                {t.about.whatWeDo.cultural}
              </h3>
              <p className="text-muted-foreground">
                {t.about.whatWeDo.culturalDesc}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                {t.about.whatWeDo.academic}
              </h3>
              <p className="text-muted-foreground">
                {t.about.whatWeDo.academicDesc}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                {t.about.whatWeDo.career}
              </h3>
              <p className="text-muted-foreground">
                {t.about.whatWeDo.careerDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            {t.about.timeline.title}
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-primary text-primary-foreground w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                2020
              </div>
              <div className="flex-1 bg-card rounded-lg border border-border overflow-hidden">
                <img
                  src={mubesPhoto}
                  alt="Peresmian PPI AIU 2020"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">
                    {t.about.timeline.year2020}
                  </h3>
                  <p className="text-muted-foreground">
                    {t.about.timeline.year2020Desc}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary text-primary-foreground w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                2021
              </div>
              <div className="flex-1 bg-card p-6 rounded-lg border border-border">
                <h3 className="font-bold text-lg mb-2">
                  {t.about.timeline.year2021}
                </h3>
                <p className="text-muted-foreground">
                  {t.about.timeline.year2021Desc}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary text-primary-foreground w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                2023
              </div>
              <div className="flex-1 bg-card rounded-lg border border-border overflow-hidden">
                <img
                  src={festivalBudayaPhoto}
                  alt="Indiversion - Festival Budaya Indonesia 2023"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">
                    {t.about.timeline.year2023}
                  </h3>
                  <p className="text-muted-foreground">
                    {t.about.timeline.year2023Desc}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary text-primary-foreground w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                2024
              </div>
              <div className="flex-1 bg-card rounded-lg border border-border overflow-hidden">
                <img
                  src={aiuMamPhoto}
                  alt="AIU Model ASEAN Meeting 2024"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">
                    {t.about.timeline.year2024}
                  </h3>
                  <p className="text-muted-foreground">
                    {t.about.timeline.year2024Desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}