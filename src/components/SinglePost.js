import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import firebase from "firebase";
import { useStateValue } from '../StateProvider';
import './SinglePost.css'

function SinglePost() {
    const { id } = useParams();

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [post, setPost] = useState({});
    const [{ user }, dispatch] = useStateValue();

    useEffect(() => {
        if(id){
            db.collection("posts")
            .doc(id)
            .collection("comments")
            .orderBy("timestamp", "asc")
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()));
            });
        }
    }, [id])

    useEffect(() => {
        if(id){
            db.collection("posts").doc(id).get().then((doc) => {
                setPost(doc.data());
            });
        }
    }, [id])

    const postComment= (event) => {
        event.preventDefault();
        db.collection("posts").doc(id).collection("comments").add({
            text: comment,
            username: user.displayName || user.email.split('@')[0],
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setComment('');
    }

    return post && (
        <div className="singlePostContainer">
            <div className="singlePost">
                <img
                    className="singlePostImage"
                    src={post.imageUrl}
                    alt={id}
                />
                <div className="singlePostRight">
                    <div className="postHeader">
                        <img
                            className="avatar"
                            src={post.avatar}
                            alt={post.username}
                            title={post.username}
                        />
                        <h3 className="postUsername">{post.username}</h3>
                    </div>
                    <div className="postComments singlePostComments">
                        {post.caption &&
                        <p className="postCaption">
                            <b>{post.username}</b> {post.caption}
                        </p>
                        }
                        {comments.map((comment , i) => (
                            <p key={i} className="postCaption">
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
		    </div>
        </div>
    )
}

export default SinglePost
