import { Code, Github, Linkedin, Mail } from "lucide-react";
import abidinPhoto from "../../imports/abidin.jpg";
import nardiPhoto from "../../imports/nardi.jpg";
import ariaPhoto from "../../imports/aria.png";

interface Developer {
  name: string;
  role: string;
  photo: string;
  bio: string;
  github?: string;
  linkedin?: string;
  email?: string;
}

export function Developers() {
  const developers: Developer[] = [
    {
      name: "Muhammad Zulfan Abidin",
      role: "Fullstack Web Developer — Secretary General PPI AIU 2023/2024",
      photo: abidinPhoto,
      bio: "This website helps people learn more about PPI AIU and aims to be sustainable for future generations.",
      github: "https://github.com/Zulfan20",
      linkedin: "https://www.linkedin.com/in/muhammad-zulfan-abidin-b4427b212/",
      email: "zulfanisious20@gmail.com",
    },
    {
      name: "Nardi",
      role: "Fullstack Web Developer — Secretary Department of Penkastrat PPI AIU 2023/2024",
      photo: nardiPhoto,
      bio: "A Computer Science student who contributed to developing this platform to connect people with PPI AIU.",
      github: "https://github.com/nardi-nardi",
      linkedin: "https://www.linkedin.com/in/nardinardi/",
      email: "700nardi@gmail.com",
    },
    {
      name: "Aria Firmansyah",
      role: "Full Stack Web Developer — Vice Precident 2 PPI AIU 2024/2025",
      photo: ariaPhoto,
      bio: "Passionate about creating user-friendly interfaces and enhancing the user experience of the website.",
      github: "https://github.com/waltercoy",
      linkedin: "https://www.linkedin.com/in/aria-firmansyah-0b1a87286/",
      email: "ariafms00@gmail.com",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Code className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold">Development Team</h1>
            <p className="text-xl opacity-90 mt-4 max-w-2xl mx-auto">
              Tim developer yang membangun website PPI AIU
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developers.map((dev, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                  <img
                    src={dev.photo}
                    alt={dev.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{dev.name}</h3>
                  <p className="text-sm text-primary font-semibold mb-3">
                    {dev.role}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {dev.bio}
                  </p>
                  <div className="flex items-center space-x-3 pt-4 border-t border-border">
                    {dev.github && (
                      <a
                        href={dev.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="GitHub"
                      >
                        <Github size={20} />
                      </a>
                    )}
                    {dev.linkedin && (
                      <a
                        href={dev.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin size={20} />
                      </a>
                    )}
                    {dev.email && (
                      <a
                        href={`mailto:${dev.email}`}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="Email"
                      >
                        <Mail size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-16 bg-muted/30 border border-border rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
          <p className="text-muted-foreground mb-6">
            Website ini dibangun menggunakan teknologi modern untuk performa dan
            skalabilitas terbaik
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 bg-card rounded-lg border border-border">
              <p className="font-bold">React 18</p>
              <p className="text-sm text-muted-foreground">Frontend</p>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border">
              <p className="font-bold">TypeScript</p>
              <p className="text-sm text-muted-foreground">Type Safety</p>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border">
              <p className="font-bold">Supabase</p>
              <p className="text-sm text-muted-foreground">Backend</p>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border">
              <p className="font-bold">Tailwind CSS</p>
              <p className="text-sm text-muted-foreground">Styling</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
