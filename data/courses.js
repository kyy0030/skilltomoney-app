/**
 * 스킬투머니 강좌 데이터
 * 각 강좌는 id, name, price, seat, booked, date, tags를 가집니다.
 */
export const courses = [
  {
    id: "ai-auto",
    name: "AI 자동화",
    price: 35000,
    originalPrice: 70000,
    seat: 8,
    booked: 8,
    date: "2026-11-15",
    tags: ["초보 환영", "2시간"],
    category: "AI & 업무 자동화",
    summary: "ChatGPT와 노코드 툴을 연결해 반복 업무를 없애고 나만의 자동화 수익 모델을 구축합니다.",
    highlights: [
      "실무 즉시 적용 AI 프롬프트 50선",
      "Make & Zapier 노코드 파이프라인 실습",
      "나만의 AI 디지털 지식 상품 제작 가이드",
    ],
    duration: "1Day · 2시간 집중 완성",
    icon: "⚡",
  },
  {
    id: "shortform",
    name: "숏폼 편집",
    price: 45000,
    originalPrice: 90000,
    seat: 6,
    booked: 2,
    date: "2026-11-22",
    tags: ["캡컷", "3시간"],
    category: "영상 제작 & 크리에이터",
    summary: "알고리즘을 타는 1분 후킹 기획부터 캡컷(CapCut) 속성 실전 편집과 채널 런칭까지 마스터합니다.",
    highlights: [
      "조회수 폭발 후킹 템플릿 & 대본 양식",
      "모바일 & PC 캡컷 실전 컷편집·자막 노하우",
      "협찬 & 제휴 마케팅 수익화 로드맵",
    ],
    duration: "1Day · 3시간 집중 완성",
    icon: "🎬",
    isPopular: true,
  },
  {
    id: "excel-work",
    name: "엑셀 실무",
    price: 30000,
    originalPrice: 60000,
    seat: 10,
    booked: 7,
    date: "2026-11-29",
    tags: ["함수 실습"],
    category: "직무 스킬 & 생산성",
    summary: "야근을 줄여주는 핵심 함수와 자동화 피벗 대시보드로 업무 효율을 300% 극대화합니다.",
    highlights: [
      "실무 필수 XLOOKUP · INDEX-MATCH 마스터",
      "클릭 한 번으로 끝나는 자동화 대시보드",
      "현업 즉시 활용 실무 엑셀 템플릿 5종 증정",
    ],
    duration: "1Day · 3시간 집중 완성",
    icon: "📊",
  },
  {
    id: "smart-store",
    name: "스마트스토어",
    price: 40000,
    originalPrice: 80000,
    seat: 6,
    booked: 5,
    date: "2026-11-28",
    tags: ["상세페이지", "창업 준비"],
    category: "이커머스 & 창업",
    summary: "무자본 위탁판매부터 나만의 효자 상품 소싱, 키워드 상위노출 알고리즘까지 한 번에 끝냅니다.",
    highlights: [
      "월 300 부수입 소싱 키워드 발굴법",
      "클릭을 부르는 상세페이지 기획",
      "스마트스토어 첫 주문 자동화 세팅",
    ],
    duration: "1Day · 4시간 집중 완성",
    icon: "🛍️",
  },
];

export default courses;

// 브라우저 <script> 태그 로드 지원
if (typeof window !== "undefined") {
  window.courses = courses;
  window.COURSES = courses;
}
