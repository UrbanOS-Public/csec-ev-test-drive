import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { infoPages } from './infoPages';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  pageId: string;
  backgroundStyle: string;
  titleText: string;
  introText: string;
  bullets: any[] = [];
  displayError: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.assignPage();
  }

  assignPage() {
    this.route.params.subscribe(
      params => {
        let infoPage = infoPages.find(infoPage => {
          return infoPage.id === params['pageId'];
        });

        if (infoPage) {
          this.pageId = infoPage.id;
          this.backgroundStyle = `no-repeat top/100% url('../../assets/info/${infoPage.id}.jpg')`;
          this.titleText = infoPage.title;
          this.introText = infoPage.text;
          this.bullets = infoPage.bullets;
        } else {
          this.displayError = true;
        }
      }
    );
  }

}
