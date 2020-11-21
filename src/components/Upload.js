import React, { useState } from "react";
import { db, storage } from "../firebase";
import firebase from "firebase";

import "./Upload.css";

function Upload({ user }) {
	const [caption, setCaption] = useState("");
	const [image, setImage] = useState(null);
	const [file, setFile] = useState(null);
	const [progress, setProgress] = useState(0);

	const handleFileChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
		setFile(URL.createObjectURL(e.target.files[0]));
    };


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
			<div className="postHeader">
				<h3 className="uploadPreview">POST PREVIEW</h3>
			</div>
			
			<img className="postImage" src={file}/>
			<input 
				className="uploadCaption"
				type="text"
				placeholder="Enter a caption..."
				onChange={(event) => setCaption(event.target.value)}
				value={caption}
			/>
			<div className="uploadButtons">
				<label for="file-upload" className="customFileUpload">
					<i class="fas fa-file-upload"></i> Upload Image
				</label>
				<input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} />
				<button type="submit" onClick={handleUpload} className="postButton">
					Post
				</button>
			</div>
			<progress className="uploadProgress" value={progress} max="100"></progress>
		</div>
	);
}

export default Upload;
