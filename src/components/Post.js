import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import firebase from "firebase";
import "./Post.css";

function Post({ postId, post, user }) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;

        if(postId){
            unsubscribe = db.collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()));
            });
        }

        return () => {
            unsubscribe();
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

	return post ? (
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
			<img
				className="postImage"
				src={post.imageUrl}
			/>
			
            <div className="postComments">
                <p className="postCaption">
                    <b>{post.username}</b> {post.caption}
                </p>
                {comments.map((comment) => (
                    <p className="postCaption">
                        <b>{comment.username}</b> {comment.text}
                    </p>
                ))}
            </div>
            {user ?
            <form className="postCommentsInput">
                <input className="postComment" type="text" placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)}/>
                <button className="postCommentButton" type="submit" disabled={!comment} onClick={postComment}> Post </button>
            </form> : 
            ""
            }
		</div>
	) : (
		""
	);
}

export default Post;
