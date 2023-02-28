import { Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fresh-idea',
  templateUrl: './fresh-idea.component.html',
  styleUrls: ['./fresh-idea.component.css'],
})
export class FreshIdeaComponent implements OnInit {
  public hashTag: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _sanitizer: DomSanitizer,

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let hash = params.get('key');
      this.hashTag = hash;
    });


  }
}
