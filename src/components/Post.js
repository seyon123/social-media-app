import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import firebase from "firebase";
import "./Post.css";
import { Link } from "react-router-dom";

function Post({ postId, post, user }) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [hasMoreComments, setHasMoreComments] = useState(false);

    useEffect(() => {
        if(postId){
            db.collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy("timestamp", "asc")
            .onSnapshot((snapshot)=>{
                if(snapshot.docs.length > 3){
                    setHasMoreComments(true);
                }
                setComments(snapshot.docs.slice(Math.max(snapshot.docs.length - 3, 0)).map((doc)=>doc.data()));
            });
        }
    }, [postId])

    const postComment= (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName || user.email.split('@')[0],
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setComment('');
    }

	return post && (
		<div className="post">
			<div className="postHeader">
				<img
					className="avatar"
					src={post.avatar}
					alt={post.username}
					title={post.username}
				/>
				<h3 className="postUsername">{post.username}</h3>
			</div>
            <Link to={`/post/${postId}`}>
                <img
                    className="postImage"
                    src={post.imageUrl}
                    alt={postId}
                />
                
                <div className="postComments">
                    {post.caption &&
                    <p className="postCaption">
                        <strong>{post.username}</strong> {post.caption}
                    </p>
                    }
                    {comments.map((comment , i) => (
                        <p key={i} className="postCaption">
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))}
                    {hasMoreComments && <p className="postCaption postMoreComments">See all comments ...</p>}
                </div>
            </Link>
            {user ?
            <form className="postCommentsInput">
                <input className="postComment" type="text" placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)}/>
                <button className="postCommentButton" type="submit" disabled={!comment} onClick={postComment}> Post </button>
            </form> : 
            ""
            }
		</div>
	);
}

export default Post;
