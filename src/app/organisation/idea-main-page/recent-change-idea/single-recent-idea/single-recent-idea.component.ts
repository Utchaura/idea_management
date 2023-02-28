import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IdeaService } from 'src/app/services/idea.service';

@Component({
  selector: 'app-single-recent-idea',
  templateUrl: './single-recent-idea.component.html',
  styleUrls: ['./single-recent-idea.component.css']
})
export class SingleRecentIdeaComponent implements OnInit,AfterViewInit {

  @Input('Index') index: number;
  @Input('Idea') idea: any;


  @Output() onIdea = new EventEmitter();

  @ViewChild('postElement') postElement: ElementRef<HTMLDivElement> | undefined;
  ideaImage: string;

  constructor(
    private _ideaService: IdeaService,
    private _sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    if(this.idea.ideaCoverImg)
    this.ideaImage = this.idea.ideaCoverImg.imageSrc + '?' + Math.floor(1000000000 + Math.random() * 9000000000);
  }

  ngAfterViewInit(): void {

    const me = this;
    let atThelinks =
      this.elementRef.nativeElement.querySelectorAll('.atthelink');
    let hashThelinks =
      this.elementRef.nativeElement.querySelectorAll('.hashlink');

    atThelinks.forEach((anchor: HTMLAnchorElement) => {

      anchor.addEventListener('click', this.handleAtTheClick);
    });
    hashThelinks.forEach((anchor: HTMLAnchorElement) => {
      anchor.addEventListener('click', this.handleHashClick);
    });
  }
  public handleAtTheClick = (event: Event) => {

    event.preventDefault();
    const anchor = event.target as HTMLAnchorElement;
    this._ideaService.AtTheLinkClicked(
      anchor.attributes.getNamedItem('data')?.value
    );
  };
  public handleHashClick = (event: Event) => {

    event.preventDefault();
    const anchor = event.target as HTMLAnchorElement;
    this._ideaService.HashLinkClicked(
      anchor.attributes.getNamedItem('data')?.value
    );
  };

  onClick(idea: any) {
    this.onIdea.emit(idea);
  }
}
