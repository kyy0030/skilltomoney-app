"use client";

import { useState } from "react";
import { courses as initialCourses } from "@/data/courses";

interface Course {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  seat: number;
  booked: number;
  date: string;
  tags: string[];
  category?: string;
  summary?: string;
  highlights?: string[];
  icon?: string;
  duration?: string;
  isPopular?: boolean;
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>(initialCourses as Course[]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantCount, setApplicantCount] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOpenModal = (course: Course) => {
    if (course.seat - course.booked <= 0) {
      return;
    }
    setSelectedCourse(course);
    setApplicantName("");
    setApplicantPhone("");
    setApplicantCount(1);
    setIsSubmitting(false);
    setErrorMessage("");
    setIsSuccess(false);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setSelectedCourse(null);
    setErrorMessage("");
    setIsSuccess(false);
  };

  const handleReservationSubmit = async () => {
    if (!selectedCourse) return;

    // 1. 유효성 검사: 이름이 비어 있는 경우
    if (!applicantName.trim()) {
      setErrorMessage("이름을 입력해 주세요.");
      return;
    }

    // 2. 유효성 검사: 인원이 남은 자리보다 많은 경우
    const remainingSeats = Math.max(0, selectedCourse.seat - selectedCourse.booked);
    if (applicantCount > remainingSeats) {
      setErrorMessage(
        `신청 인원(${applicantCount}명)이 남은 자리(${remainingSeats}석)보다 많습니다.`
      );
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: selectedCourse.id,
          courseName: selectedCourse.name,
          date: selectedCourse.date,
          name: applicantName.trim(),
          phone: applicantPhone.trim(),
          people: applicantCount,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setErrorMessage(result.message || "예약 신청 처리 중 오류가 발생했습니다.");
        return;
      }

      // 화면 강좌 목록의 예약 인원 업데이트
      setCourses((prevCourses) =>
        prevCourses.map((c) =>
          c.id === selectedCourse.id
            ? { ...c, booked: Math.min(c.seat, c.booked + applicantCount) }
            : c
        )
      );

      // 성공 상태 표시
      setIsSuccess(true);
      alert("예약 신청이 완료되었습니다");
    } catch (error) {
      console.error("예약 요청 에러:", error);
      setErrorMessage("예약 신청 중 서버 통신 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedCourses = onlyAvailable
    ? courses.filter((course) => course.seat - course.booked > 0)
    : courses;

  return (
    <div className="relative min-h-screen bg-[#060b19] text-white selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Background Decorative Glow (Navy & Gold Ambience) */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-blue-700/20 via-indigo-900/15 to-transparent rounded-full blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-96 -left-32 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-[700px] -right-32 w-[550px] h-[550px] bg-yellow-600/10 rounded-full blur-[160px]"
        aria-hidden="true"
      />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#060b19]/85 border-b border-amber-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 flex items-center justify-center font-black text-lg sm:text-xl text-slate-950 shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div>
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                스킬투머니
              </span>
              <span className="hidden sm:inline-block ml-2.5 text-xs text-amber-200/70 border-l border-amber-500/30 pl-2.5">
                배운 기술이 돈이 되는 원데이 클래스
              </span>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              🔥 실시간 좌석 현황 반영 중
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-24 sm:pb-32">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-yellow-500/15 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold mb-5 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            단 하루 만에 완성하는 실전 스킬 4선
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 leading-tight">
            스킬투머니{" "}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
              강좌 목록
            </span>
          </h1>

          <p className="text-base sm:text-xl font-medium text-slate-300 leading-relaxed mb-6">
            배운 기술이 바로 돈이 되는 원데이 클래스.
            <br className="hidden sm:inline" />
            실시간 잔여 좌석을 확인하고 나만의 수익 파이프라인을 시작해보세요.
          </p>

          <div className="flex items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400">✓</span> 1Day 압축 완성
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400">✓</span> 실시간 정원 관리
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400">✓</span> 실전 템플릿 증정
            </div>
          </div>
        </div>

        {/* Filter Bar (강좌 목록 위: 예약 가능한 강좌만 보기) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 px-5 py-3.5 rounded-2xl bg-[#0b1328]/80 border border-amber-500/20 backdrop-blur-sm shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-white text-sm sm:text-base">
              강좌 목록
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {displayedCourses.length}개 강좌
            </span>
            {onlyAvailable && (
              <span className="text-[11px] font-bold text-emerald-400">
                (마감 강좌 제외)
              </span>
            )}
          </div>

          <label className="inline-flex items-center gap-2.5 cursor-pointer select-none group">
            <input
              type="checkbox"
              id="filterAvailableOnly"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="w-4 h-4 rounded text-amber-400 bg-slate-900 border-amber-500/40 focus:ring-amber-400 focus:ring-offset-slate-950 accent-amber-400 cursor-pointer"
            />
            <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
              예약 가능한 강좌만 보기
            </span>
          </label>
        </div>

        {/* Course Cards Grid (반응형 그리드) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {displayedCourses.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 bg-black/30 rounded-3xl border border-white/5">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="text-base font-semibold text-white mb-1">
                현재 예약 가능한 강좌가 없습니다.
              </p>
              <p className="text-xs text-slate-400">
                체크를 해제하면 전체 강좌 목록을 확인할 수 있습니다.
              </p>
            </div>
          ) : (
            displayedCourses.map((course) => {
              const remainingSeats = Math.max(0, course.seat - course.booked);
              const isFull = remainingSeats <= 0;
              const isUrgent = remainingSeats >= 1 && remainingSeats <= 2;
              const progressPercent = Math.min(
                100,
                Math.round((course.booked / course.seat) * 100)
              );

            return (
              <div
                key={course.id}
                className={`relative rounded-3xl flex flex-col justify-between transition-all duration-300 group ${
                  course.isPopular
                    ? "bg-gradient-to-b from-[#111c38] to-[#0a1226] border-2 border-amber-400/60 shadow-2xl shadow-amber-500/20 lg:-translate-y-2"
                    : isFull
                    ? "bg-gradient-to-b from-[#0b1224] to-[#060a17] border border-slate-800/80 shadow-lg shadow-black/40 opacity-90"
                    : "bg-gradient-to-b from-[#0e172e] to-[#080f22] border border-amber-500/20 hover:border-amber-400/50 shadow-xl shadow-black/40 hover:-translate-y-1"
                }`}
              >
                {/* Popular Badge */}
                {course.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-extrabold text-xs tracking-wider shadow-md uppercase">
                    ⭐ 가장 많이 찾는 클래스
                  </div>
                )}

                <div className="p-5 sm:p-6">
                  {/* Header (Badge & Icon) */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{course.icon || "📚"}</span>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800/80 text-amber-300/90 border border-amber-500/20">
                      📅 {course.date}
                    </span>
                  </div>

                  {/* Course Category */}
                  <div className="text-xs font-semibold text-slate-400 mb-1">
                    {course.category || "원데이 클래스"}
                  </div>

                  {/* Course Title */}
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2 group-hover:text-amber-300 transition-colors">
                    {course.name}
                  </h2>

                  {/* Tags: 강좌 이름 아래 작은 배지 */}
                  {course.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3.5">
                      {course.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-400/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 min-h-[40px]">
                    {course.summary || "실무에 즉시 적용하는 실전 원데이 클래스입니다."}
                  </p>

                  {/* Seat Status Card (남은 좌석 / 정원) */}
                  <div className="mb-5 p-3 rounded-2xl bg-black/40 border border-amber-500/20 shadow-inner">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="font-medium text-slate-300">
                        남은 좌석{" "}
                        <span
                          className={`font-black text-sm ${
                            isFull
                              ? "text-slate-400"
                              : isUrgent
                              ? "text-red-500 font-extrabold"
                              : "text-emerald-400"
                          }`}
                        >
                          {isFull ? "0석" : `${remainingSeats}석`}
                        </span>{" "}
                        <span className="text-slate-400">/ 정원 {course.seat}명</span>
                      </div>

                      {/* Status Tag */}
                      {isFull ? (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-slate-800 text-slate-300 border border-slate-600 shadow-sm">
                          마감
                        </span>
                      ) : isUrgent ? (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse">
                          마감 임박
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          신청 가능
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFull
                            ? "bg-slate-600"
                            : isUrgent
                            ? "bg-red-500"
                            : "bg-gradient-to-r from-amber-400 to-yellow-400"
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="mt-1.5 flex justify-between text-[11px] text-slate-400">
                      <span>예약 {course.booked}명</span>
                      <span>{progressPercent}% 완료</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  {course.highlights && course.highlights.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-amber-500/15 mb-4">
                      <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">
                        수강 혜택 & 핵심 내용
                      </p>
                      {course.highlights.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-1.5 text-xs text-slate-200"
                        >
                          <span className="text-amber-400 font-bold shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 bg-white/[0.03] px-3 py-2 rounded-lg border border-white/5">
                    <span>⏱</span>
                    <span>{course.duration || "1Day 집중 완성"}</span>
                  </div>
                </div>

                {/* Card Footer (Price & Button) */}
                <div className="p-5 sm:p-6 pt-0">
                  <div className="mb-4 pt-3 border-t border-amber-500/15 flex items-baseline justify-between">
                    <div className="text-xs text-slate-400">수강료</div>
                    <div className="text-right">
                      {course.originalPrice && (
                        <span className="text-xs text-slate-400 line-through mr-1.5">
                          {course.originalPrice.toLocaleString()}원
                        </span>
                      )}
                      <span className="text-xl sm:text-2xl font-black text-amber-300">
                        {course.price.toLocaleString()}
                      </span>
                      <span className="text-sm font-bold text-amber-200 ml-1">
                        원
                      </span>
                    </div>
                  </div>

                  {/* Reserve Button */}
                  <button
                    type="button"
                    onClick={() => !isFull && handleOpenModal(course)}
                    disabled={isFull}
                    aria-disabled={isFull}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-tight transition-all duration-200 flex items-center justify-center gap-1.5 shadow-lg ${
                      isFull
                        ? "bg-slate-800/80 text-slate-400 border border-slate-700/80 cursor-not-allowed shadow-none opacity-70 select-none"
                        : course.isPopular
                        ? "bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:from-amber-200 hover:to-yellow-400 text-slate-950 shadow-amber-500/30 hover:shadow-amber-500/50 cursor-pointer active:scale-98"
                        : "bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/50 hover:border-amber-400 shadow-amber-900/20 cursor-pointer active:scale-98"
                    }`}
                  >
                    {isFull ? (
                      <span>예약 마감</span>
                    ) : (
                      <>
                        <span>예약하기</span>
                        <span className="text-sm">→</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

        {/* Notice & Trust Section */}
        <div className="mt-16 sm:mt-24 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0c1630] via-[#101c3d] to-[#0c1630] border border-amber-500/25 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center text-xl shrink-0">
                💎
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base mb-1">
                  소수 정예 밀착 실습
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  실습 집중도를 위해 클래스당 정원을 엄격히 제한하여 진행합니다.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center text-xl shrink-0">
                📁
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base mb-1">
                  평생 소장 템플릿 제공
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  수업 종료 후에도 바로 써먹는 실전 양식과 가이드를 드립니다.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center text-xl shrink-0">
                🛡️
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base mb-1">
                  100% 만족 보장제
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  클래스 시작 전까지 100% 전액 환불을 보장합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reservation Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0d162e] border-2 border-amber-400/50 p-6 sm:p-8 shadow-2xl text-left">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
            >
              ✕
            </button>

            {isSuccess ? (
              <div className="py-6 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-300 text-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
                  ✓
                </div>
                <h4 className="text-xl font-bold text-white mb-2">
                  예약 신청이 완료되었습니다
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  <span className="text-amber-300 font-semibold">{applicantName}</span>님,{" "}
                  <span className="text-white font-semibold">{selectedCourse.name}</span> 강좌 ({applicantCount}명)
                  예약이 정상 접수되었습니다.
                  <br />
                  <span className="text-slate-400 text-xs">안내 문자가 곧 발송됩니다.</span>
                </p>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all cursor-pointer"
                >
                  확인
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{selectedCourse.icon || "📚"}</span>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    원데이 클래스 예약
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white mb-4">
                  예약 신청
                </h3>

                <form onSubmit={(e) => e.preventDefault()} className="space-y-3.5">
                  {/* 강좌 이름 (카드에서 자동 채움) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      강좌 이름
                    </label>
                    <input
                      type="text"
                      value={selectedCourse.name}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-amber-500/25 text-amber-200 font-bold text-sm select-none cursor-default focus:outline-none"
                    />
                  </div>

                  {/* 날짜 (카드에서 자동 채움) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      날짜
                    </label>
                    <input
                      type="text"
                      value={selectedCourse.date}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-slate-200 text-sm select-none cursor-default focus:outline-none"
                    />
                  </div>

                  {/* 이름 입력 칸 */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                      이름
                    </label>
                    <input
                      type="text"
                      placeholder="홍길동"
                      value={applicantName}
                      onChange={(e) => {
                        setApplicantName(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm placeholder-slate-500 transition-colors"
                    />
                  </div>

                  {/* 연락처 입력 칸 */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                      연락처
                    </label>
                    <input
                      type="tel"
                      placeholder="010-1234-5678"
                      value={applicantPhone}
                      onChange={(e) => {
                        setApplicantPhone(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm placeholder-slate-500 transition-colors"
                    />
                  </div>

                  {/* 인원(숫자) 입력 칸 */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-semibold text-slate-200">
                        인원 (숫자)
                      </label>
                      <span className="text-[11px] text-amber-300 font-medium">
                        (남은 자리: {Math.max(0, selectedCourse.seat - selectedCourse.booked)}석)
                      </span>
                    </div>
                    <input
                      type="number"
                      min={1}
                      placeholder="1"
                      value={applicantCount}
                      onChange={(e) => {
                        setApplicantCount(Math.max(1, parseInt(e.target.value) || 1));
                        if (errorMessage) setErrorMessage("");
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm placeholder-slate-500 transition-colors"
                    />
                  </div>

                  {/* 유효성 검사 안내 문구 */}
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                      <span>⚠️</span>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* [신청]과 [닫기] 버튼 */}
                  <div className="pt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={isSubmitting}
                      className="w-1/2 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white font-bold text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      닫기
                    </button>
                    <button
                      type="button"
                      onClick={handleReservationSubmit}
                      disabled={isSubmitting}
                      className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "저장 중..." : "신청"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-amber-500/15 py-10 px-4 sm:px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-amber-300 text-sm">스킬투머니</span>
            <span>|</span>
            <span>배운 기술이 돈이 되는 원데이 클래스</span>
          </div>
          <p>© 2026 SkillToMoney. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
