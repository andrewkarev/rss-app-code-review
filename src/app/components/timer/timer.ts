import { BaseComponent } from '@components/base-component';
import { TextSkeleton } from '@components/text-skeleton/text-skeleton';
import { TimerService } from '@services/timer.service';
import { formatTime } from '@utils/fomatTime';

import styles from './timer.module.scss';

class TimerComponent extends BaseComponent {
  private readonly timerService = new TimerService(1000);

  constructor(private pause: number) {
    super(
      {
        className: styles.timer,
      },
      TextSkeleton(),
    );
    this.timerService.subscribe(this);
  }

  public update(time: number): void {
    if (this.pause <= time) {
      this.setTextContent('The premiere has started');
      this.timerService.stop();
    } else {
      const timeResult = formatTime(this.pause - time);
      this.setTextContent(timeResult);
    }
  }

  public override remove(): void {
    this.timerService.stop();
    super.remove();
  }
}

export const Timer = (pause: number) => new TimerComponent(pause);
