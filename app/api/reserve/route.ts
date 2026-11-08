import { NextResponse } from "next/server";
import { courses } from "@/data/courses";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseId, courseName, name, phone, people, date } = body;

    // 1. 유효성 검사
    if (!name || !String(name).trim() || !phone || !String(phone).trim()) {
      return NextResponse.json(
        { success: false, message: "이름과 연락처를 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    const numPeople = Math.max(1, parseInt(people, 10) || 1);

    // 2. 강좌 데이터 조회 (courseId 또는 courseName)
    const courseItem = courses.find(
      (c) =>
        c.id === courseId ||
        c.name === courseName ||
        c.name === body.course
    );

    if (!courseItem) {
      return NextResponse.json(
        { success: false, message: "해당 강좌를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 2-1. 남은 자리 검증 (인원이 남은 자리보다 많으면 거절)
    const remainingSeats = Math.max(0, courseItem.seat - courseItem.booked);
    if (numPeople > remainingSeats) {
      return NextResponse.json(
        {
          success: false,
          message: `신청 인원(${numPeople}명)이 남은 좌석(${remainingSeats}석)보다 많습니다.`,
        },
        { status: 400 }
      );
    }

    // 3. 결제 금액(total)은 파이썬 규칙과 동일하게 강좌별 가격 딕셔너리 × 인원으로 계산
    const prices: Record<string, number> = {
      "AI 자동화": 35000,
      "숏폼 편집": 45000,
      "엑셀 실무": 30000,
      "스마트스토어": 40000,
    };
    const finalCourseName = courseItem.name;
    const finalDate = date || courseItem.date;
    const total = (prices[finalCourseName] ?? courseItem.price) * numPeople;

    // 4. .env의 SHEET_URL 주소 확인 (브라우저에 노출되지 않고 서버에서만 사용)
    const sheetUrl = process.env.SHEET_URL;
    if (!sheetUrl) {
      console.error("SHEET_URL 환경변수가 설정되지 않았습니다.");
      return NextResponse.json(
        { success: false, message: "서버의 시트 연동 주소가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    // 5. 파이썬 keys 순서("date", "course", "name", "phone", "people", "total")에 맞춘 행 및 페이로드 구성
    const keys = ["date", "course", "name", "phone", "people", "total"] as const;
    const dataObj = {
      date: finalDate,
      course: finalCourseName,
      name: String(name).trim(),
      phone: String(phone).trim(),
      people: numPeople,
      total: total,
    };
    const row = keys.map((key) => dataObj[key]);

    const payload = {
      ...dataObj,
      row: row,
    };

    // 6. SHEET_URL로 JSON 전송
    try {
      const sheetResponse = await fetch(sheetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        redirect: "follow",
      });

      if (!sheetResponse.ok) {
        console.warn("구글 시트 응답 상태:", sheetResponse.status, sheetResponse.statusText);
      }
    } catch (sheetError) {
      console.error("구글 시트 전송 중 오류 발생:", sheetError);
      // 구글 시트 전송 오류가 나더라도 사용자에게 원인을 알리거나 로깅
    }

    return NextResponse.json({
      success: true,
      message: "예약 신청이 완료되었습니다.",
      data: payload,
    });
  } catch (error) {
    console.error("예약 처리 에러:", error);
    return NextResponse.json(
      { success: false, message: "예약 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

