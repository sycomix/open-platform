import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IdentityService } from '@tenlastic/ng-authentication';
import { Article, ArticleService, Game, GameService } from '@tenlastic/ng-http';
import marked from 'marked';

import { SelectedNamespaceService } from '../../../../core/services';

@Component({
  templateUrl: 'form-page.component.html',
  styleUrls: ['./form-page.component.scss'],
})
export class ArticlesFormPageComponent implements OnInit {
  public data: Article;
  public error: string;
  public form: FormGroup;
  public types = [
    { label: 'News', value: 'News' },
    { label: 'Patch Notes', value: 'Patch Notes' },
  ];

  private game: Game;

  constructor(
    private activatedRoute: ActivatedRoute,
    private articleService: ArticleService,
    private formBuilder: FormBuilder,
    private gameService: GameService,
    public identityService: IdentityService,
    private router: Router,
    public selectedNamespaceService: SelectedNamespaceService,
  ) {}

  public ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async params => {
      const _id = params.get('_id');

      const gameSlug = params.get('gameSlug');
      this.game = await this.gameService.findOne(gameSlug);

      if (_id !== 'new') {
        this.data = await this.articleService.findOne(this.game.slug, _id);
      }

      this.setupForm();
    });
  }

  public async save() {
    if (this.form.invalid) {
      this.form.get('body').markAsTouched();
      this.form.get('caption').markAsTouched();
      this.form.get('title').markAsTouched();
      this.form.get('type').markAsTouched();

      return;
    }

    const values: Partial<Article> = {
      body: this.form.get('body').value,
      caption: this.form.get('caption').value,
      gameId: this.game._id,
      title: this.form.get('title').value,
      type: this.form.get('type').value,
    };

    if (this.data._id) {
      this.update(values);
    } else {
      this.create(values);
    }
  }

  private async create(data: Partial<Article>) {
    try {
      await this.articleService.create(this.game.slug, data);
      this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    } catch (e) {
      this.error = 'That slug is already taken.';
    }
  }

  private setupForm(): void {
    this.data = this.data || new Article();

    this.form = this.formBuilder.group({
      body: [this.data.body, Validators.required],
      caption: [this.data.caption],
      title: [this.data.title, Validators.required],
      type: [this.data.type || this.types[0].value, Validators.required],
    });

    this.form.valueChanges.subscribe(() => (this.error = null));
  }

  private async update(data: Partial<Article>) {
    data._id = this.data._id;

    try {
      await this.articleService.update(this.game.slug, data);
      this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    } catch (e) {
      this.error = 'That slug is already taken.';
    }
  }
}