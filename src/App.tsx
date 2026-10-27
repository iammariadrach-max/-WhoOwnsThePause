import TypographyFlow from "./components/TypographyFlow";
import Navigation from "./components/Navigation";
import HeroPause from "./components/HeroPause";
import PerceptionTimer from "./components/PerceptionTimer";
import ControlPauseBridge from "./components/ControlPauseBridge";
import AttentionSection from "./components/AttentionSection";
import UncertaintySection from "./components/UncertaintySection";
import WaitingExperiment from "./components/WaitingExperiment";
import NinetyNineSection from "./components/NinetyNineSection";
import ElasticETA from "./components/ElasticETA";
import CountdownComparison from "./components/CountdownComparison";
import {
  PartTwo,
  OverloadedPause,
  OptionalPause,
  RestManifesto,
  ResponsibilityField,
} from "./components/CulturalSections";
import AccelerationFork from "./components/AccelerationFork";
import ControlDiagnostic from "./components/ControlDiagnostic";
import FinalSection from "./components/FinalSection";
import LongreadFooter from "./components/LongreadFooter";
import GlobalProcessStatus from "./components/GlobalProcessStatus";
import { LongreadProvider } from "./state/LongreadContext";
import StyleGuide from "./components/StyleGuide";
import AtmosphereLayer from "./components/Atmosphere";
import { ExposureTransition } from "./components/SceneTransitions";
import ReadingScroll from "./components/ReadingScroll";
export default function App() {
  return (
    <LongreadProvider>
      {import.meta.env.DEV &&
      new URLSearchParams(location.search).has("styleguide") ? (
        <StyleGuide />
      ) : (
        <>
          <TypographyFlow />
          <AtmosphereLayer />
          <ReadingScroll />
          <Navigation />
          <main id="main" tabIndex={-1}>
            <HeroPause />
            <PerceptionTimer />
            <ControlPauseBridge />
            <AttentionSection />
            <ExposureTransition kind="negative" label="PERCEPTION / SYSTEM" />
            <UncertaintySection />
            <WaitingExperiment />
            <ExposureTransition kind="line" label="WORK / REMAINING" />
            <NinetyNineSection />
            <ElasticETA />
            <CountdownComparison />
            <PartTwo />
            <OverloadedPause />
            <OptionalPause />
            <RestManifesto />
            <ResponsibilityField />
            <ExposureTransition kind="split" label="РИТМ / ВОЗМОЖНОСТИ" />
            <AccelerationFork />
            <ControlDiagnostic />
            <ExposureTransition kind="line" label="CONTROL / RELEASE" />
            <FinalSection />
          </main>
          <LongreadFooter />
          <GlobalProcessStatus />
        </>
      )}
    </LongreadProvider>
  );
}
