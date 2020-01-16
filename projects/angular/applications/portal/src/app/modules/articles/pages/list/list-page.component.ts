import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTable, MatTableDataSource, MatDialog } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IdentityService } from '@tenlastic/ng-authentication';
import { Article, ArticleService, Game, GameService } from '@tenlastic/ng-http';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { PromptComponent } from '../../../../shared/components';
import { TITLE } from '../../../../shared/constants';

@Component({
  templateUrl: 'list-page.component.html',
  styleUrls: ['./list-page.component.scss'],
})
export class ArticlesListPageComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<Article>;

  public dataSource: MatTableDataSource<Article>;
  public displayedColumns: string[] = [
    'publishedAt',
    'type',
    'title',
    'caption',
    'createdAt',
    'updatedAt',
    'actions',
  ];
  public search = '';

  private game: Game;
  private subject: Subject<string> = new Subject();

  constructor(
    private articleService: ArticleService,
    private activatedRoute: ActivatedRoute,
    private gameService: GameService,
    public identityService: IdentityService,
    private matDialog: MatDialog,
    private titleService: Title,
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async params => {
      const gameSlug = params.get('gameSlug');
      this.game = await this.gameService.findOne(gameSlug);

      this.titleService.setTitle(`${TITLE} | Articles`);
      this.fetchArticles();

      this.subject.pipe(debounceTime(300)).subscribe(this.applyFilter.bind(this));
    });
  }

  public clearSearch() {
    this.search = '';
    this.applyFilter('');
  }

  public onKeyUp(searchTextValue: string) {
    this.subject.next(searchTextValue);
  }

  public async publish(article: Article) {
    const result = await this.articleService.update(this.game.slug, {
      ...article,
      publishedAt: new Date(),
    });
    article.publishedAt = result.publishedAt;
  }

  public showDeletePrompt(record: Article) {
    const dialogRef = this.matDialog.open(PromptComponent, {
      data: {
        buttons: [
          { background: 'accent', label: 'No' },
          { color: 'white', label: 'Yes' },
        ],
        message: `Are you sure you want to delete this Article?`,
      },
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result === 'Yes') {
        await this.articleService.delete(this.game.slug, record._id);
        this.deleteArticle(record);
      }
    });
  }

  public async unpublish(article: Article) {
    const result = await this.articleService.update(this.game.slug, {
      ...article,
      publishedAt: null,
    });
    article.publishedAt = result.publishedAt;
  }

  private applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private async fetchArticles() {
    const records = await this.articleService.find(this.game.slug, { sort: 'name' });

    this.dataSource = new MatTableDataSource<Article>(records);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private deleteArticle(record: Article) {
    const index = this.dataSource.data.findIndex(u => u._id === record._id);
    this.dataSource.data.splice(index, 1);

    this.dataSource.data = [].concat(this.dataSource.data);
    this.table.renderRows();
  }
}