import { useEffect } from "react";
import { ItemSavedplace } from "@/domains/location/components/item-savedplace";
import { useReverseGeocode } from "@/domains/location/hooks/use-reverse-geocode";

export interface LocationVote {
  locationVoteId: number;
  participantName: string;
  departureLocation: string;
  departureLat: number | string;
  departureLng: number | string;
}

export interface DepartureItemProps {
  item: LocationVote;
  onEdit: () => void;
  onDelete: () => void;
}

export function DepartureItem({ item, onEdit, onDelete }: DepartureItemProps) {
  const { address, getAddressFromCoords } = useReverseGeocode();

  useEffect(() => {
    if (item.departureLat && item.departureLng) {
      getAddressFromCoords(
        Number(item.departureLat),
        Number(item.departureLng),
      );
    }
  }, [item.departureLat, item.departureLng, getAddressFromCoords]);

  return (
    <ItemSavedplace
      name={item.participantName}
      location={item.departureLocation}
      address={address}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
