import * as React from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';

import { PostItem } from './post-item.component';
import { PostsState, Post  } from '../state/posts.state';

import { BlogPostsService } from '../services/blogposts.service';

interface Props {
    postsState : PostsState
}

@observer
class PostsList extends React.Component<Props, {}> {
    @observable private isLoading : boolean = true;
    constructor(props: any) {
        super(props);
    }

    componentWillMount() {
        const bps : BlogPostsService = new BlogPostsService();

        bps.getPosts().subscribe(
            (data : any) => {
                if (data.response.statusCode === 200) {
                    // The assignment to the posts state doesn't cause mobx to force render() to be called, why?
                    this.props.postsState.posts = data.body;

                    // ERR: at runtime this line causes a type error declaring addPost is not a function
                    // data.body.map((post : Post) => this.props.postsState.addPost(post));

                    this.isLoading = false;
                }
            },
            (err : string) => console.error(err) // Show error in console 
            );
    }

    render() {
        if (this.isLoading)
            return (
                <div>
                    Loading....
                </div>
            );

        const posts =  this.props.postsState.posts.map((post) => {
            return (
                <PostItem 
                    post={post}
                    key={post.id}/>
            )
        });

        return (
            <ul className="col-md-4 list-group">
            {posts}
            </ul>
        );
    }
}

export { PostsList };