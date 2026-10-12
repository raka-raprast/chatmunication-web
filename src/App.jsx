import { useEffect, useRef } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  ChevronLeft,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Sparkles,
  Video,
  Wifi,
} from 'lucide-react';

const image = (name) => `${import.meta.env.BASE_URL}${name}.webp`;

const tourScreens = [
  { image: 'onboarding-welcome', alt: 'Welcome screen introducing Chatmunication', caption: 'Stay connected' },
  { image: 'onboarding-message', alt: 'Onboarding screen introducing real-time messaging', caption: 'Keep talking' },
  { image: 'onboarding-call', alt: 'Onboarding screen introducing voice and video calls', caption: 'Make the call' },
  { image: 'onboarding-close', alt: 'Final onboarding screen inviting you to bring people closer', caption: 'Feel closer' },
];

function PhoneFrame({ className = '', children }) {
  return (
    <div className={`phone-frame${className ? ` ${className}` : ''}`}>
      {children}
      <span className="phone-frame-btn phone-frame-action" aria-hidden="true" />
      <span className="phone-frame-btn phone-frame-volume-up" aria-hidden="true" />
      <span className="phone-frame-btn phone-frame-volume-down" aria-hidden="true" />
      <span className="phone-frame-btn phone-frame-power" aria-hidden="true" />
    </div>
  );
}

function usePlayWhenVisible(videoRef) {
  useEffect(() => {
    const video = videoRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;

    function updatePlayback() {
      if (visible && document.visibilityState === 'visible' && !reducedMotion.matches) {
        video.play().catch(() => video.pause());
      } else {
        video.pause();
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback();
    }, { threshold: 0.15 });
    observer.observe(video);
    reducedMotion.addEventListener('change', updatePlayback);
    document.addEventListener('visibilitychange', updatePlayback);

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener('change', updatePlayback);
      document.removeEventListener('visibilitychange', updatePlayback);
      video.pause();
    };
  }, [videoRef]);
}

