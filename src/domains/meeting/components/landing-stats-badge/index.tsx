interface LandingStatsBadgeProps {
  todayCreatedMeetingCount?: number;
}

const numberFormatter = new Intl.NumberFormat("ko-KR");

export function LandingStatsBadge({
  todayCreatedMeetingCount,
}: LandingStatsBadgeProps) {
  if (!todayCreatedMeetingCount || todayCreatedMeetingCount <= 0) {
    return null;
  }

  return (
    <p className="mt-3 rounded-full bg-p-50 px-3 py-1 text-c2 text-primary-main">
      오늘 {numberFormatter.format(todayCreatedMeetingCount)}개의 모임이
      만들어졌어요
    </p>
  );
}
