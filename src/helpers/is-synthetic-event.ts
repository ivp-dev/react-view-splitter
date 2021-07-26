import React from "react";

export default function isSyntheticEvent(event: unknown): event is React.SyntheticEvent {
  return (event as React.SyntheticEvent).nativeEvent instanceof Event;
}