function useScrollMotion() {
  useEffect(() => {
    const message = document.querySelector('.message-visual .phone-frame');
    const callSection = document.querySelector('.call-section');
    const callStage = callSection.querySelector('.call-stage');
    const callVisual = callSection.querySelector('.call-visual');
    const callSlot = callSection.querySelector('.call-phone-slot');
    const profile = document.querySelector('.profile-art .phone-frame');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cinematic = window.matchMedia('(min-height: 600px) and (prefers-reduced-motion: no-preference)');
    const motionProperties = ['--video-x', '--video-y', '--video-width', '--video-height', '--video-radius', '--video-border', '--video-focus', '--opening-reveal', '--panel-reveal', '--ui-reveal', '--screen-reveal', '--screen-x', '--copy-reveal', '--copy-y'];
    let frame = 0;

    function clamp(value) {
      return Math.max(0, Math.min(1, value));
    }

    function progress(element) {
      const bounds = element.getBoundingClientRect();
      return clamp((innerHeight - bounds.top) / (innerHeight + bounds.height));
    }

    function smooth(start, end, value) {
      const position = clamp((value - start) / (end - start));
      return position * position * (3 - 2 * position);
    }

    function mix(start, end, amount) {
      return start + (end - start) * amount;
    }

    function update() {
      frame = 0;
      const isCinematic = cinematic.matches;
      callSection.classList.toggle('is-cinematic', isCinematic);

      if (reducedMotion.matches) {
        message.style.removeProperty('--scroll-offset');
        profile.style.removeProperty('--scroll-offset');
      } else {
        message.style.setProperty('--scroll-offset', `${((0.5 - progress(message.parentElement)) * 48).toFixed(1)}px`);
        profile.style.setProperty('--scroll-offset', `${((0.5 - progress(profile.parentElement)) * 36).toFixed(1)}px`);
      }

      if (!isCinematic) {
        for (const name of motionProperties) callSection.style.removeProperty(name);
        return;
      }

      const section = callSection.getBoundingClientRect();
      if (section.bottom < 0 || section.top > innerHeight) return;
      const stage = callStage.getBoundingClientRect();
      const visual = callVisual.getBoundingClientRect();
      const slot = callSlot.getBoundingClientRect();
      const position = clamp(-section.top / (section.height - innerHeight));
      const float = smooth(0.16, 0.52, position);
      const dock = smooth(0.52, 0.86, position);
      const compact = innerWidth <= 680;
      const floatingWidth = Math.min(stage.width * (compact ? 0.76 : 0.54), compact ? 370 : 760);
      const floatingHeight = Math.min(stage.height * (compact ? 0.78 : 0.84), compact ? 650 : 850);

      const videoX = mix(mix(stage.left - visual.left, stage.left + (stage.width - floatingWidth) / 2 - visual.left, float), slot.left - visual.left, dock);
      const videoY = mix(mix(stage.top - visual.top, stage.top + (stage.height - floatingHeight) / 2 - visual.top, float), slot.top - visual.top, dock);
      const videoWidth = mix(mix(stage.width, floatingWidth, float), slot.width, dock);
      const videoHeight = mix(mix(stage.height, floatingHeight, float), slot.height, dock);
      const opening = 1 - smooth(0.12, 0.34, position);
      const ui = smooth(0.67, 0.84, position);
      const screen = smooth(0.72, 0.92, position);
      const copy = smooth(0.70, 0.91, position);

      callSection.style.setProperty('--video-x', `${videoX.toFixed(1)}px`);
      callSection.style.setProperty('--video-y', `${videoY.toFixed(1)}px`);
      callSection.style.setProperty('--video-width', `${videoWidth.toFixed(1)}px`);
      callSection.style.setProperty('--video-height', `${videoHeight.toFixed(1)}px`);
      callSection.style.setProperty('--video-radius', `${((1 - dock) * float * 36 + dock * 34).toFixed(1)}px`);
      callSection.style.setProperty('--video-border', `${(ui * 5).toFixed(1)}px`);
      callSection.style.setProperty('--video-focus', `${(18 + 32 * smooth(0.18, 0.85, position)).toFixed(1)}%`);
      callSection.style.setProperty('--opening-reveal', opening.toFixed(3));
      callSection.style.setProperty('--panel-reveal', smooth(0.57, 0.79, position).toFixed(3));
      callSection.style.setProperty('--ui-reveal', ui.toFixed(3));
      callSection.style.setProperty('--screen-reveal', screen.toFixed(3));
      callSection.style.setProperty('--screen-x', `${((1 - screen) * 80).toFixed(1)}px`);
      callSection.style.setProperty('--copy-reveal', copy.toFixed(3));
      callSection.style.setProperty('--copy-y', `${((1 - copy) * 48).toFixed(1)}px`);
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reducedMotion.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reducedMotion.removeEventListener('change', schedule);
    };
  }, []);
}

function Brand({ compact = false }) {
  const size = compact ? 42 : 46;
  return (
    <a className="brand" href="#top" aria-label="Chatmunication, back to top">
      <img src={image('logo')} width={size} height={size} alt="" />
      <span><strong>Chat</strong><span>munication</span></span>
    </a>
  );
}

function Header() {
  return (
    <header className="site-header" id="top">
      <div className="container header-inner">
        <Brand />
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#features">Why Chatmunication</a>
          <a href="#screens">Inside the app</a>
          <a href="#tour">First look</a>
        </nav>
        <a className="header-cta" href="#screens">Explore the app <ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
    </header>
  );
}

function Hero() {
  const videoRef = useRef(null);
  usePlayWhenVisible(videoRef);

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-media" aria-hidden="true">
        <video
          ref={videoRef}
          width="1920"
          height="1080"
          poster={image('hero-bg')}
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={`${import.meta.env.BASE_URL}hero-bg.mp4`} type="video/mp4" />
        </video>
        <div className="hero-scrim" />
      </div>
      <div className="container hero-content">
        <div className="hero-copy">
          <div className="hero-spark" aria-hidden="true"><span /><span /><span /></div>
          <h1 id="hero-heading">A little closer,<br /><em>every day.</em></h1>
          <p>From the little check-ins to the long catch-ups, Chatmunication makes it easy to stay in touch with the people who matter.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#screens">See the app <ArrowRight aria-hidden="true" /></a>
            <a className="text-link" href="#features">What you can do <ArrowDown aria-hidden="true" /></a>
          </div>
          <div className="hero-aside"><span className="hero-aside-line" /> CHAT · VOICE · VIDEO, ALL TOGETHER</div>
        </div>
      </div>
      <p className="hero-credit">Illustrative footage · <a href="https://www.pexels.com/video/a-couple-talking-through-video-call-6585555/" target="_blank" rel="noopener noreferrer">Artem Podrez / Pexels</a></p>
    </section>
  );
}

