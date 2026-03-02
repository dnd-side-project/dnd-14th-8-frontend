import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { MeetingJoinInvite } from "@/domains/meeting/components/meeting-join-invite";
import { useMeetingAccess } from "@/domains/meeting/hooks/use-meeting-access";

interface MeetingGuardProps {
  children: ReactNode;
}

function getInviteAcceptedStorageKey(meetingId?: string) {
  return meetingId ? `moyeorak.invite.accepted.${meetingId}` : null;
}

export function MeetingGuard({ children }: MeetingGuardProps) {
  const { meetingId } = useParams<{ meetingId: string }>();
  const { isMember, hostName, isLoading } = useMeetingAccess(meetingId);

  const inviteAcceptedStorageKey = useMemo(
    () => getInviteAcceptedStorageKey(meetingId),
    [meetingId],
  );

  const [showInvite, setShowInvite] = useState(false);
  const [hasResolvedGuard, setHasResolvedGuard] = useState(() => {
    if (!inviteAcceptedStorageKey) return false;
    return localStorage.getItem(inviteAcceptedStorageKey) === "1";
  });
  const [hasAcceptedInvite, setHasAcceptedInvite] = useState(() => {
    if (!inviteAcceptedStorageKey) return false;
    return localStorage.getItem(inviteAcceptedStorageKey) === "1";
  });

  useEffect(() => {
    if (!inviteAcceptedStorageKey) {
      setHasAcceptedInvite(false);
      setHasResolvedGuard(false);
      return;
    }

    const accepted = localStorage.getItem(inviteAcceptedStorageKey) === "1";
    setHasAcceptedInvite(accepted);

    if (accepted) {
      setHasResolvedGuard(true);
    }
  }, [inviteAcceptedStorageKey]);

  useEffect(() => {
    if (!isLoading) {
      setHasResolvedGuard(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;

    if (isMember) {
      setShowInvite(false);
      return;
    }

    setShowInvite(!hasAcceptedInvite);
  }, [hasAcceptedInvite, isLoading, isMember]);

  const handleJoinClick = () => {
    if (inviteAcceptedStorageKey) {
      localStorage.setItem(inviteAcceptedStorageKey, "1");
    }

    setHasAcceptedInvite(true);
    setHasResolvedGuard(true);
    setShowInvite(false);
  };

  if (!hasResolvedGuard) return null;

  if (showInvite) {
    return <MeetingJoinInvite hostName={hostName} onJoin={handleJoinClick} />;
  }

  return <>{children}</>;
}
