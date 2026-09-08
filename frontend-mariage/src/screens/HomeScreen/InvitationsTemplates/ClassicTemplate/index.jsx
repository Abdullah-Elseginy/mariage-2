import React from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from '../../../LoadingScreen';
import AudioPlayer from '../../sections/AudioPlayer';
import Countdown from '../../sections/Countdown';
import EventDetails from '../../sections/EventDetails';
import Gallery from '../../sections/Gallery';
import Hero from '../../sections/Hero';
import LoveStory from '../../sections/LoveStory';
import RSVP from '../../sections/RSVP';
import WeddingFooter from '../../sections/Footer';

const ClassicTemplate = ({
  audioStartSignal,
  invitation,
  invitationPath,
  onCurtainsOpen,
  onInvitationOpen,
  onLoaderFinished,
  showCurtainLoader,
}) => (
  <>
    <AnimatePresence>
      {showCurtainLoader && (
        <LoadingScreen
          key="invitation-loader"
          duration={5000}
          invitation={invitation}
          onCurtainsOpen={onCurtainsOpen}
          onFinished={onLoaderFinished}
        />
      )}
    </AnimatePresence>

    <AudioPlayer invitation={invitation} playSignal={audioStartSignal} />
    <Hero invitation={invitation} onInvitationOpen={onInvitationOpen} />
    <LoveStory invitation={invitation} />
    <EventDetails invitation={invitation} />
    <Gallery invitation={invitation} />
    <Countdown invitation={invitation} />
    <RSVP invitation={invitation} invitationPath={invitationPath} />
    <WeddingFooter invitation={invitation} />
  </>
);

export default ClassicTemplate;
