import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { LogOut, Users, BookOpen, FileText, Plus, Edit, Trash2, ChevronDown, ChevronRight, ShieldCheck, Shield, UserCheck, Key, UserPlus } from "lucide-react";
import { BlogPostForm } from "../components/BlogPostForm";
import { MemberForm } from "../components/MemberForm";
import { YearForm } from "../components/YearForm";
import { DocumentForm } from "../components/DocumentForm";
import { AdminUserForm } from "../components/AdminUserForm";
import { supabase } from "../../lib/supabase";
import {
  AdminUser,
  getCurrentAdminSession,
  fetchAdminUsers,
  saveAdminUser,
  deleteAdminUser,
  clearAdminSession,
} from "../../lib/adminUsers";

type Tab = "members" | "blog" | "documents" | "users";

interface Member {
  id: string;
  name: string;
  position: string;
  division: string;
  photo_url: string;
}

interface YearData {
  year: string;
  group_photo_url: string;
  members: Member[];
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image_url: string;
}

interface Document {
  id: string;
  title: string;
  description: string;
  file_url: string;
}

const getObjectPosition = (url: string | null, defaultPos = "center top") => {
  if (!url) return defaultPos;
  try {
    const urlObj = new URL(url);
    const pos = urlObj.searchParams.get("pos");
    return pos ? `center ${pos}%` : defaultPos;
  } catch (e) {
    const match = url.match(/[?&]pos=(\d+)/);
    return match ? `center ${match[1]}%` : defaultPos;
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

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("members");
  const [yearsData, setYearsData] = useState<YearData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | undefined>();
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member & { year: string } | undefined>();
  const [showYearForm, setShowYearForm] = useState(false);
  const [editingYear, setEditingYear] = useState<{ year: string; group_photo_url: string } | undefined>();
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | undefined>();
  
  // Admin User Management State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [adminUsersList, setAdminUsersList] = useState<AdminUser[]>([]);
  const [showAdminUserForm, setShowAdminUserForm] = useState(false);
  const [editingAdminUser, setEditingAdminUser] = useState<AdminUser | undefined>();

  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const session = getCurrentAdminSession();
    setCurrentUser(session);

    fetchAllData();
    loadAdminUsersList();
  }, [navigate]);

  const loadAdminUsersList = async () => {
    const users = await fetchAdminUsers();
    setAdminUsersList(users);
  };

  const fetchAllData = async () => {
    await Promise.all([fetchYearsData(), fetchBlogPosts(), fetchDocuments()]);
  };

  const fetchYearsData = async () => {
    try {
      const { data: years, error: yearsError } = await supabase
        .from('years')
        .select('*')
        .order('year', { ascending: false });

      if (yearsError) {
        console.error('Error fetching years:', yearsError);
        return;
      }

      const yearsWithMembers = await Promise.all(
        (years || []).map(async (year) => {
          const { data: divisions, error: divisionsError } = await supabase
            .from('divisions')
            .select('*')
            .eq('year_id', year.id);

          if (divisionsError) {
            console.error('Error fetching divisions:', divisionsError);
            return {
              year: year.year,
              group_photo_url: '',
              members: [],
            };
          }

          const allMembers: Member[] = [];
          for (const division of divisions || []) {
            const { data: members, error: membersError } = await supabase
              .from('members')
              .select('*')
              .eq('division_id', division.id);

            if (!membersError && members) {
              allMembers.push(
                ...members.map((m) => ({
                  id: m.id,
                  name: m.name,
                  position: m.position,
                  division: division.name,
                  photo_url: m.photo_url || '',
                }))
              );
            }
          }

          return {
            year: year.year,
            group_photo_url: year.group_photo_url || '',
            members: allMembers,
          };
        })
      );

      setYearsData(yearsWithMembers);
    } catch (error) {
      console.error('Error fetching years data:', error);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blog posts:', error);
        return;
      }

      setBlogPosts(
        (data || []).map((post) => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt || '',
          content: post.content || '',
          author: post.author || 'PPI AIU',
          date: post.published_at || post.created_at,
          image_url: post.image_url || '',
        }))
      );
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }

      setDocuments(
        (data || []).map((doc) => ({
          id: doc.id,
          title: doc.title,
          description: doc.description || '',
          file_url: doc.file_url,
        }))
      );
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    navigate("/login");
  };

  const handleAddAdminUser = () => {
    setEditingAdminUser(undefined);
    setShowAdminUserForm(true);
  };

  const handleEditAdminUser = (user: AdminUser) => {
    setEditingAdminUser(user);
    setShowAdminUserForm(true);
  };

  const handleSaveAdminUser = async (data: {
    name: string;
    email: string;
    password?: string;
    role: "super_admin" | "editor";
  }) => {
    try {
      await saveAdminUser({
        id: editingAdminUser?.id,
        ...data,
      });
      await loadAdminUsersList();
      setShowAdminUserForm(false);
      setEditingAdminUser(undefined);
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan akun admin");
    }
  };

  const handleDeleteAdminUser = async (user: AdminUser) => {
    if (user.email.toLowerCase() === "adm.ppi.aiu@gmail.com") {
      alert("Akun Utama Super Admin tidak dapat dihapus!");
      return;
    }

    if (currentUser && currentUser.id === user.id) {
      alert("Anda tidak dapat menghapus akun Anda sendiri saat sedang login!");
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus akun admin "${user.name}" (${user.email})?`)) {
      return;
    }

    try {
      await deleteAdminUser(user.id);
      await loadAdminUsersList();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus akun admin");
    }
  };

  const handleAddYear = () => {
    setEditingYear(undefined);
    setShowYearForm(true);
  };

  const handleEditYear = (year: string, groupPhotoUrl: string) => {
    setEditingYear({ year, group_photo_url: groupPhotoUrl });
    setShowYearForm(true);
  };

  const handleSaveYear = async (data: { year: string; group_photo_url: string }) => {
    try {
      if (editingYear) {
        // Update existing year's group photo
        const { data: yearRecord, error: findError } = await supabase
          .from('years')
          .select('id')
          .eq('year', editingYear.year)
          .single();

        if (findError || !yearRecord) {
          console.error('Error finding year:', findError);
          alert('Gagal menemukan tahun');
          return;
        }

        const { error: updateError } = await supabase
          .from('years')
          .update({ group_photo_url: data.group_photo_url })
          .eq('id', yearRecord.id);

        if (updateError) {
          console.error('Error updating year photo:', updateError);
          alert('Gagal mengupdate foto grup: ' + updateError.message);
          return;
        }

        await fetchYearsData();
      } else {
        // Add new year
        if (yearsData.some((y) => y.year === data.year)) {
          alert("Tahun ini sudah ada!");
          return;
        }

        const { error } = await supabase
          .from('years')
          .insert([{ year: data.year, group_photo_url: data.group_photo_url }]);

        if (error) {
          console.error('Error adding year:', error);
          alert('Gagal menambahkan tahun: ' + error.message);
          return;
        }

        await fetchYearsData();
      }
      setShowYearForm(false);
      setEditingYear(undefined);
    } catch (error) {
      console.error('Error saving year:', error);
      alert('Terjadi kesalahan saat menyimpan tahun');
    }
  };

  const handleDeleteYear = async (year: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kepengurusan tahun ${year}? Semua anggota di tahun ini akan ikut terhapus.`)) {
      return;
    }

    try {
      // Find year ID
      const { data: yearData, error: yearError } = await supabase
        .from('years')
        .select('id')
        .eq('year', year)
        .single();

      if (yearError || !yearData) {
        console.error('Error finding year:', yearError);
        alert('Gagal menemukan tahun');
        return;
      }

      // Delete year (cascade will delete divisions and members)
      const { error: deleteError } = await supabase
        .from('years')
        .delete()
        .eq('id', yearData.id);

      if (deleteError) {
        console.error('Error deleting year:', deleteError);
        alert('Gagal menghapus tahun: ' + deleteError.message);
        return;
      }

      await fetchYearsData();
      if (selectedYear === year) {
        setSelectedYear(null);
      }
    } catch (error) {
      console.error('Error deleting year:', error);
      alert('Terjadi kesalahan saat menghapus tahun');
    }
  };

  const handleAddMember = (year: string) => {
    setEditingMember(undefined);
    setShowMemberForm(true);
    setSelectedYear(year);
  };

  const handleEditMember = (year: string, member: Member) => {
    setEditingMember({ ...member, year });
    setShowMemberForm(true);
    setSelectedYear(year);
  };

  const handleSaveMember = async (memberData: Omit<Member, "id"> & { id?: string }) => {
    if (!selectedYear) return;

    try {
      // Get year ID
      const { data: yearData, error: yearError } = await supabase
        .from('years')
        .select('id')
        .eq('year', selectedYear)
        .single();

      if (yearError || !yearData) {
        console.error('Error finding year:', yearError);
        alert('Gagal menemukan tahun');
        return;
      }

      // Get or create division
      let divisionId: string;
      const { data: existingDivision, error: divisionFindError } = await supabase
        .from('divisions')
        .select('id')
        .eq('year_id', yearData.id)
        .eq('name', memberData.division)
        .maybeSingle();

      if (divisionFindError) {
        console.error('Error finding division:', divisionFindError);
        alert('Gagal mencari divisi');
        return;
      }

      if (existingDivision) {
        divisionId = existingDivision.id;
      } else {
        // Create new division
        const { data: newDivision, error: divisionCreateError } = await supabase
          .from('divisions')
          .insert([{ year_id: yearData.id, name: memberData.division }])
          .select('id')
          .single();

        if (divisionCreateError || !newDivision) {
          console.error('Error creating division:', divisionCreateError);
          alert('Gagal membuat divisi');
          return;
        }

        divisionId = newDivision.id;
      }

      if (memberData.id) {
        // Fetch old division_id to clean it up if it becomes empty
        const { data: oldMember } = await supabase
          .from('members')
          .select('division_id')
          .eq('id', memberData.id)
          .maybeSingle();

        // Update existing member
        const { error: updateError } = await supabase
          .from('members')
          .update({
            name: memberData.name,
            position: memberData.position,
            photo_url: memberData.photo_url,
            division_id: divisionId,
          })
          .eq('id', memberData.id);

        if (updateError) {
          console.error('Error updating member:', updateError);
          alert('Gagal mengupdate anggota: ' + updateError.message);
          return;
        }

        // Clean up old division if it is empty and changed
        if (oldMember?.division_id && oldMember.division_id !== divisionId) {
          const { data: remaining } = await supabase
            .from('members')
            .select('id')
            .eq('division_id', oldMember.division_id);

          if (!remaining || remaining.length === 0) {
            await supabase
              .from('divisions')
              .delete()
              .eq('id', oldMember.division_id);
          }
        }
      } else {
        // Add new member
        const { error: insertError } = await supabase
          .from('members')
          .insert([{
            division_id: divisionId,
            name: memberData.name,
            position: memberData.position,
            photo_url: memberData.photo_url,
            sort_order: 0,
          }]);

        if (insertError) {
          console.error('Error adding member:', insertError);
          alert('Gagal menambahkan anggota: ' + insertError.message);
          return;
        }
      }

      await fetchYearsData();
      setShowMemberForm(false);
      setEditingMember(undefined);
    } catch (error) {
      console.error('Error saving member:', error);
      alert('Terjadi kesalahan saat menyimpan anggota');
    }
  };

  const handleDeleteMember = async (year: string, memberId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
      return;
    }

    try {
      // Fetch member's division_id to clean it up if it becomes empty
      const { data: memberData } = await supabase
        .from('members')
        .select('division_id')
        .eq('id', memberId)
        .maybeSingle();

      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', memberId);

      if (error) {
        console.error('Error deleting member:', error);
        alert('Gagal menghapus anggota: ' + error.message);
        return;
      }

      // Clean up division if empty
      if (memberData?.division_id) {
        const { data: remainingMembers } = await supabase
          .from('members')
          .select('id')
          .eq('division_id', memberData.division_id);

        if (!remainingMembers || remainingMembers.length === 0) {
          await supabase
            .from('divisions')
            .delete()
            .eq('id', memberData.division_id);
        }
      }

      await fetchYearsData();
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Terjadi kesalahan saat menghapus anggota');
    }
  };

  const toggleYear = (year: string) => {
    setSelectedYear(selectedYear === year ? null : year);
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting blog post:', error);
        alert('Gagal menghapus artikel: ' + error.message);
        return;
      }

      await fetchBlogPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Terjadi kesalahan saat menghapus artikel');
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting document:', error);
        alert('Gagal menghapus dokumen: ' + error.message);
        return;
      }

      await fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Terjadi kesalahan saat menghapus dokumen');
    }
  };

  const handleAddBlogPost = () => {
    setEditingBlogPost(undefined);
    setShowBlogForm(true);
  };

  const handleEditBlogPost = (id: string) => {
    const post = blogPosts.find((p) => p.id === id);
    if (post) {
      setEditingBlogPost(post);
      setShowBlogForm(true);
    }
  };

  const handleSaveBlogPost = async (postData: Omit<BlogPost, "id"> & { id?: string }) => {
    try {
      // Generate slug from title
      const slug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      const published_at = postData.date 
        ? new Date(postData.date).toISOString() 
        : new Date().toISOString();

      if (postData.id) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: postData.title,
            excerpt: postData.excerpt,
            content: postData.content,
            author: postData.author,
            image_url: postData.image_url,
            published: true,
            published_at: published_at,
          })
          .eq('id', postData.id);

        if (error) {
          console.error('Error updating blog post:', error);
          alert('Gagal mengupdate artikel: ' + error.message);
          return;
        }
      } else {
        // Add new post
        const { error } = await supabase
          .from('blog_posts')
          .insert([{
            title: postData.title,
            slug: slug,
            excerpt: postData.excerpt,
            content: postData.content,
            author: postData.author,
            image_url: postData.image_url,
            published: true,
            published_at: published_at,
          }]);

        if (error) {
          console.error('Error adding blog post:', error);
          alert('Gagal menambahkan artikel: ' + error.message);
          return;
        }
      }

      await fetchBlogPosts();
      setShowBlogForm(false);
      setEditingBlogPost(undefined);
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Terjadi kesalahan saat menyimpan artikel');
    }
  };

  const handleAddDocument = () => {
    setEditingDocument(undefined);
    setShowDocumentForm(true);
  };

  const handleEditDocument = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (doc) {
      setEditingDocument(doc);
      setShowDocumentForm(true);
    }
  };

  const handleSaveDocument = async (docData: Omit<Document, "id"> & { id?: string }) => {
    try {
      if (docData.id) {
        // Update existing document
        const { error } = await supabase
          .from('documents')
          .update({
            title: docData.title,
            description: docData.description,
            file_url: docData.file_url,
            published: true,
          })
          .eq('id', docData.id);

        if (error) {
          console.error('Error updating document:', error);
          alert('Gagal mengupdate dokumen: ' + error.message);
          return;
        }
      } else {
        // Add new document
        const { error } = await supabase
          .from('documents')
          .insert([{
            title: docData.title,
            description: docData.description,
            file_url: docData.file_url,
            published: true,
          }]);

        if (error) {
          console.error('Error adding document:', error);
          alert('Gagal menambahkan dokumen: ' + error.message);
          return;
        }
      }

      await fetchDocuments();
      setShowDocumentForm(false);
      setEditingDocument(undefined);
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Terjadi kesalahan saat menyimpan dokumen');
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      <div className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">
              Sistem Manajemen Konten & Akses Website PPI AIU
            </p>
          </div>

          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white uppercase">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold flex items-center gap-1.5">
                    {currentUser.name}
                    {currentUser.role === "super_admin" ? (
                      <span className="bg-amber-400 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck size={12} /> Super Admin
                      </span>
                    ) : (
                      <span className="bg-blue-400 text-blue-950 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Shield size={12} /> Editor
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-primary-foreground/70">{currentUser.email}</div>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors border border-white/20 text-sm font-medium"
            >
              <LogOut size={18} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-border">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("members")}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "members"
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users size={20} />
                <span>Kepengurusan</span>
              </button>
              <button
                onClick={() => setActiveTab("blog")}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "blog"
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <BookOpen size={20} />
                <span>Artikel & Blog</span>
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "documents"
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText size={20} />
                <span>Dokumen</span>
              </button>
              {currentUser?.role === "super_admin" && (
                <button
                  onClick={() => setActiveTab("users")}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "users"
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ShieldCheck size={20} className="text-amber-500" />
                  <span>Kelola Admin</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "members" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Kelola Kepengurusan</h2>
                  <button
                    onClick={handleAddYear}
                    className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus size={20} />
                    <span>Tambah Tahun</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {yearsData.map((yearData) => (
                    <div
                      key={yearData.year}
                      className="bg-muted/30 border border-border rounded-lg overflow-hidden"
                    >
                      <div className="p-4 flex items-center justify-between bg-card">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => toggleYear(yearData.year)}
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            {selectedYear === yearData.year ? (
                              <ChevronDown size={20} />
                            ) : (
                              <ChevronRight size={20} />
                            )}
                          </button>
                          <div>
                            <h3 className="text-lg font-bold">Tahun {yearData.year}</h3>
                            <p className="text-sm text-muted-foreground">
                              {yearData.members.length} Anggota
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditYear(yearData.year, yearData.group_photo_url)}
                            className="p-2 hover:bg-muted rounded transition-colors"
                            title="Edit Foto Grup"
                          >
                            <Edit size={18} className="text-primary" />
                          </button>
                          <button
                            onClick={() => handleAddMember(yearData.year)}
                            className="flex items-center space-x-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded transition-colors"
                          >
                            <Plus size={16} />
                            <span>Tambah Anggota</span>
                          </button>
                        </div>
                      </div>

                      {selectedYear === yearData.year && (
                        <div className="p-4 border-t border-border bg-muted/10 space-y-6">
                          {yearData.group_photo_url && (
                            <div>
                              <h4 className="text-sm font-semibold mb-2">Foto Kepengurusan:</h4>
                              <div className="relative h-64 rounded-lg overflow-hidden border border-border">
                                <img
                                  src={yearData.group_photo_url}
                                  alt={`Foto Kepengurusan ${yearData.year}`}
                                  style={{
                                    objectPosition: getObjectPosition(yearData.group_photo_url, "center top"),
                                    transform: getScaleTransform(yearData.group_photo_url),
                                  }}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}

                          <div>
                            <h4 className="text-sm font-semibold mb-3">Daftar Anggota:</h4>
                            {yearData.members.length === 0 ? (
                              <p className="text-sm text-muted-foreground italic">
                                Belum ada anggota untuk tahun {yearData.year}
                              </p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {yearData.members.map((member) => (
                                  <div
                                    key={member.id}
                                    className="bg-card p-4 border border-border rounded-lg flex items-center space-x-3"
                                  >
                                    {member.photo_url ? (
                                      <img
                                        src={member.photo_url}
                                        alt={member.name}
                                        style={{
                                          objectPosition: getObjectPosition(member.photo_url, "center top"),
                                          transform: getScaleTransform(member.photo_url),
                                        }}
                                        className="w-12 h-12 rounded-full object-cover border border-border"
                                      />
                                    ) : (
                                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                                        {member.name.charAt(0)}
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-bold truncate">{member.name}</h5>
                                      <p className="text-xs text-primary font-medium">{member.position}</p>
                                      <p className="text-xs text-muted-foreground truncate">{member.division}</p>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <button
                                        onClick={() => handleEditMember(yearData.year, member)}
                                        className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-primary"
                                        title="Edit"
                                      >
                                        <Edit size={16} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteMember(yearData.year, member.id)}
                                        className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-destructive"
                                        title="Hapus"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {yearsData.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">
                        Belum ada data kepengurusan. Klik "Tambah Tahun" untuk memulai.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "blog" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Kelola Artikel & Blog</h2>
                  <button
                    onClick={handleAddBlogPost}
                    className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus size={20} />
                    <span>Tambah Artikel</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg gap-4"
                    >
                      <img
                        src={post.image_url}
                        alt={post.title}
                        style={{ objectPosition: getObjectPosition(post.image_url, "center") }}
                        className="w-24 h-24 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{post.excerpt}</p>
                        <div className="text-sm text-muted-foreground">
                          {post.author} • {new Date(post.date).toLocaleDateString("id-ID")}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditBlogPost(post.id)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} className="text-primary" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlogPost(post.id)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={18} className="text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Kelola Dokumen</h2>
                  <button
                    onClick={handleAddDocument}
                    className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus size={20} />
                    <span>Tambah Dokumen</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground">{doc.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditDocument(doc.id)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} className="text-primary" />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={18} className="text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "users" && currentUser?.role === "super_admin" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <ShieldCheck className="text-amber-500" />
                      Manajemen Akun Admin
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      Kelola daftar akun yang dapat mengakses Dashboard Admin dan batasi hak aksesnya.
                    </p>
                  </div>
                  <button
                    onClick={handleAddAdminUser}
                    className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold shadow-sm"
                  >
                    <UserPlus size={18} />
                    <span>Tambah Admin Baru</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminUsersList.map((user) => {
                    const isMainAdmin = user.email.toLowerCase() === "adm.ppi.aiu@gmail.com";
                    const isSelf = currentUser?.id === user.id;

                    return (
                      <div
                        key={user.id}
                        className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-lg border border-primary/20">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="font-bold text-base flex items-center gap-2">
                                  {user.name}
                                  {isSelf && (
                                    <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded font-normal">
                                      (Anda)
                                    </span>
                                  )}
                                </h3>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>

                            {user.role === "super_admin" ? (
                              <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border border-amber-300 dark:border-amber-800">
                                <ShieldCheck size={14} /> Super Admin
                              </span>
                            ) : (
                              <span className="bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border border-blue-300 dark:border-blue-800">
                                <Shield size={14} /> Editor
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg mb-4 flex items-center justify-between">
                            <span>Dibuat pada:</span>
                            <span className="font-medium text-foreground">
                              {new Date(user.created_at).toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border">
                          <button
                            onClick={() => handleEditAdminUser(user)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-muted transition-colors text-primary"
                          >
                            <Edit size={14} />
                            <span>Edit Role</span>
                          </button>

                          <button
                            onClick={() => handleDeleteAdminUser(user)}
                            disabled={isMainAdmin || isSelf}
                            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-border rounded-lg transition-colors ${
                              isMainAdmin || isSelf
                                ? "opacity-40 cursor-not-allowed text-muted-foreground"
                                : "hover:bg-destructive/10 text-destructive border-destructive/20"
                            }`}
                            title={
                              isMainAdmin
                                ? "Akun Utama Super Admin tidak bisa dihapus"
                                : isSelf
                                ? "Tidak bisa menghapus akun sendiri"
                                : "Hapus Akun Admin"
                            }
                          >
                            <Trash2 size={14} />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-muted/40 border border-border rounded-lg p-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Sistem Website PPI AIU — Menggunakan Supabase Database & Multi-Role Authentication.
          </p>
        </div>
      </div>

      {showBlogForm && (
        <BlogPostForm
          post={editingBlogPost}
          onClose={() => {
            setShowBlogForm(false);
            setEditingBlogPost(undefined);
          }}
          onSave={handleSaveBlogPost}
        />
      )}

      {showMemberForm && selectedYear && (
        <MemberForm
          member={editingMember}
          year={selectedYear}
          onClose={() => {
            setShowMemberForm(false);
            setEditingMember(undefined);
          }}
          onSave={handleSaveMember}
        />
      )}

      {showYearForm && (
        <YearForm
          year={editingYear?.year}
          groupPhotoUrl={editingYear?.group_photo_url}
          onClose={() => {
            setShowYearForm(false);
            setEditingYear(undefined);
          }}
          onSave={handleSaveYear}
        />
      )}

      {showDocumentForm && (
        <DocumentForm
          document={editingDocument}
          onClose={() => {
            setShowDocumentForm(false);
            setEditingDocument(undefined);
          }}
          onSave={handleSaveDocument}
        />
      )}

      {showAdminUserForm && (
        <AdminUserForm
          user={editingAdminUser}
          onClose={() => {
            setShowAdminUserForm(false);
            setEditingAdminUser(undefined);
          }}
          onSave={handleSaveAdminUser}
        />
      )}
    </div>
  );
}
