import { Link } from "react-router";
import { MobileLayout } from "@/shared/components/mobile-layout";

export function LandingPage() {
  return (
    <MobileLayout>
      <section className="flex flex-col gap-4 p-5">
        <h1 className="text-h2 text-k-900">모임 랜딩 페이지</h1>
        <p className="text-b5 text-k-600">
          도메인 라우팅 구조를 위한 기본 페이지입니다.
        </p>

        <Link
          className="rounded-md border border-k-200 px-4 py-3 text-center text-b4 text-k-800 transition-colors hover:bg-k-10 active:bg-k-50"
          to="/new"
        >
          모임 개설 페이지로 이동
        </Link>
      </section>
    </MobileLayout>
  );
}
