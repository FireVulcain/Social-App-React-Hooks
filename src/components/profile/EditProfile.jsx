import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

//Mui stuff
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";

const EditProfile = ({ firebase, open, handleClose, user }) => {
    const [profileName, setProfileName] = useState("");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [website, setWebsite] = useState("");

    const [userImagePreview, setUserImagePreview] = useState("");
    const [userImage, setUserImage] = useState("");

    const [userBannerPreview, setUserBannerPreview] = useState("");
    const [bannerImage, setBannerImage] = useState("");

    useEffect(() => {
        setProfileName(`${user.displayedName}`);
        setBio(user.bio);
        setLocation(user.location);
        setWebsite(user.website);
        setUserImagePreview(user.userImage);
        setUserBannerPreview(user.userBanner);
    }, [user]);

    const handleUpdateProfilePic = (e) => {
        let image = e.target.files[0];

        setUserImage(image);
        setUserImagePreview(URL.createObjectURL(image));
    };
    const handleUpdateBanner = (e) => {
        let image = e.target.files[0];

        setBannerImage(image);
        setUserBannerPreview(URL.createObjectURL(image));
    };

    const updateProfile = async () => {
        let uploadProfilePicURL = user.userImage;
        let uploadBannerURL = user.userBanner;

        if (userImage) {
            //Delete previous img
            const storageProfilePicture = await firebase.storage.refFromURL(uploadProfilePicURL);
            storageProfilePicture.delete();

            //Upload new img
            const fileExtension = userImage.name.split(".").pop();
            const randomName = `${uuidv4()}.${fileExtension}`;
            const uploadTask = await firebase.storage.ref(`${user.userName}/${randomName}`).put(userImage);

            uploadProfilePicURL = await uploadTask.ref.getDownloadURL();

            // Update new img
            const userPosts = await firebase.firestore.collection("posts").where("userName", "==", user.userName).get();
            userPosts.forEach((doc) => {
                doc.ref.update({
                    userImage: uploadProfilePicURL,
                });
            });
            const userComents = await firebase.firestore.collection("comments").where("userName", "==", user.userName).get();
            userComents.forEach((doc) => {
                doc.ref.update({
                    userImage: uploadProfilePicURL,
                });
            });
        }

        if (bannerImage) {
            //Delete previous img
            const storageBanner = await firebase.storage.refFromURL(uploadBannerURL);
            storageBanner.delete();

            //Upload new img
            const fileExtension = bannerImage.name.split(".").pop();
            const randomName = `${uuidv4()}.${fileExtension}`;
            const uploadTask = await firebase.storage.ref(`${user.userName}/${randomName}`).put(bannerImage);

            uploadBannerURL = await uploadTask.ref.getDownloadURL();
        }

        if (user.displayedName !== profileName) {
            // Update new name
            const userPosts = await firebase.firestore.collection("posts").where("userName", "==", user.userName).get();
            userPosts.forEach((doc) => {
                doc.ref.update({
                    displayedName: profileName,
                });
            });

            const userComents = await firebase.firestore.collection("comments").where("userName", "==", user.userName).get();
            userComents.forEach((doc) => {
                doc.ref.update({
                    displayedName: profileName,
                });
            });
        }

        // Update user
        await firebase.firestore.collection("users").doc(user.userName).update({
            bio: bio,
            displayedName: profileName,
            location: location,
            website: website,
            userImage: uploadProfilePicURL,
            userBanner: uploadBannerURL,
        });

        return handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} className="dialogbox edit-profile">
            <DialogTitle>Edit profile</DialogTitle>
            <DialogContent>
                <div
                    className="update-banner"
                    style={{
                        backgroundImage: `url(${userBannerPreview})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    <div className="layer"></div>
                    <input
                        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
                        hidden
                        id="icon-button-edit-banner"
                        type="file"
                        onChange={handleUpdateBanner}
                    />
                    <label htmlFor="icon-button-edit-banner">
                        <IconButton className="upload-img" aria-label="upload image" component="span">
                            <PhotoCameraIcon />
                        </IconButton>
                    </label>
                </div>

                <div className="edit-profile-info">
                    <div
                        className="update-profile-pic"
                        style={{
                            backgroundImage: `url(${userImagePreview})`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        <div className="layer"></div>
                        <input
                            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
                            hidden
                            id="icon-button-edit"
                            type="file"
                            onChange={handleUpdateProfilePic}
                        />
                        <label htmlFor="icon-button-edit">
                            <IconButton className="upload-img" aria-label="upload image" component="span">
                                <PhotoCameraIcon />
                            </IconButton>
                        </label>
                    </div>
                    <TextField type="text" label="Name" onChange={(e) => setProfileName(e.target.value)} value={profileName} className="text-field" />
                    <TextField type="text" label="Bio" onChange={(e) => setBio(e.target.value)} value={bio} multiline className="text-field" />
                    <TextField type="text" label="Location" onChange={(e) => setLocation(e.target.value)} value={location} className="text-field" />
                    <TextField type="text" label="Website" onChange={(e) => setWebsite(e.target.value)} value={website} className="text-field" />
                </div>
            </DialogContent>
            <DialogActions className="delete-action">
                <Button onClick={handleClose} className="btn cancel">
                    Cancel
                </Button>
                <Button className="btn save" onClick={updateProfile}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfile;
