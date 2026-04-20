"use client";

import { useState } from "react";
import { Card } from "@/components/dashboard/Card";
import { SectionLabel } from "@/components/dashboard/SectionLabel";
import { 
  addCourse, updateCourse, deleteCourse, 
  addExam, toggleExam, deleteExam, 
  addUniversityPoints 
} from "@/app/actions/university";
import { 
  Edit2, Trash2, Plus, Calendar, CheckSquare, 
  Square, GraduationCap, ArrowRight, Award 
} from "lucide-react";

// Tab sistemi
type TabKey = 'beykent' | 'aof';

export function UniversityClient({ beykentData, aofData }: { beykentData: any, aofData: any }) {
  const [activeTab, setActiveTab] = useState<TabKey>('beykent');
  const data = activeTab === 'beykent' ? beykentData : aofData;

  if (!data) return <div style={{ color: "var(--text-tertiary)" }}>Veri yüklenemedi...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingBottom: "40px" }}>
      
      {/* BAŞLIK */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "var(--text-tertiary)",
          fontWeight: 500
        }}>
          Sistem
        </div>
        <h1 style={{
          fontSize: "28px",
          fontWeight: 700,
          color: "var(--text-primary)",
          fontFamily: "'Inter Tight', sans-serif",
          letterSpacing: "-0.02em",
          lineHeight: 1.2
        }}>
          Üniversite
        </h1>
        <p style={{
          fontSize: "14px",
          color: "var(--text-tertiary)",
          marginTop: "2px"
        }}>
          Akademik takvim ve ders takibi
        </p>
      </div>

      {/* TABS */}
      <div style={{ 
        display: "flex", 
        gap: "4px",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "14px",
        padding: "4px",
        width: "fit-content"
      }}>
        {(['beykent', 'aof'] as TabKey[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 24px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: activeTab === tab ? 600 : 400,
              cursor: "pointer",
              border: "none",
              transition: "all 200ms ease",
              backgroundColor: activeTab === tab
                ? "var(--text-primary)"
                : "transparent",
              color: activeTab === tab
                ? "var(--bg-primary)"
                : "var(--text-tertiary)",
            }}
          >
            {tab === 'beykent' ? 'Beykent' : 'AÖF'}
          </button>
        ))}
      </div>

      {/* SAVAŞ ALANI DURUMU */}
      <BattlefieldStatus data={data} />

      {/* FİNAL GERİ SAYIMI */}
      <FinalCountdown exams={data?.exams || []} />

      {/* AKADEMİ TAKVİMİ */}
      <AcademicCalendar 
        exams={data?.exams || []} 
        universitySlug={activeTab} 
      />

      {/* DERS MATRİSİ */}
      <Card>
        <SectionLabel>Ders Matrisi</SectionLabel>
        <CourseMatrix 
          courses={data?.courses || []} 
          universityId={data?.university?.id}
          slug={activeTab}
        />
      </Card>

      {/* BİRLEŞİK TAKVİM */}
      <Card>
        <SectionLabel>Sınav Takvimi</SectionLabel>
        <ExamTimeline 
          exams={data?.exams || []}
          courses={data?.courses || []}
          universityId={data?.university?.id}
        />
      </Card>

      {/* ÜNİVERSİTE PUANI */}
      <UniversityScore totalPoints={data?.totalPoints || 0} />

    </div>
  );
}

// ━━ BattlefieldStatus ━━
function BattlefieldStatus({ data }: { data: any }) {
  const courses = data?.courses || [];
  const total = courses.length;
  const safe = courses.filter((c: any) => c.status === 'safe').length;
  const critical = courses.filter((c: any) => c.status === 'critical').length;
  const progress = total > 0 ? Math.round((safe / total) * 100) : 0;

  const statusLabel =
    critical > 0 ? 'Kritik' :
    total === 0   ? 'Veri Yok' :
    safe === total ? 'Güvende' : 'Takipte';

  const statusColor =
    critical > 0  ? '#EF4444' :
    safe === total ? '#10B981' : '#F59E0B';

  return (
    <div style={{
      backgroundColor: "var(--bg-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "20px",
      padding: "24px",
    }}>
      {/* Üst satır */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px"
      }}>
        <div style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "var(--text-tertiary)",
          fontWeight: 500
        }}>
          Savaş Alanı Durumu
        </div>
        <div style={{
          fontSize: "13px",
          fontWeight: 600,
          color: statusColor,
          backgroundColor: `${statusColor}15`,
          padding: "4px 12px",
          borderRadius: "8px",
          border: `1px solid ${statusColor}30`
        }}>
          {statusLabel}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        width: "100%",
        height: "6px",
        backgroundColor: "var(--bg-card-elevated)",
        borderRadius: "99px",
        overflow: "hidden",
        marginBottom: "12px"
      }}>
        <div style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: statusColor,
          borderRadius: "99px",
          transition: "width 600ms ease"
        }} />
      </div>

      {/* Alt bilgi */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "12px",
        color: "var(--text-tertiary)"
      }}>
        <span>İlerleme: %{progress}</span>
        <span>{safe}/{total} Ders Güvende</span>
      </div>
    </div>
  );
}

