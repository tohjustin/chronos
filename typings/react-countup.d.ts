declare module "react-countup" {
  import * as React from "react";

  export interface CountUpRenderProps {
    countUpRef: React.RefObject<any>;
    pauseResume(): void;
    reset(): void;
    start(): void;
    update(newEnd?: number): void;
  }
  export interface CountUpProps {
    className?: string;
    decimal?: string;
    decimals?: number;
    delay?: number;
    duration?: number;
    end?: number;
    prefix?: string;
    preserveValue?: boolean;
    redraw?: boolean;
    separator?: string;
    start?: number;
    suffix?: string;
    useEasing?: boolean;
    easingFn?(t: number, b: number, c: number, d: number): void;
    formattingFn?(value: number): string;
    onComplete?(): void;
    onEnd?(providedFn: {
      pauseResume(): void;
      reset(): void;
      start(): void;
      update(): void;
    }): void;
    onStart?(providedFn: {
      pauseResume(): void;
      reset(): void;
      update(): void;
    }): void;
    onPauseResume?(): (providedFn: {
      reset(): void;
      start(): void;
      update(): void;
    }) => void;
    onReset?(): (providedFn: {
      pauseResume(): void;
      start(): void;
      update(): void;
    }) => void;
    onUpdate?(providedFn: {
      pauseResume(): void;
      reset(): void;
      start(): void;
    }): void;
    style?: React.CSSProperties;
    children?(data: CountUpRenderProps): React.ReactElement;
  }
  export default class CountUp extends React.PureComponent<CountUpProps> {}
}
