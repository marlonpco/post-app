import { Injectable } from '@angular/core';

import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private _http: HttpClient) { }

  getPosts(){
    this._http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map(data => {
        return data.posts.map(post => {
          return {
            id: post._id,
            title: post.title,
            content: post.content
          };
        });
      }))
      .subscribe((data) => {
        this.posts = data;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(id: string){
    return this._http.get<{message: string, post: {_id: string, title: string, content: string}}>
      ('http://localhost:3000/api/posts/' + id);
  }

  getPostUpdatedListener(){
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post){
    this._http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((data) => {
        console.log(data.message, data.postId);
        post.id = data.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(post: Post){
    this._http.patch('http://localhost:3000/api/posts/' + post.id, post).subscribe(
      response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(data => data.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      }
    );
  }

  deletePost(postId: string){
    this._http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        console.log('Post(\#' + postId + ') deleted!');
        const remainingPosts = this.posts.filter(post => post.id !== postId);
        this.posts = remainingPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
