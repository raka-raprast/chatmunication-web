# Chatmunication landing page

A standalone React + Vite product site. It is separate from the Flutter application in `../chatmunication/` and does not replace `chatmunication/web/index.html`.

Run from `landing/`:

```sh
npm install
npm run dev
```

Open the URL printed by Vite. For a production build, run `npm run build` and serve `dist/` (or preview it locally with `npm run preview`). Vite serves the optimized screenshots from `assets/` and copies them into the build output. The original app screenshots remain untouched.

The call section uses an optimized, muted stock clip and poster from [Antoni Shkraba on Pexels](https://www.pexels.com/video/man-waving-his-hand-8136218/), under the [Pexels License](https://www.pexels.com/license/). The visual is labeled illustrative footage rather than a real app call or an endorsement. Its back, more, and call-control overlays are decorative; they are not interactive buttons. On desktop and mobile, a pinned, scroll-linked scene starts with full-viewport footage, contracts to a floating portrait, and finally docks the same playing video into a phone beside the voice-call screen while the product copy appears. Scrolling upward reverses the sequence. The clip loops while visible and pauses when the page is hidden or the video leaves view. Reduced-motion visitors see the complete unpinned product layout with the video paused. The message and profile visuals also move gently with scrolling unless reduced motion is enabled.

Phone-shaped app screenshots in the message, call, profile, and tour sections have decorative CSS side-button frames; their original image files are unchanged. The call video keeps its original scroll-driven frame so the full-bleed-to-phone morph is not affected by screenshot framing.


The hero is a full-bleed, muted video background: an optimized clip and poster of [a video call between two people, by Artem Podrez on Pexels](https://www.pexels.com/video/a-couple-talking-through-video-call-6585555/), under the [Pexels License](https://www.pexels.com/license/), with a dark gradient scrim for text contrast. It is labeled illustrative footage, not a real app recording. The clip loops while visible and pauses when the page is hidden, the hero scrolls offscreen, or reduced motion is requested, in which case the poster frame is shown instead.

