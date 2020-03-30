import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First Post', content: 'This is the 1st post\'s content'},
  //   {title: 'Second Post', content: 'This is the 2nd post\'s content'},
  //   {title: 'Third Post', content: 'This is the 3rd post\'s content'}
  // ];

  posts: Post[] = [];
  private postSubscription: Subscription;

  constructor(private _postsService: PostService) {}

  ngOnInit(){
    this._postsService.getPosts();
    this.postSubscription = this._postsService.getPostUpdatedListener()
      .subscribe((data: Post[]) => {
          this.posts = data;
        }
      );
  }

  ngOnDestroy(){
    this.postSubscription.unsubscribe();
  }

  onDelete(postId: string){
    this._postsService.deletePost(postId);
  }

}
