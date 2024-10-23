import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useState } from "react";

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: grey;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const TextArea = styled.textarea`
  padding: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  border: 2px solid white;
  border-radius: 10px;
  outline: none;
  box-sizing: border-box;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &:focus {
    border-color: #1d9bf0;
  }
`;

const FileInput = styled.input`
  margin-top: 10px;
  font-size: 12px;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const [isEditing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweet);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setNewPhoto(files[0]);
    }
  };

  const onEdit = () => {
    setEditing(true);
  };

  const onEditSubmit = async () => {
    if (
      user?.uid !== userId ||
      newTweet.length > 180 ||
      newTweet === ""
    )
      return;
    if (newPhoto) {
      console.log("New photo uploading...");
      const newPhotoRef = ref(storage, `tweets/${user.uid}/${id}`);

      try {
        // Upload new photo
        const result = await uploadBytes(newPhotoRef, newPhoto);
        const url = await getDownloadURL(result.ref);
        console.log("New photo uploaded and URL fetched: ", url);

        // Update Firestore document with new photo URL
        await updateDoc(doc(db, "tweets", id), { photo: url });
      } catch (e) {
        console.error("Error during the upload process: ", e);
        return; // Exit the function on error
      }
    } else {
      console.log("No new photo provided, skipping upload.");
    }

    try {
      // Update Firestore document with new tweet
      await updateDoc(doc(db, "tweets", id), { tweet: newTweet });
      setEditing(false);
    } catch (e) {
      console.error("Error updating the tweet in Firestore:", e);
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEditing ? (
          <>
            <TextArea
              value={newTweet}
              onChange={(e) => setNewTweet(e.target.value)}
            />
            <FileInput
              onChange={onFileChange}
              type="file"
              id="file"
              accept="image/*"
            />
            <EditButton onClick={onEditSubmit}>Submit Edit</EditButton>
          </>
        ) : (
          <>
            <Payload>{tweet}</Payload>
            {user?.uid === userId ? (
              <>
                <DeleteButton onClick={onDelete}>Delete</DeleteButton>
                <EditButton onClick={onEdit}>Edit</EditButton>
              </>
            ) : null}
          </>
        )}
      </Column>
      {photo && !isEditing ? (
        <Column>
          <Photo src={photo} />
        </Column>
      ) : null}
    </Wrapper>
  );
}
