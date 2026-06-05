import { FileText, Download, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useData } from "../contexts/DataContext";

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="bg-muted w-14 h-14 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-5 bg-muted rounded w-1/3 mb-3"></div>
          <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}

export function Foundation() {
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const { documents, documentsLoaded, fetchDocuments } = useData();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const toggleExpand = (docId: string) => {
    setExpandedDoc(expandedDoc === docId ? null : docId);
  };

  const handleDownload = (fileUrl: string, title: string) => {
    if (fileUrl && fileUrl !== "#") {
      window.open(fileUrl, "_blank");
    } else {
      alert(`Mengunduh: ${title}\nCatatan: File belum tersedia.`);
    }
  };

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
        {documentsLoaded && documents.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-muted-foreground">Belum ada dokumen yang tersedia.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {!documentsLoaded
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : documents.map((doc) => (
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
                            onClick={() => handleDownload(doc.file_url, doc.title)}
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
                        <div
                          className="bg-muted/30 rounded-lg overflow-hidden"
                          style={{ height: "600px" }}
                        >
                          {doc.file_url &&
                          doc.file_url.toLowerCase().endsWith(".pdf") ? (
                            <iframe
                              src={doc.file_url}
                              className="w-full h-full border-0"
                              title={`Preview: ${doc.title}`}
                            />
                          ) : doc.file_url &&
                            (doc.file_url.toLowerCase().endsWith(".jpg") ||
                              doc.file_url.toLowerCase().endsWith(".jpeg") ||
                              doc.file_url.toLowerCase().endsWith(".png") ||
                              doc.file_url.toLowerCase().endsWith(".gif") ||
                              doc.file_url.toLowerCase().endsWith(".webp")) ? (
                            <div className="flex items-center justify-center h-full p-4">
                              <img
                                src={doc.file_url}
                                alt={doc.title}
                                className="max-w-full max-h-full object-contain rounded"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                              <p>
                                Preview tidak tersedia untuk tipe file ini. Klik
                                "Unduh Dokumen" untuk melihat.
                              </p>
                            </div>
                          )}
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
            <li>Dokumen-dokumen ini merupakan pedoman resmi organisasi PPI AIU</li>
            <li>
              Setiap anggota diharapkan memahami dan mematuhi ketentuan yang
              tertera
            </li>
            <li>
              Untuk pertanyaan lebih lanjut, silakan hubungi pengurus melalui
              email resmi
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}