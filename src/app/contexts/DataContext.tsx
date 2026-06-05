import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { supabase } from "../../lib/supabase";

// ---- Types ----
export interface CachedMember {
  id: string;
  name: string;
  position: string;
  photo_url: string;
}

export interface CachedDivision {
  id: string;
  name: string;
  members: CachedMember[];
}

export interface CachedYearData {
  year: string;
  group_photo_url: string;
  divisions: CachedDivision[];
}

export interface CachedBlogPost {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  author: string;
  date: string;
  content?: string;
}

export interface CachedDocument {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_size: string;
  last_updated: string;
}

interface DataContextType {
  // Members
  yearsData: CachedYearData[];
  membersLoaded: boolean;
  fetchMembers: () => Promise<void>;
  // Blog
  blogPosts: CachedBlogPost[];
  blogLoaded: boolean;
  fetchBlogPosts: () => Promise<void>;
  // Documents
  documents: CachedDocument[];
  documentsLoaded: boolean;
  fetchDocuments: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // ---- Members state ----
  const [yearsData, setYearsData] = useState<CachedYearData[]>([]);
  const [membersLoaded, setMembersLoaded] = useState(false);

  // ---- Blog state ----
  const [blogPosts, setBlogPosts] = useState<CachedBlogPost[]>([]);
  const [blogLoaded, setBlogLoaded] = useState(false);

  // ---- Documents state ----
  const [documents, setDocuments] = useState<CachedDocument[]>([]);
  const [documentsLoaded, setDocumentsLoaded] = useState(false);

  // ---- Fetch Members (optimized: 2 queries) ----
  const fetchMembers = useCallback(async () => {
    if (membersLoaded) return; // already cached

    try {
      // Query 1: Get all years
      const { data: years, error: yearsError } = await supabase
        .from("years")
        .select("id, year, group_photo_url")
        .order("year", { ascending: false });

      if (yearsError || !years) {
        console.error("Error fetching years:", yearsError);
        setMembersLoaded(true);
        return;
      }

      // Query 2: Get all divisions with nested members
      const { data: divisionsData, error: divError } = await supabase
        .from("divisions")
        .select("id, name, year_id, members:id(division_id, id, name, position, photo_url, sort_order)");

      // If nested select fails, fall back to flat query
      let allDivisions: any[] = [];
      if (divError || !divisionsData) {
        // Fallback: get divisions then members separately
        const { data: divs } = await supabase
          .from("divisions")
          .select("id, name, year_id")
          .order("name");

        if (divs) {
          allDivisions = divs;
        }
      } else {
        allDivisions = divisionsData;
      }

      // Get member counts per division if we don't have nested data
      const hasNestedMembers = !divError && divisionsData && divisionsData.length > 0 && Array.isArray(divisionsData[0]?.members);

      let membersByDivision: Record<string, any[]> = {};
      if (!hasNestedMembers && allDivisions.length > 0) {
        // Fetch all members in one query
        const divisionIds = allDivisions.map((d: any) => d.id);
        const { data: allMembers } = await supabase
          .from("members")
          .select("id, name, position, photo_url, division_id, sort_order")
          .in("division_id", divisionIds)
          .order("sort_order");

        if (allMembers) {
          for (const m of allMembers) {
            if (!membersByDivision[m.division_id]) {
              membersByDivision[m.division_id] = [];
            }
            membersByDivision[m.division_id].push(m);
          }
        }
      }

      // Build the hierarchical data
      const yearsWithDivisions: CachedYearData[] = years.map((year) => {
        const yearDivisions = allDivisions
          .filter((d: any) => d.year_id === year.id)
          .map((d: any) => {
            let members: any[];
            if (hasNestedMembers && Array.isArray(d.members)) {
              members = d.members.map((m: any) => ({
                id: m.id,
                name: m.name,
                position: m.position,
                photo_url: m.photo_url || "",
              }));
            } else {
              members = (membersByDivision[d.id] || []).map((m: any) => ({
                id: m.id,
                name: m.name,
                position: m.position,
                photo_url: m.photo_url || "",
              }));
            }
            return {
              id: d.id,
              name: d.name,
              members,
            };
          });

        return {
          year: year.year,
          group_photo_url: year.group_photo_url || "",
          divisions: yearDivisions,
        };
      });

      setYearsData(yearsWithDivisions);
      setMembersLoaded(true);
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembersLoaded(true);
    }
  }, [membersLoaded]);

  // ---- Fetch Blog Posts ----
  const fetchBlogPosts = useCallback(async () => {
    if (blogLoaded) return;

    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Error fetching blog posts:", error);
        setBlogLoaded(true);
        return;
      }

      setBlogPosts(
        (data || []).map((post) => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt || "",
          image_url: post.image_url || "",
          author: post.author || "PPI AIU",
          date: post.published_at || post.created_at,
        }))
      );
      setBlogLoaded(true);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setBlogLoaded(true);
    }
  }, [blogLoaded]);

  // ---- Fetch Documents ----
  const fetchDocuments = useCallback(async () => {
    if (documentsLoaded) return;

    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching documents:", error);
        setDocumentsLoaded(true);
        return;
      }

      setDocuments(
        (data || []).map((doc) => ({
          id: doc.id,
          title: doc.title,
          description: doc.description || "",
          file_url: doc.file_url,
          file_size: doc.file_size || "N/A",
          last_updated: doc.updated_at,
        }))
      );
      setDocumentsLoaded(true);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocumentsLoaded(true);
    }
  }, [documentsLoaded]);

  return (
    <DataContext.Provider
      value={{
        yearsData,
        membersLoaded,
        fetchMembers,
        blogPosts,
        blogLoaded,
        fetchBlogPosts,
        documents,
        documentsLoaded,
        fetchDocuments,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
}