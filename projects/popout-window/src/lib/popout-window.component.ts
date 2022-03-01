import {
  Component,
  ElementRef,
  HostListener,
  Input, EventEmitter, OnDestroy, Output, Renderer2,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'popout-window',
  styleUrls: ['./popout-window.component.scss'],
  templateUrl: './popout-window.component.html',
})

export class PopoutWindowComponent implements OnDestroy  {
  @Input() windowTitle: string;
  @Output() closed: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('innerWrapper') private innerWrapper: ElementRef;

  private popoutWindow: Window;
  private observer: MutationObserver;

  @HostListener('window:beforeunload')
  private beforeunloadHandler(): void {
    this.close();
  }

  constructor(private renderer2: Renderer2, private elementRef: ElementRef) {}

  get isPoppedOut() {
    return !!this.popoutWindow;
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
    this.close();
  }

  private close(): void {
    if (this.popoutWindow) {
      this.popoutWindow.close();
      this.popoutWindow = null;
      this.closed.next(true)
    }
  }

  public popIn(): void {
    this.renderer2.appendChild(this.elementRef.nativeElement, this.innerWrapper.nativeElement);
    this.close();
  }

  public popOut(): void {
    if (!this.popoutWindow) {
      const elmRect = this.innerWrapper.nativeElement.getBoundingClientRect();

      const navHeight = window.outerHeight - window.innerHeight;
      const navWidth = window.outerWidth - window.innerWidth;

      const winLeft = window.screenX + navWidth + elmRect.left;
      const winTop = window.screenY + navHeight + elmRect.top - 60;

      this.popoutWindow = window.open(
        '',
        `popoutWindow${Date.now()}`,
        `width=${elmRect.width},
        height=${elmRect.height + 1},
        left=${winLeft},
        top=${winTop}`
      );

      this.popoutWindow.document.title = this.windowTitle || window.document.title;
      this.popoutWindow.document.body.style.margin = '0';

      this.cloneStyles();

      this.renderer2.appendChild(this.popoutWindow.document.body, this.innerWrapper.nativeElement);

      this.popoutWindow.addEventListener('unload', () => {
        this.popIn();
      });
    } else {
      this.popoutWindow.focus();
    }
  }
  
  private cloneStyles() {
    document.head.querySelectorAll('style').forEach(node => {
      this.popoutWindow.document.head.appendChild(node.cloneNode(true));
    });

    this.observeStyleChanges();

    document.head.querySelectorAll('link[rel="stylesheet"]').forEach(node => {
      this.popoutWindow.document.head.insertAdjacentHTML('beforeend',
        `<link rel="stylesheet" type="${(node as HTMLLinkElement).type}" href="${(node as HTMLLinkElement).href}">`);
    });

    (document as any).fonts.forEach(node => {
      (this.popoutWindow.document as any).fonts.add(node);
    });
  }

  private observeStyleChanges() {
    const node = document.querySelector('head');

    this.observer?.disconnect();
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'STYLE') {
            this.popoutWindow.document.head.appendChild(node.cloneNode(true));
          }
        });
      });
    });

    this.observer.observe(node, { childList: true });
  }
}
