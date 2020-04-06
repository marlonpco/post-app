import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSubscription: Subscription;
  public isLoading: boolean = false;
  public totalPost = 10;
  public postPerPage = 2;
  public pageSizeOptions = [1, 2, 5, 10];
  public currentPage = 1;

  constructor(private _postsService: PostService) {}

  ngOnInit(){
    this.isLoading = true;
    this._postsService.getPosts(this.postPerPage, this.currentPage);
    this.postSubscription = this._postsService.getPostUpdatedListener()
      .subscribe((data) => {
          this.isLoading = false;
          this.posts = data.posts;
          this.totalPost = data.postsCount;
        }
      );
  }

  ngOnDestroy(){
    this.postSubscription.unsubscribe();
  }

  onDelete(postId: string){
    this.isLoading = true;
    this._postsService.deletePost(postId);
  }

  onPageChange(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this._postsService.getPosts(this.postPerPage, this.currentPage);
  }

  updatePageElements(){
    this._postsService.getPostsTotalCount().subscribe((data) => {
      this.totalPost = data.size;
      this._postsService.getPosts(this.postPerPage, this.currentPage);
    });
  }
}
