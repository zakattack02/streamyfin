import { useRouter, useSegments } from "expo-router";
import type React from "react";
import { type PropsWithChildren, useCallback, useMemo } from "react";
import {
  Platform,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";

const ContextMenu = !Platform.isTV ? require("zeego/context-menu") : null;

import { useJellyseerr } from "@/hooks/useJellyseerr";
import { MediaType } from "@/utils/jellyseerr/server/constants/media";
import {
  hasPermission,
  Permission,
} from "@/utils/jellyseerr/server/lib/permissions";
import type { MovieDetails } from "@/utils/jellyseerr/server/models/Movie";
import { PersonCreditCast } from "@/utils/jellyseerr/server/models/Person";
import type {
  MovieResult,
  TvResult,
} from "@/utils/jellyseerr/server/models/Search";
import type { TvDetails } from "@/utils/jellyseerr/server/models/Tv";

interface Props extends TouchableOpacityProps {
  result?: MovieResult | TvResult | MovieDetails | TvDetails | PersonCreditCast;
  mediaTitle: string;
  releaseYear: number;
  canRequest: boolean;
  posterSrc: string;
  mediaType: MediaType;
}

export const TouchableJellyseerrRouter: React.FC<PropsWithChildren<Props>> = ({
  result,
  mediaTitle,
  releaseYear,
  canRequest,
  posterSrc,
  mediaType,
  children,
  ...props
}) => {
  const router = useRouter();
  const segments = useSegments();
  const { jellyseerrApi, jellyseerrUser, requestMedia } = useJellyseerr();

  const from = segments[2] || "(home)";

  const autoApprove = useMemo(() => {
    return (
      jellyseerrUser &&
      hasPermission(Permission.AUTO_APPROVE, jellyseerrUser.permissions, {
        type: "or",
      })
    );
  }, [jellyseerrApi, jellyseerrUser]);

  const request = useCallback(() => {
    if (!result) return;
    requestMedia(mediaTitle, {
      mediaId: result.id,
      mediaType,
    });
  }, [jellyseerrApi, result, requestMedia, mediaTitle, mediaType]);

  const navigateToJellyseerr = useCallback(() => {
    if (!result) return;

    router.push({
      // @ts-expect-error - Dynamic pathname for jellyseerr routing
      pathname: `/(auth)/(tabs)/${from}/jellyseerr/page`,
      // @ts-expect-error - Complex object parameters
      params: {
        ...result,
        mediaTitle,
        releaseYear,
        canRequest: canRequest.toString(),
        posterSrc,
        mediaType,
      },
    });
  }, [
    router,
    from,
    result,
    mediaTitle,
    releaseYear,
    canRequest,
    posterSrc,
    mediaType,
  ]);

  // For TV, use simple TouchableOpacity without context menu
  if (Platform.isTV) {
    return (
      <TouchableOpacity onPress={navigateToJellyseerr} {...props}>
        {children}
      </TouchableOpacity>
    );
  }

  if (from === "(home)" || from === "(search)" || from === "(libraries)")
    return (
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <TouchableOpacity onPress={navigateToJellyseerr} {...props}>
            {children}
          </TouchableOpacity>
        </ContextMenu.Trigger>
        <ContextMenu.Content
          avoidCollisions
          alignOffset={0}
          collisionPadding={0}
          loop={false}
          key={"content"}
        >
          <ContextMenu.Label key='label-1'>Actions</ContextMenu.Label>
          {canRequest && mediaType === MediaType.MOVIE && (
            <ContextMenu.Item
              key='item-1'
              onSelect={() => {
                if (autoApprove) {
                  request();
                }
              }}
              shouldDismissMenuOnSelect
            >
              <ContextMenu.ItemTitle key='item-1-title'>
                Request
              </ContextMenu.ItemTitle>
              <ContextMenu.ItemIcon
                ios={{
                  name: "arrow.down.to.line",
                  pointSize: 18,
                  weight: "semibold",
                  scale: "medium",
                  hierarchicalColor: {
                    dark: "purple",
                    light: "purple",
                  },
                }}
                androidIconName='download'
              />
            </ContextMenu.Item>
          )}
        </ContextMenu.Content>
      </ContextMenu.Root>
    );

  // Fallback for other routes
  return (
    <TouchableOpacity onPress={navigateToJellyseerr} {...props}>
      {children}
    </TouchableOpacity>
  );
};
