import { useEffect } from "react";
import { chatEvents } from "../helpers/socket";

// Type definitions for event handler functions
type TokenHandler = (token: string) => void;
type DoneHandler = () => void;
type ErrorHandler = (data: { message: string }) => void;
type RateLimitHandler = (data: { message: string }) => void;

// Custom hook to manage chat stream events
export function useChatStream(
  onToken: TokenHandler,
  onDone: DoneHandler,
  onError: ErrorHandler,
  onRateLimit: RateLimitHandler
) {
  useEffect(() => {
    // Register event listeners
    if (onToken) chatEvents.on("token", onToken); // Listen for token events
    if (onDone) chatEvents.on("done", onDone);  // Listen for done events
    if (onError) chatEvents.on("error", onError); // Listen for error events
    if (onRateLimit) chatEvents.on("rate-limit", onRateLimit);  // Listen for rate-limit events

    return () => {
      // Cleanup event listeners on unmount
      if (onToken) chatEvents.off("token", onToken);
      if (onDone) chatEvents.off("done", onDone);
      if (onError) chatEvents.off("error", onError);
      if (onRateLimit) chatEvents.off("rate-limit", onRateLimit);
    };
  }, [onToken, onDone, onError, onRateLimit]);
}
