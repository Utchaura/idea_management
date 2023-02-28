import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IdeaService } from 'src/app/services/idea.service';

@Component({
  selector: 'app-single-top-voted-idea',
  templateUrl: './single-top-voted-idea.component.html',
  styleUrls: ['./single-top-voted-idea.component.css']
})
export class SingleTopVotedIdeaComponent implements OnInit, AfterViewInit {

  @Input('Index') index: number;
  @Input('Idea') idea: any;

  
  @Output() onIdea = new EventEmitter();
  
  @ViewChild('postElement') postElement: ElementRef<HTMLDivElement> | undefined;
  
  constructor(
    private _ideaService: IdeaService,
    private _sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
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
