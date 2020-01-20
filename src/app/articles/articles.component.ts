import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  Articles: Array<ArticleSummary>;

  constructor() {
    // tmp until we figure out if we're moving over to Moodle or ...?
    this.Articles = new Array<ArticleSummary>();
    this.Articles.push(new ArticleSummary(
      "Self-study tips (Part 2)",
      "Last week we imparted four tips to help you self-study for the CAA written exams. Well here's a treat - we're back with five more! Without further ado...",
      "self-study-tips-part-two",
      "Monday 20 Jan, 2020",
      "articles/2020-01-20/index.jpg"
    ));
    this.Articles.push(new ArticleSummary(
      "Self-study tips (Part 1)",
      "Finding it tricky to keep on top of studying for the CAA written exams? We're here to help! Finding time in between everything else going on can be tough and study's often the first thing to get bumped when things get too busy. This week is the first of a two-parter, with nine tips to help stay motivated, optimise your study time, and get the exams done.",
      "self-study-tips",
      "Monday 13 Jan, 2020",
      "articles/2020-01-13/index.jpg"
    ));
    this.Articles.push(new ArticleSummary(
      "So. Flying. Where do I start?",
      "Getting started in aviation can be intimidating. There are a lot of resources, sometimes with varying degrees of accuracy, and sometimes with conflicting opinions. Our goal here is to outline the basics and give you something to use as a jumping-off-point, so you can dig deeper into the kind of flying you’re interested in.",
      "so-flying-where-do-i-start",
      "Monday 6 Jan, 2020",
      "articles/2020-01-06/index.jpg"
    ));
  }

  ngOnInit() {
  }
}

class ArticleSummary {
  Title: string;
  Intro: string;
  ArticleUrl: string;
  PublishDate: string;
  ImagePath: string;

  constructor(title: string, intro: string, articleUrl: string, publishDate: string, imagePath?: string) {
    this.Title = title;
    this.Intro = intro;
    this.ImagePath = imagePath;
    this.PublishDate = publishDate;
    this.ArticleUrl = articleUrl;
  }

  getIntro() {
    return this.Intro.substr(0, 200) + "...";
  }
}