// ━━ FinalCountdown ━━
function FinalCountdown({ exams }: { exams: any[] }) {
  const upcoming = exams
    .filter((e: any) => !e.is_completed && new Date(e.exam_date) > new Date())
    .sort((a: any, b: any) => 
      new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
    );

  const next = upcoming[0];

  if (!next) {
    return (
      <div style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "20px",
        padding: "32px 24px",
        textAlign: "center"
      }}>
        <div style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "var(--text-tertiary)",
          fontWeight: 500,
          marginBottom: "12px"
        }}>
          Final Geri Sayımı
        </div>
        <div style={{ 
          fontSize: "14px", 
          color: "var(--text-tertiary)",
          fontStyle: "italic"
        }}>
          Henüz sınav eklenmedi
        </div>
      </div>
    );
  }

  const daysLeft = Math.ceil(
    (new Date(next.exam_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const countColor =
    daysLeft <= 7  ? '#EF4444' :
    daysLeft <= 14 ? '#F59E0B' : 'var(--text-primary)';

  return (
    <div style={{
      backgroundColor: "var(--bg-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "20px",
      padding: "32px 24px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px"
    }}>
      <div style={{
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        color: "var(--text-tertiary)",
        fontWeight: 500
      }}>
        Final Geri Sayımı
      </div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "72px",
        fontWeight: 700,
        lineHeight: 1,
        color: countColor,
        letterSpacing: "-0.02em",
        fontVariantNumeric: "tabular-nums"
      }}>
        {daysLeft}
      </div>
      <div style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>
        gün kaldı
      </div>
      <div style={{ 
        fontSize: "15px", 
        color: "var(--text-secondary)",
        fontStyle: "italic",
        marginTop: "4px"
      }}>
        {next.title}
      </div>
      <div style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>
        {new Date(next.exam_date).toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
      </div>
    </div>
  );
}

function AcademicCalendar({ exams, universitySlug }: { exams: any[], universitySlug: string }) {
  const today = new Date();
  
  // Gelecekteki sınavları al, tarihe göre sırala
  const upcoming = exams
    .filter((e: any) => new Date(e.exam_date) >= today)
    .sort((a: any, b: any) => 
      new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
    );

  // Dönem label'ları
  const periodLabels: Record<string, string> = {
    ara_sinav: 'Ara Sınav',
    final: 'Final',
    butunleme: 'Bütünleme',
    yaz_okulu: 'Yaz Okulu'
  };

  const periodColors: Record<string, string> = {
    ara_sinav: '#F59E0B',
    final: '#EF4444',
    butunleme: '#F97316',
    yaz_okulu: '#10B981'
  };

  if (upcoming.length === 0) return null;

  return (
    <div style={{
      backgroundColor: "var(--bg-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "20px",
      padding: "24px"
    }}>
      {/* Başlık */}
      <div style={{
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        color: "var(--text-tertiary)",
        fontWeight: 500,
        marginBottom: "16px"
      }}>
        Akademik Takvim
      </div>

      {/* Sınav satırları */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {upcoming.map((exam: any, idx: number) => {
          const examDate = new Date(exam.exam_date);
          const daysLeft = Math.ceil(
            (examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
          const period = exam.exam_period || 'exam';
          const color = periodColors[period] || '#A1A1AA';
          const isUrgent = daysLeft <= 14;

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                backgroundColor: "var(--bg-card-elevated)",
                borderRadius: "12px",
                border: isUrgent 
                  ? `1px solid ${color}30` 
                  : "1px solid var(--border-subtle)"
              }}
            >
              {/* Sol: Dönem badge + isim */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: color,
                  backgroundColor: `${color}15`,
                  padding: "4px 10px",
                  borderRadius: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  whiteSpace: "nowrap"
                }}>
                  {periodLabels[period] || period}
                </div>
                <div>
                  <div style={{ 
                    fontSize: "14px", 
                    color: "var(--text-primary)",
                    fontWeight: 500
                  }}>
                    {exam.title}
                  </div>
                  <div style={{ 
                    fontSize: "12px", 
                    color: "var(--text-tertiary)",
                    marginTop: "2px"
                  }}>
                    {examDate.toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              {/* Sağ: Geri sayım */}
              <div style={{ 
                textAlign: "right",
                flexShrink: 0
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: isUrgent ? color : "var(--text-primary)",
                  lineHeight: 1
                }}>
                  {daysLeft}
                </div>
                <div style={{
                  fontSize: "10px",
                  color: "var(--text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginTop: "2px"
                }}>
                  gün
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ━━ CourseMatrix ━━
function CourseMatrix({ courses, universityId, slug }: { courses: any[], universityId: string, slug: string }) {
  // Normal dersler ve E-Sertifika derslerini ayır
  const normalCourses = courses.filter((c: any) => c.subsection !== 'esertifika');
  const esertifikaCourses = courses.filter((c: any) => c.subsection === 'esertifika');

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Normal dersler */}
      <div>
        <CourseList 
          courses={normalCourses} 
          universityId={universityId}
        />
      </div>

      {/* E-Sertifika bölümü — sadece AÖF'te göster */}
      {slug === 'aof' && esertifikaCourses.length > 0 && (
        <div>
          <div style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "var(--text-tertiary)",
            fontWeight: 500,
            marginBottom: "12px",
            paddingTop: "8px",
            borderTop: "1px solid var(--border-subtle)"
          }}>
            E-Sertifika
          </div>
          <CourseList 
            courses={esertifikaCourses}
            universityId={universityId}
          />
        </div>
      )}

      <AddCourseForm universityId={universityId} />
    </div>
  );
}

function CourseList({ courses, universityId }: { courses: any[], universityId: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {courses.map((course: any) => (
        <div key={course.id} style={{ 
          display: "flex", alignItems: "center", gap: "12px",
          padding: "12px", backgroundColor: "rgba(255,255,255,0.02)",
          borderRadius: "8px", border: "1px solid var(--border-subtle)"
        }}>
          <div style={{ 
            width: "4px", height: "40px", borderRadius: "2px",
            backgroundColor: course.status === 'critical' ? '#EF4444' : course.status === 'safe' ? '#10B981' : '#F59E0B'
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "15px", fontWeight: 600 }}>{course.name}</div>
            <div style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>{course.instructor || 'Hoca belirtilmemiş'}</div>
            {course.midterm_score !== null && (
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                Vize: {course.midterm_score}/100
              </div>
            )}
            {course.notes && (
              <div style={{ fontSize: "11px", color: "var(--text-tertiary)", fontStyle: "italic", marginTop: "2px" }}>
                "{course.notes}"
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
             <div style={{
               fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px",
               backgroundColor: course.status === 'critical' ? 'rgba(239,68,68,0.1)' : course.status === 'safe' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
               color: course.status === 'critical' ? '#EF4444' : course.status === 'safe' ? '#10B981' : '#F59E0B',
               marginBottom: "8px", display: "inline-block"
             }}>
               {course.status === 'critical' ? 'KRİTİK' : course.status === 'safe' ? 'GÜVENLİ' : 'TAKİPTE'}
             </div>
             <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
               <button onClick={() => deleteCourse(course.id)} style={{ color: "var(--text-tertiary)", cursor: "pointer", border: "none", background: "none" }}>
                 <Trash2 size={14} />
               </button>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AddCourseForm({ universityId }: { universityId: string }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ 
    name: '', instructor: '', status: 'on_track', midterm_score: '', notes: '' 
  });

  const handleAddCourse = async () => {
    if (!newCourse.name) return;
    await addCourse({
      university_id: universityId,
      name: newCourse.name,
      instructor: newCourse.instructor || undefined,
      status: newCourse.status as any,
      midterm_score: newCourse.midterm_score ? parseInt(newCourse.midterm_score) : undefined,
      notes: newCourse.notes || undefined
    });
    setNewCourse({ name: '', instructor: '', status: 'on_track', midterm_score: '', notes: '' });
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <div style={{ 
        padding: "16px", backgroundColor: "rgba(255,255,255,0.03)", 
        borderRadius: "8px", border: "1px dashed var(--border-subtle)",
        display: "flex", flexDirection: "column", gap: "10px"
      }}>
        <input 
          placeholder="Ders Adı" 
          value={newCourse.name}
          onChange={e => setNewCourse({...newCourse, name: e.target.value})}
          style={{ padding: "8px", borderRadius: "6px", backgroundColor: "#000", border: "1px solid var(--border-subtle)", color: "#fff" }}
        />
        <input 
          placeholder="Hoca Adı" 
          value={newCourse.instructor}
          onChange={e => setNewCourse({...newCourse, instructor: e.target.value})}
          style={{ padding: "8px", borderRadius: "6px", backgroundColor: "#000", border: "1px solid var(--border-subtle)", color: "#fff" }}
        />
        <select 
          value={newCourse.status}
          onChange={e => setNewCourse({...newCourse, status: e.target.value})}
          style={{ padding: "8px", borderRadius: "6px", backgroundColor: "#000", border: "1px solid var(--border-subtle)", color: "#fff" }}
        >
          <option value="critical">Kritik</option>
          <option value="on_track">Takipte</option>
          <option value="safe">Güvende</option>
        </select>
        <input 
          type="number" placeholder="Vize Notu (0-100)" 
          value={newCourse.midterm_score}
          onChange={e => setNewCourse({...newCourse, midterm_score: e.target.value})}
          style={{ padding: "8px", borderRadius: "6px", backgroundColor: "#000", border: "1px solid var(--border-subtle)", color: "#fff" }}
        />
        <textarea 
          placeholder="Notlar" 
          value={newCourse.notes}
          onChange={e => setNewCourse({...newCourse, notes: e.target.value})}
          style={{ padding: "8px", borderRadius: "6px", backgroundColor: "#000", border: "1px solid var(--border-subtle)", color: "#fff", resize: "none" }}
        />
        <div style={{ display: "flex", gap: "8px" }}>
          <button 
            onClick={handleAddCourse}
            style={{ flex: 1, padding: "10px", borderRadius: "8px", backgroundColor: "var(--text-primary)", color: "var(--bg-primary)", fontWeight: 600, cursor: "pointer", border: "none" }}
          >
            Kaydet
          </button>
          <button 
            onClick={() => setShowAddForm(false)}
            style={{ padding: "10px 20px", borderRadius: "8px", backgroundColor: "transparent", color: "#fff", border: "1px solid var(--border-subtle)", cursor: "pointer" }}
          >
            İptal
          </button>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={() => setShowAddForm(true)}
      style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px dashed var(--border-subtle)", backgroundColor: "transparent", color: "var(--text-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer" }}
    >
      <Plus size={16} /> Ders Ekle
    </button>
  );
}

// ━━ ExamTimeline ━━
function ExamTimeline({ exams, courses, universityId }: { exams: any[], courses: any[], universityId: string }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExam, setNewExam] = useState({ title: '', exam_date: '', type: 'exam', course_id: '' });

  const sortedExams = [...exams].sort((a: any, b: any) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime());

  const handleAddExam = async () => {
    if (!newExam.title || !newExam.exam_date) return;
    await addExam({
      university_id: universityId,
      course_id: newExam.course_id || undefined,
      title: newExam.title,
      exam_date: newExam.exam_date,
      type: newExam.type as any
    });
    setNewExam({ title: '', exam_date: '', type: 'exam', course_id: '' });
    setShowAddForm(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {sortedExams.map((exam: any) => {
        const isPast = new Date(exam.exam_date) < new Date() && !exam.is_completed;
        return (
          <div key={exam.id} style={{ 
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 0", borderBottom: "1px solid var(--border-subtle)",
            opacity: exam.is_completed ? 0.5 : 1
          }}>
            <div style={{ 
              fontSize: "13px", color: isPast ? "#EF4444" : "var(--text-tertiary)", 
              fontFamily: "'JetBrains Mono', monospace", minWidth: "90px" 
            }}>
              {new Date(exam.exam_date).toLocaleDateString('tr-TR')}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: 500, textDecoration: exam.is_completed ? 'line-through' : 'none' }}>
                {exam.title}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                {exam.courses?.name || 'Genel'}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
               <div style={{ 
                 fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px",
                 backgroundColor: "rgba(255,255,255,0.05)", color: "var(--text-tertiary)"
               }}>
                 {exam.type === 'exam' ? 'SINAV' : exam.type === 'assignment' ? 'ÖDEV' : 'PROJE'}
               </div>
               <button 
                 onClick={() => toggleExam(exam.id, !exam.is_completed)}
                 style={{ color: exam.is_completed ? "#10B981" : "var(--text-tertiary)", cursor: "pointer", border: "none", background: "none" }}
               >
                 {exam.is_completed ? <CheckSquare size={18} /> : <Square size={18} />}
               </button>
               <button onClick={() => deleteExam(exam.id)} style={{ color: "rgba(239,68,68,0.5)", cursor: "pointer", border: "none", background: "none" }}>
                 <Trash2 size={14} />
               </button>
            </div>
          </div>
        );
      })}

      {showAddForm ? (
        <div style={{ 
          marginTop: "16px", padding: "16px", backgroundColor: "rgba(255,255,255,0.03)", 
          borderRadius: "8px", border: "1px dashed var(--border-subtle)",
          display: "flex", flexDirection: "column", gap: "10px"
        }}>
          <input 
            placeholder="Sınav/Teslim Başlığı" 
            value={newExam.title}
            onChange={e => setNewExam({...newExam, title: e.target.value})}
            style={{ padding: "8px", borderRadius: "6px", backgroundColor: "#000", border: "1px solid var(--border-subtle)", color: "#fff" }}
          />
          <input 
            type="date"
            value={newExam.exam_date}
            onChange={e => setNewExam({...newExam, exam_date: e.target.value})}
            style={{ padding: "8px", borderRadius: "6px", backgroundColor: "#000", border: "1px solid var(--border-subtle)", color: "#fff" }}
          />
          <select 
            value={newExam.type}
            onChange={e => setNewExam({...newExam, type: e.target.value})}
            style={{ padding: "8px", borderRadius: "6px", backgroundColor: "#000", border: "1px solid var(--border-subtle)", color: "#fff" }}
          >
            <option value="exam">Sınav</option>
            <option value="assignment">Ödev</option>
            <option value="project">Proje</option>
          </select>
          <select 
            value={newExam.course_id}
            onChange={e => setNewExam({...newExam, course_id: e.target.value})}
            style={{ padding: "8px", borderRadius: "6px", backgroundColor: "#000", border: "1px solid var(--border-subtle)", color: "#fff" }}
          >
            <option value="">Ders Seçin (Opsiyonel)</option>
            {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              onClick={handleAddExam}
              style={{ flex: 1, padding: "10px", borderRadius: "8px", backgroundColor: "var(--text-primary)", color: "var(--bg-primary)", fontWeight: 600, cursor: "pointer", border: "none" }}
            >
              Kaydet
            </button>
            <button 
              onClick={() => setShowAddForm(false)}
              style={{ padding: "10px 20px", borderRadius: "8px", backgroundColor: "transparent", color: "#fff", border: "1px solid var(--border-subtle)", cursor: "pointer" }}
            >
              İptal
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setShowAddForm(true)}
          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px dashed var(--border-subtle)", backgroundColor: "transparent", color: "var(--text-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer", marginTop: "10px" }}
        >
          <Plus size={16} /> Sınav/Teslim Ekle
        </button>
      )}
    </div>
  );
}

// ━━ UniversityScore ━━
function UniversityScore({ totalPoints }: { totalPoints: number }) {
  return (
    <div style={{
      backgroundColor: "var(--bg-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "20px",
      padding: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <div>
        <div style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "var(--text-tertiary)",
          fontWeight: 500,
          marginBottom: "8px"
        }}>
          Akademik Puan
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "48px",
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1,
          letterSpacing: "-0.02em"
        }}>
          {totalPoints}P
        </div>
        <div style={{
          fontSize: "12px",
          color: "var(--text-tertiary)",
          marginTop: "6px",
          fontStyle: "italic"
        }}>
          Çalışma ve teslimlerden kazanılır
        </div>
      </div>

      {/* Puan Ekle dropdown */}
      <PuanEkleButton />
    </div>
  );
}

function PuanEkleButton() {
  const [open, setOpen] = useState(false);
  const options = [
    { label: "Konu çalıştım", points: 10 },
    { label: "Özet okudum", points: 15 },
    { label: "Proje teslim ettim", points: 50 },
  ];

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: "10px 20px",
          borderRadius: "12px",
          fontSize: "13px",
          fontWeight: 500,
          cursor: "pointer",
          border: "1px solid var(--border-strong)",
          backgroundColor: "var(--bg-card-elevated)",
          color: "var(--text-primary)",
          transition: "all 200ms"
        }}
      >
        + Puan Ekle
      </button>
      {open && (
        <div style={{
          position: "absolute",
          right: 0,
          top: "calc(100% + 8px)",
          backgroundColor: "var(--bg-card-elevated)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "12px",
          overflow: "hidden",
          minWidth: "200px",
          zIndex: 10
        }}>
          {options.map((opt: any) => (
            <button
              key={opt.label}
              onClick={async () => {
                await addUniversityPoints(opt.label, opt.points);
                setOpen(false);
              }}
              style={{
                width: "100%",
                padding: "12px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "none",
                backgroundColor: "transparent",
                color: "var(--text-primary)",
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <span>{opt.label}</span>
              <span style={{ 
                color: "#10B981", 
                fontFamily: "monospace",
                fontSize: "12px" 
              }}>
                +{opt.points}P
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
