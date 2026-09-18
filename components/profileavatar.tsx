import { getProfileImageUri } from "@/lib/session";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Image, View } from "react-native";

interface Props {
  /** Square size in pixels. */
  size?: number;
  /** Extra classes for the wrapper. */
  className?: string;
  /** Placeholder icon when no picture is set. */
  icon?: string;
  /** Icon colour for the placeholder. */
  iconColor?: string;
  /** Background for the placeholder. */
  backgroundColor?: string;
}

/**
 * Shows the user's profile picture, falling back to an icon placeholder.
 *
 * The image comes from the local cache written at upload time: the backend
 * accepts the upload but exposes no endpoint that serves the image bytes, so a
 * remote URL is not available to render.
 */
export default function ProfileAvatar({
  size = 56,
  className = "",
  icon = "person",
  iconColor = "#2563eb",
  backgroundColor = "#ffffff",
}: Props) {
  const [uri, setUri] = useState<string | null>(null);

  // Re-read whenever the screen regains focus so a new upload shows up right
  // after returning from the account screen.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getProfileImageUri()
        .then((value) => {
          if (active) setUri(value);
        })
        .catch(() => {
          // A missing cache is not an error; the placeholder is shown.
        });
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <View
      className={`items-center justify-center overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size, backgroundColor }}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      ) : (
        <Ionicons
          // @ts-ignore Ionicons accepts the runtime icon name.
          name={icon}
          size={size * 0.55}
          color={iconColor}
        />
      )}
    </View>
  );
}
