import { useRef, useState } from "react";

import {
  KnockFeedProvider,
  NotificationFeedPopover,
  NotificationIconButton,
} from "@knocklabs/react-notification-feed";

import { useAuth } from "@clerk/nextjs";
import "@knocklabs/react-notification-feed/dist/index.css";

const KNOCK_PUBLIC_API_KEY = process.env
  .NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY as string;
const KNOCK_FEED_CHANNEL_ID = process.env
  .NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID as string;

const NotificationMenu = () => {
  const { userId, isLoaded } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);

  if (!isLoaded) {
    return <></>;
  }

  return (
    <KnockFeedProvider
      apiKey={KNOCK_PUBLIC_API_KEY}
      feedId={KNOCK_FEED_CHANNEL_ID}
      userId={userId!}
    >
      <>
        <NotificationIconButton
          ref={notifButtonRef}
          onClick={(e) => setIsVisible(!isVisible)}
        />
        <NotificationFeedPopover
          buttonRef={notifButtonRef}
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
        />
      </>
    </KnockFeedProvider>
  );
};

export default NotificationMenu;
