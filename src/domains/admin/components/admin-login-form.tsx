import { type FormEvent, useState } from "react";

interface AdminLoginFormProps {
  onSubmit: (token: string) => void;
  error?: string | null;
}

export function AdminLoginForm({ onSubmit, error }: AdminLoginFormProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onSubmit(trimmed);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <h1 className="font-semibold text-lg text-neutral-900">
          관리자 대시보드
        </h1>
        <p className="mt-1 text-neutral-500 text-sm">
          외부 API 호출 통계를 보려면 관리자 토큰을 입력하세요.
        </p>

        <label className="mt-6 block font-medium text-neutral-700 text-sm">
          관리자 토큰
          <input
            type="password"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoComplete="off"
            className="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
            placeholder="X-Admin-Token"
          />
        </label>

        {error ? (
          <p className="mt-2 text-red-600 text-sm" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!value.trim()}
          className="mt-6 w-full rounded-lg bg-neutral-900 py-2.5 font-medium text-sm text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          입장
        </button>
      </form>
    </div>
  );
}
