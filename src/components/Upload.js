import React, { useState } from "react";
import { db, storage } from "../firebase";
import firebase from "firebase";

import "./Upload.css";

function Upload({ user }) {
	const [caption, setCaption] = useState("");
	const [image, setImage] = useState(null);
	const [url, setUrl] = useState("");
	const [progress, setProgress] = useState(0);

	const handleFileChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
    };

    // function getPhoto(){
    //     if (user) {
    //         return (user.photoURL || `https://avatars.dicebear.com/api/gridy/${user.email}.svg`);
    //     }
    // }

    // console.log(getPhoto());
    

	const handleUpload = () => {
		const uploadTask = storage.ref(`images/${image.name}`).put(image);
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgress(progress);
			},
			(error) => {
				console.log(error);
				alert(error.message);
			},
			() => {
				storage
					.ref("images")
					.child(image.name)
					.getDownloadURL()
					.then((url) => {
						db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            avatar: user.photoURL || `https://avatars.dicebear.com/api/gridy/${user.email}.svg`,
							caption: caption,
							imageUrl: url,
							username: user.displayName || user.email.split('@')[0],
						});
						setProgress(0);
						setCaption("");
						setImage(null);
					});
			}
		);
	};

	return (
		<div className="upload">
			<progress className="uploadProgress" value={progress} max="100"></progress>
			<input
				type="text"
				placeholder="Enter a caption..."
				onChange={(event) => setCaption(event.target.value)}
				value={caption}
			/>
			<input type="file" onChange={handleFileChange} />
			<button type="submit" onClick={handleUpload} className="postButton">
				Post
			</button>
		</div>
	);
}

export default Upload;
