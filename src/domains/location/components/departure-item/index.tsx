import { ItemSavedplace } from "@/domains/location/components/item-savedplace";

export interface LocationVote {
  locationVoteId: number;
  participantName: string;
  departureLocation: string;
  departureAddress?: string | null;
  departureLat: number | string;
  departureLng: number | string;
}

export interface DepartureItemProps {
  item: LocationVote;
  onEdit: () => void;
  onDelete: () => void;
}

export function DepartureItem({ item, onEdit, onDelete }: DepartureItemProps) {
  // 둘째 줄은 고를 때 저장한 주소다. 좌표로 다시 찾으면 표기나 건물이 달라져 쓰지 않는다(#230).
  return (
    <ItemSavedplace
      name={item.participantName}
      location={item.departureLocation}
      address={item.departureAddress ?? ""}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