function IntroStrip() {
  return (
    <section className="intro-strip" id="features" aria-label="What you can do with Chatmunication">
      <div className="container intro-inner">
        <p>However you say hello, <strong>make it feel close.</strong></p>
        <div className="intro-items">
          <span><MessageCircle aria-hidden="true" /> Real-time chat</span>
          <span><Phone aria-hidden="true" /> Voice calls</span>
          <span><Video aria-hidden="true" /> Video calls</span>
        </div>
      </div>
    </section>
  );
}

function MessageSection({ id, headingId, title, description, detail, screenshot, screenshotHeight, screenshotAlt, Icon }) {
  return (
    <section className="feature-section message-section" id={id} aria-labelledby={headingId}>
      <div className="container feature-grid">
        <div className="feature-copy">
          <span className="section-mark" aria-hidden="true"><Icon /></span>
          <h2 id={headingId}>{title[0]}<br />{title[1]}</h2>
          <p>{description}</p>
          <div className="feature-detail"><span className="detail-dot" /> {detail}</div>
        </div>
        <div className="feature-visual message-visual">
          <div className="visual-circle visual-circle-one" aria-hidden="true" />
          <div className="visual-circle visual-circle-two" aria-hidden="true" />
          <PhoneFrame>
            <img src={image(screenshot)} width="510" height={screenshotHeight} alt={screenshotAlt} loading="lazy" />
          </PhoneFrame>
          <div className="message-bubble" aria-hidden="true"><span className="bubble-avatar">J</span><span><strong>John is online</strong><small>Say hello anytime</small></span><span className="live-dot" /></div>
        </div>
      </div>
    </section>
  );
}

function CallStory({ headingId, title, description, detail, screenshot, screenshotHeight, screenshotAlt, Icon }) {
  const videoRef = useRef(null);

  usePlayWhenVisible(videoRef);

  return (
    <section className="feature-section call-section" aria-labelledby={headingId}>
      <div className="call-stage">
        <div className="container call-product">
          <div className="feature-visual call-visual">
            <div className="call-ripple call-ripple-one" aria-hidden="true" />
            <div className="call-ripple call-ripple-two" aria-hidden="true" />
            <div className="call-phone-slot" aria-hidden="true" />
            <div className="call-video-frame">
              <video
                ref={videoRef}
                width="540"
                height="960"
                poster={image('call-moment')}
                muted
                loop
                playsInline
                preload="none"
                aria-label="Illustrative footage of someone greeting a friend on a video call"
              >
                <source src={`${import.meta.env.BASE_URL}call-moment.mp4`} type="video/mp4" />
              </video>
              <div className="preview-status" aria-hidden="true">
                <span>11:30</span><span className="preview-island" /><span className="preview-signal"><i /><i /><i /><Wifi size={10} /></span>
              </div>
              <div className="preview-topbar" aria-hidden="true">
                <span><ChevronLeft /></span>
                <span><MoreHorizontal /></span>
              </div>
              <div className="preview-controls" aria-hidden="true">
                <span className="preview-control"><span className="preview-control-icon"><span className="material-symbols-rounded">volume_up</span></span>Speaker</span>
                <span className="preview-control"><span className="preview-control-icon"><span className="material-symbols-rounded">mic</span></span>Mute</span>
                <span className="preview-control"><span className="preview-control-icon"><span className="material-symbols-rounded">videocam</span></span>Video</span>
                <span className="preview-control preview-end"><span className="preview-control-icon"><span className="material-symbols-rounded">call_end</span></span>End</span>
              </div>
            </div>
            <PhoneFrame className="call-screen-frame">
              <img className="call-screen" src={image(screenshot)} width="510" height={screenshotHeight} alt={screenshotAlt} loading="lazy" />
            </PhoneFrame>
            <div className="call-note" aria-hidden="true"><span className="call-note-icon"><Phone /></span><span>Just one call away.</span></div>
          </div>
          <div className="feature-copy">
            <span className="section-mark" aria-hidden="true"><Icon /></span>
            <h2 id={headingId}>{title[0]}<br />{title[1]}</h2>
            <p>{description}</p>
            <div className="feature-detail"><span className="detail-dot" /> {detail}</div>
          </div>
        </div>
        <div className="call-opening" aria-hidden="true">
          <span>Beyond the message</span>
          <p>There they are.</p>
          <small>Scroll to see the moment become a call</small>
        </div>
        <p className="footage-credit">Illustrative footage · <a href="https://www.pexels.com/video/man-waving-his-hand-8136218/" target="_blank" rel="noopener noreferrer">Antoni Shkraba / Pexels</a></p>
      </div>
    </section>
  );
}

