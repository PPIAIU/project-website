import { FileText, Download, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

interface Document {
  id: string;
  title: string;
  description: string;
  content: string;
  file_url: string;
  file_size: string;
  last_updated: string;
}

export function Foundation() {
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        setLoading(false);
        return;
      }

      const formattedDocs: Document[] = (data || []).map((doc) => ({
        id: doc.id,
        title: doc.title,
        description: doc.description || '',
        content: '', // Content will be loaded on expand if needed
        file_url: doc.file_url,
        file_size: doc.file_size || 'N/A',
        last_updated: doc.updated_at,
      }));

      setDocuments(formattedDocs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setLoading(false);
    }
  };

  const toggleExpand = (docId: string) => {
    setExpandedDoc(expandedDoc === docId ? null : docId);
  };

  const handleDownload = (doc: Document) => {
    if (doc.file_url && doc.file_url !== '#') {
      window.open(doc.file_url, '_blank');
    } else {
      alert(`Mengunduh: ${doc.title}\nCatatan: File belum tersedia.`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg">Memuat dokumen...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">Dokumen Organisasi</h1>
          <p className="text-center mt-4 opacity-90">
            Akses dokumen fundamental PPI AIU
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {documents.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-muted-foreground">Belum ada dokumen yang tersedia.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-card border border-border rounded-lg p-6 shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">{doc.title}</h2>
                  <p className="text-muted-foreground mb-4">{doc.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span>Ukuran: {doc.file_size}</span>
                    <span>•</span>
                    <span>
                      Terakhir diperbarui:{" "}
                      {new Date(doc.last_updated).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Download size={18} />
                      <span>Unduh Dokumen</span>
                    </button>
                    <button
                      onClick={() => toggleExpand(doc.id)}
                      className="inline-flex items-center space-x-2 border-2 border-primary text-primary px-6 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      {expandedDoc === doc.id ? (
                        <>
                          <ChevronUp size={18} />
                          <span>Sembunyikan Preview</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown size={18} />
                          <span>Lihat Preview</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {expandedDoc === doc.id && (
                <div className="mt-6 border-t border-border pt-6">
                  <h3 className="font-bold text-lg mb-3">Preview Dokumen</h3>
                  <div className="bg-muted/30 rounded-lg p-6 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {doc.content}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        )}

        <div className="max-w-4xl mx-auto mt-12 bg-muted/50 border border-border rounded-lg p-6">
          <h3 className="font-bold mb-2">Catatan Penting:</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              Dokumen-dokumen ini merupakan pedoman resmi organisasi PPI AIU
            </li>
            <li>
              Setiap anggota diharapkan memahami dan mematuhi ketentuan yang tertera
            </li>
            <li>
              Untuk pertanyaan lebih lanjut, silakan hubungi pengurus melalui email
              resmi
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
