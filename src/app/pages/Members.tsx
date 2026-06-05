import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Users } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Member {
  id: string;
  name: string;
  position: string;
  photo_url: string;
}

interface Division {
  id: string;
  name: string;
  members: Member[];
}

interface YearData {
  year: string;
  group_photo_url: string;
  divisions: Division[];
}

export function Members() {
  const [selectedYear, setSelectedYear] = useState<
    string | null
  >(null);
  const [showMembersDetail, setShowMembersDetail] = useState<
    string | null
  >(null);
  const [selectedDivision, setSelectedDivision] = useState<
    string | null
  >(null);
  const [yearsData, setYearsData] = useState<YearData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembersData();
  }, []);

  const fetchMembersData = async () => {
    try {
      // Fetch all years
      const { data: years, error: yearsError } = await supabase
        .from("years")
        .select("*")
        .order("year", { ascending: false });

      if (yearsError) {
        console.error("Error fetching years:", yearsError);
        setLoading(false);
        return;
      }

      // For each year, fetch divisions and members
      const yearsWithData: YearData[] = await Promise.all(
        (years || []).map(async (year) => {
          // Fetch divisions for this year
          const { data: divisions, error: divisionsError } =
            await supabase
              .from("divisions")
              .select("*")
              .eq("year_id", year.id)
              .order("name");

          if (divisionsError) {
            console.error(
              "Error fetching divisions:",
              divisionsError,
            );
          return {
            year: year.year,
            group_photo_url:
              (year as any).group_photo_url || "",
            divisions: [],
          };
          }

          // For each division, fetch members
          const divisionsWithMembers: Division[] =
            await Promise.all(
              (divisions || []).map(async (division) => {
                const { data: members, error: membersError } =
                  await supabase
                    .from("members")
                    .select("*")
                    .eq("division_id", division.id)
                    .order("sort_order");

                if (membersError) {
                  console.error(
                    "Error fetching members:",
                    membersError,
                  );
                  return {
                    id: division.id,
                    name: division.name,
                    members: [],
                  };
                }

                return {
                  id: division.id,
                  name: division.name,
                  members: (members || []).map((m) => ({
                    id: m.id,
                    name: m.name,
                    position: m.position,
                    photo_url:
                      m.photo_url ||
                      "",
                  })),
                };
              }),
            );

          return {
            year: year.year,
            group_photo_url:
              (year as any).group_photo_url || "",
            divisions: divisionsWithMembers,
          };
        }),
      );

      setYearsData(yearsWithData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching members data:", error);
      setLoading(false);
    }
  };

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
    setSelectedDivision(
      selectedDivision === divisionId ? null : divisionId,
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg">Memuat data kepengurusan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">
            Direktori Kepengurusan
          </h1>
          <p className="text-center mt-4 opacity-90">
            Arsip kepengurusan PPI AIU berdasarkan tahun
            angkatan
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-4">
          {yearsData.map((yearData) => (
            <div
              key={yearData.year}
              className="bg-card border border-border rounded-lg overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleYear(yearData.year)}
                className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
              >
                <h2 className="text-2xl font-bold">
                  Kepengurusan {yearData.year}
                </h2>
                {selectedYear === yearData.year ? (
                  <ChevronDown className="w-6 h-6 text-primary" />
                ) : (
                  <ChevronRight className="w-6 h-6 text-primary" />
                )}
              </button>

              {selectedYear === yearData.year && (
                <div className="border-t border-border">
                  {/* Always show group photo when year is selected */}
                  <div className="p-8">
                    <div className="max-w-4xl mx-auto">
                      <button
                        onClick={() => handleGroupPhotoClick(yearData.year)}
                        className="w-full group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                      >
                        <img
                          src={yearData.group_photo_url}
                          alt={`Kepengurusan ${yearData.year}`}
                          className="w-full h-auto object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                            <Users className="w-16 h-16 mx-auto mb-3" />
                            <p className="text-xl font-bold">
                              Klik untuk lihat anggota
                            </p>
                          </div>
                        </div>
                      </button>
                      <p className="text-center mt-4 text-lg font-semibold">
                        Kepengurusan {yearData.year}
                      </p>
                    </div>
                  </div>

                  {/* Show members detail only when photo is clicked */}
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
                      {yearData.divisions.map((division) => (
                        <div
                          key={division.id}
                          className="border-b border-border last:border-b-0"
                        >
                          <button
                            onClick={() =>
                              toggleDivision(division.id)
                            }
                            className="w-full flex items-center justify-between p-4 pl-8 hover:bg-muted/30 transition-colors"
                          >
                            <h3 className="font-semibold text-lg">
                              {division.name}
                            </h3>
                            {selectedDivision ===
                            division.id ? (
                              <ChevronDown className="w-5 h-5 text-primary" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-primary" />
                            )}
                          </button>

                          {selectedDivision === division.id && (
                            <div className="p-6 pl-8 bg-muted/20">
                              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {division.members.map(
                                  (member) => (
                                    <div
                                      key={member.id}
                                      className="bg-card rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
                                    >
                                      <div className="w-full h-80 bg-muted/20 flex items-center justify-center overflow-hidden">
                                        <img
                                          src={member.photo_url}
                                          alt={member.name}
                                          className="w-full h-full object-cover object-top"
                                          loading="lazy"
                                        />
                                      </div>
                                      <div className="p-4">
                                        <h4 className="font-semibold">
                                          {member.name}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          {member.position}
                                        </p>
                                      </div>
                                    </div>
                                  ),
                                )}
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