function ProfileSection() {
  return (
    <section className="profile-section" aria-labelledby="profile-heading">
      <div className="container profile-panel">
        <div className="profile-copy">
          <Sparkles className="profile-small-star" aria-hidden="true" />
          <h2 id="profile-heading">Your people.<br />Your space.</h2>
          <p>A familiar place for your conversations and a profile that's yours. Find the people you care about and stay connected in your own way.</p>
        </div>
        <div className="profile-art">
          <div className="profile-art-circle" aria-hidden="true" />
          <PhoneFrame className="profile-frame">
            <img src={image('profile')} width="510" height="1107" alt="Chatmunication profile screen with user details and sharing controls" loading="lazy" />
          </PhoneFrame>
          <div className="profile-chip" aria-hidden="true"><span className="live-dot" /> Stay connected</div>
        </div>
      </div>
    </section>
  );
}

function TourSection() {
  return (
    <section className="tour-section" id="tour" aria-labelledby="tour-heading">
      <div className="container">
        <div className="tour-heading">
          <div>
            <h2 id="tour-heading">From first hello<br />to always there.</h2>
            <p>A glimpse of the experience, from getting started to staying close.</p>
          </div>
          <a className="tour-top-link" href="#top">Back to top <ArrowUp aria-hidden="true" /></a>
        </div>
        <div className="tour-gallery" aria-label="Chatmunication onboarding screens">
          {tourScreens.map((screen) => (
            <figure key={screen.image}>
              <PhoneFrame className="tour-frame">
                <img src={image(screen.image)} width="420" height="912" alt={screen.alt} loading="lazy" />
              </PhoneFrame>
              <figcaption>{screen.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Brand compact />
        <p>Good conversations bring us closer.<br />Website by <a className="footer-credit" href="https://raprast-labs.space/">Raprast Labs</a>.</p>
        <a href="#top" className="footer-back">Back to top ↑</a>
      </div>
    </footer>
  );
}

export default function App() {
  useScrollMotion();
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <IntroStrip />
        <MessageSection
          id="screens"
          headingId="message-heading"
          title={['The little messages', 'mean a lot.']}
          description="Pick up where you left off, see who's around, and turn a quick thought into a real conversation. Your chats have a place to feel right at home."
          detail="Your conversations, in one easy-to-find place"
          screenshot="chat"
          screenshotHeight="1107"
          screenshotAlt="A Chatmunication conversation with John Doe"
          Icon={MessageCircle}
        />
        <CallStory
          headingId="call-heading"
          title={['Hear their voice.', 'See their smile.']}
          description="Some moments are better out loud. Move from a simple voice call to face-to-face video and make distance feel a little smaller."
          detail="Voice and video, when words aren't enough"
          screenshot="voice-call"
          screenshotHeight="1106"
          screenshotAlt="Voice call screen showing a call to Amita Dae"
          Icon={Phone}
        />
        <ProfileSection />
        <TourSection />
      </main>
      <Footer />
    </>
  );
}
