import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { LogOut, Users, BookOpen, FileText, Plus, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { BlogPostForm } from "../components/BlogPostForm";
import { MemberForm } from "../components/MemberForm";
import { YearForm } from "../components/YearForm";
import { DocumentForm } from "../components/DocumentForm";
import { supabase } from "../../lib/supabase";

type Tab = "members" | "blog" | "documents";

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
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchAllData();
  }, [navigate]);

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
              group_photo_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
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
                  photo_url: m.photo_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
                }))
              );
            }
          }

          return {
            year: year.year,
            group_photo_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
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
          author: post.author || 'PPI AIU',
          date: post.published_at || post.created_at,
          image_url: post.image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
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
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
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
        // Update existing year - not implemented yet for group photo
        alert('Update foto group akan segera tersedia');
        setShowYearForm(false);
        setEditingYear(undefined);
        return;
      } else {
        // Add new year
        if (yearsData.some((y) => y.year === data.year)) {
          alert("Tahun ini sudah ada!");
          return;
        }

        const { error } = await supabase
          .from('years')
          .insert([{ year: data.year }]);

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
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', memberId);

      if (error) {
        console.error('Error deleting member:', error);
        alert('Gagal menghapus anggota: ' + error.message);
        return;
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

      if (postData.id) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: postData.title,
            excerpt: postData.excerpt,
            author: postData.author,
            image_url: postData.image_url,
            published: true,
            published_at: new Date().toISOString(),
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
            author: postData.author,
            image_url: postData.image_url,
            published: true,
            published_at: new Date().toISOString(),
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
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-border">
            <div className="flex">
              <button
                onClick={() => setActiveTab("members")}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === "members"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users size={20} />
                <span>Kepengurusan</span>
              </button>
              <button
                onClick={() => setActiveTab("blog")}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === "blog"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <BookOpen size={20} />
                <span>Artikel</span>
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === "documents"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText size={20} />
                <span>Dokumen</span>
              </button>
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
                      <div className="flex items-center justify-between p-4 bg-muted/50">
                        <button
                          onClick={() => toggleYear(yearData.year)}
                          className="flex items-center space-x-2 flex-1 text-left"
                        >
                          {selectedYear === yearData.year ? (
                            <ChevronDown className="w-5 h-5 text-primary" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-primary" />
                          )}
                          <h3 className="font-bold text-lg">Kepengurusan {yearData.year}</h3>
                          <span className="text-sm text-muted-foreground">
                            ({yearData.members.length} anggota)
                          </span>
                        </button>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditYear(yearData.year, yearData.group_photo_url)}
                            className="p-2 hover:bg-muted rounded transition-colors"
                            title="Edit Foto Grup"
                          >
                            <Edit size={18} className="text-primary" />
                          </button>
                          <button
                            onClick={() => handleDeleteYear(yearData.year)}
                            className="p-2 hover:bg-muted rounded transition-colors"
                            title="Hapus Tahun"
                          >
                            <Trash2 size={18} className="text-destructive" />
                          </button>
                        </div>
                      </div>

                      {selectedYear === yearData.year && (
                        <div className="p-4">
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">Foto Grup</h4>
                              <button
                                onClick={() => handleAddMember(yearData.year)}
                                className="flex items-center space-x-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                              >
                                <Plus size={16} />
                                <span>Tambah Anggota</span>
                              </button>
                            </div>
                            <img
                              src={yearData.group_photo_url}
                              alt={`Kepengurusan ${yearData.year}`}
                              className="w-full max-w-md h-48 object-cover rounded-lg border border-border"
                            />
                          </div>

                          <div className="mt-4">
                            <h4 className="font-semibold mb-3">Daftar Anggota</h4>
                            {yearData.members.length === 0 ? (
                              <p className="text-muted-foreground text-center py-8">
                                Belum ada anggota. Klik "Tambah Anggota" untuk menambahkan.
                              </p>
                            ) : (
                              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {yearData.members.map((member) => (
                                  <div
                                    key={member.id}
                                    className="bg-card border border-border rounded-lg overflow-hidden"
                                  >
                                    <img
                                      src={member.photo_url}
                                      alt={member.name}
                                      className="w-full h-32 object-cover"
                                    />
                                    <div className="p-3">
                                      <h5 className="font-semibold">{member.name}</h5>
                                      <p className="text-sm text-muted-foreground">
                                        {member.position}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {member.division}
                                      </p>
                                      <div className="flex items-center space-x-2 mt-2">
                                        <button
                                          onClick={() => handleEditMember(yearData.year, member)}
                                          className="flex-1 p-1.5 hover:bg-muted rounded transition-colors text-center"
                                          title="Edit"
                                        >
                                          <Edit size={16} className="text-primary mx-auto" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteMember(yearData.year, member.id)}
                                          className="flex-1 p-1.5 hover:bg-muted rounded transition-colors text-center"
                                          title="Hapus"
                                        >
                                          <Trash2 size={16} className="text-destructive mx-auto" />
                                        </button>
                                      </div>
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
                  <h2 className="text-2xl font-bold">Kelola Artikel</h2>
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
                      className="flex items-start space-x-4 p-4 border border-border rounded-lg"
                    >
                      <img
                        src={post.image_url}
                        alt={post.title}
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
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Catatan:</strong> Ini adalah versi demo. Pada implementasi penuh dengan Supabase, semua operasi CRUD akan tersimpan di database.
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
    </div>
  );
}
