import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { infoPages } from './infoPages';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  pageId: number;
  backgroundStyle: string;
  titleText: string;
  introText: string;
  bullets: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.assignPage();
  }

  assignPage() {
    this.route.params.subscribe(
      params => {
        let infoPage = infoPages.find(infoPage => {
          return infoPage.pageId == params['pageId'];
        });

        if (infoPage) {
          this.pageId = infoPage.pageId;
          this.backgroundStyle = `no-repeat top/100% url('../../assets/info/${infoPage.id}.jpg')`;
          this.titleText = infoPage.title;
          this.introText = infoPage.text;
          this.bullets = infoPage.bullets;

          this.toggleNavigationButtons();
        }
      }
    );
  }

  toggleNavigationButtons() {
    const previousButton = document.getElementsByClassName('previous').item(0);
    const nextButton = document.getElementsByClassName('next').item(0);

    if (this.pageId > 1) {
      previousButton.classList.remove('hidden');
    } else {
      previousButton.classList.add('hidden');
    }

    if (this.pageId < infoPages.length) {
      nextButton.classList.remove('hidden');
    } else {
      nextButton.classList.add('hidden');
    }
  }

  doNext() {
    if (this.pageId < infoPages.length) {
      this.router.navigateByUrl('/info/' + (this.pageId + 1));
    }
  }

  doPrevious() {
    if (this.pageId > 1) {
      this.router.navigateByUrl('/info/' + (this.pageId - 1));
    }
  }
}
