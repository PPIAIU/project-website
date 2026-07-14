import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Users } from "lucide-react";
import { useData, CachedYearData } from "../contexts/DataContext";

interface Division {
  id: string;
  name: string;
  members: { id: string; name: string; position: string; photo_url: string }[];
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="p-6">
        <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
      </div>
    </div>
  );
}

const getObjectPosition = (url: string | null) => {
  if (!url) return "center top";
  try {
    const urlObj = new URL(url);
    const pos = urlObj.searchParams.get("pos");
    return pos ? `center ${pos}%` : "center top";
  } catch (e) {
    const match = url.match(/[?&]pos=(\d+)/);
    return match ? `center ${match[1]}%` : "center top";
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

export function Members() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [showMembersDetail, setShowMembersDetail] = useState<string | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const { yearsData, membersLoaded, fetchMembers } = useData();

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const toggleYear = (year: string) => {
    if (selectedYear === year) {
      setSelectedYear(null);
      setShowMembersDetail(null);
      setSelectedDivision(null);
    } else {
      setSelectedYear(year);
      setShowMembersDetail(null);
      setSelectedDivision(null);
    }
  };

  const handleGroupPhotoClick = (year: string) => {
    setShowMembersDetail(year);
  };

  const toggleDivision = (divisionId: string) => {
    setSelectedDivision(selectedDivision === divisionId ? null : divisionId);
  };

  return (
    <div className="min-h-screen bg-secondary">
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">Direktori Kepengurusan</h1>
          <p className="text-center mt-4 opacity-90">
            Arsip kepengurusan PPI AIU berdasarkan tahun angkatan
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-4">
          {!membersLoaded
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : yearsData.map((yearData) => (
                <div
                  key={yearData.year}
                  className="bg-card border border-border rounded-lg overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggleYear(yearData.year)}
                    className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
                  >
                    <h2 className="text-2xl font-bold">Kepengurusan {yearData.year}</h2>
                    {selectedYear === yearData.year ? (
                      <ChevronDown className="w-6 h-6 text-primary" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-primary" />
                    )}
                  </button>

                  {selectedYear === yearData.year && (
                    <div className="border-t border-border">
                      <div className="p-8">
                        <div className="max-w-4xl mx-auto">
                          <button
                            onClick={() => handleGroupPhotoClick(yearData.year)}
                            className="w-full group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                          >
                            {yearData.group_photo_url ? (
                              <img
                                src={yearData.group_photo_url}
                                alt={`Kepengurusan ${yearData.year}`}
                                className="w-full h-auto object-cover"
                              />
                            ) : (
                              <div className="w-full h-64 bg-muted flex items-center justify-center">
                                <Users className="w-16 h-16 text-muted-foreground" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                                <Users className="w-16 h-16 mx-auto mb-3" />
                                <p className="text-xl font-bold">Klik untuk lihat anggota</p>
                              </div>
                            </div>
                          </button>
                          <p className="text-center mt-4 text-lg font-semibold">
                            Kepengurusan {yearData.year}
                          </p>
                        </div>
                      </div>

                      {showMembersDetail === yearData.year && (
                        <div>
                          <div className="p-4 bg-muted/30 border-b border-border">
                            <button
                              onClick={() => setShowMembersDetail(null)}
                              className="text-primary hover:underline flex items-center space-x-1"
                            >
                              <ChevronRight className="w-4 h-4 rotate-180" />
                              <span>Kembali ke foto bersama</span>
                            </button>
                          </div>
                          {yearData.divisions.filter(division => division.members.length > 0).map((division) => (
                            <div
                              key={division.id}
                              className="border-b border-border last:border-b-0"
                            >
                              <button
                                onClick={() => toggleDivision(division.id)}
                                className="w-full flex items-center justify-between p-4 pl-8 hover:bg-muted/30 transition-colors"
                              >
                                <h3 className="font-semibold text-lg">{division.name}</h3>
                                {selectedDivision === division.id ? (
                                  <ChevronDown className="w-5 h-5 text-primary" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-primary" />
                                )}
                              </button>

                              {selectedDivision === division.id && (
                                <div className="p-6 pl-8 bg-muted/20">
                                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {division.members.map((member) => (
                                      <div
                                        key={member.id}
                                        className="bg-card rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
                                      >
                                        <div className="w-full h-80 bg-muted/20 flex items-center justify-center overflow-hidden">
                                          {member.photo_url ? (
                                            <img
                                              src={member.photo_url}
                                              alt={member.name}
                                              style={{ 
                                                objectPosition: getObjectPosition(member.photo_url),
                                                transform: `${getScaleTransform(member.photo_url)} translateZ(0)`,
                                                transformOrigin: 'center'
                                              }}
                                              className="w-full h-full object-cover will-change-transform"
                                              loading="lazy"
                                            />
                                          ) : (
                                            <Users className="w-12 h-12 text-muted-foreground" />
                                          )}
                                        </div>
                                        <div className="p-4">
                                          <h4 className="font-semibold">{member.name}</h4>
                                          <p className="text-sm text-muted-foreground">
                                            {member.position}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}