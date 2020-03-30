
import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{

  private modeCreate: boolean = true;
  private postId: string = null;
  public post: Post = null;

  constructor(private _postsService: PostService,
    public _route: ActivatedRoute) {}

  ngOnInit(){
    this._route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('id')){
        this.modeCreate = false;
        this.postId = paramMap.get('id');
        this._postsService.getPost(this.postId).subscribe(data => {
          console.log(data);
          this.post = {
            id: data.post._id,
            title: data.post.title,
            content: data.post.content
          }
        });
      }
    });
  }

  onSavePost(form: NgForm){

    if(form.invalid){
      return;
    }

    const post: Post = {
      id: this.postId,
      title: form.value.title,
      content: form.value.content
    };

    if(this.modeCreate){
      this._postsService.addPost(post);
    }else{
      this._postsService.updatePost(post);
    }


    form.reset();
  }
}
