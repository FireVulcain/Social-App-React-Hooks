import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

//context
import { withFirebase } from "../../config/Firebase/context";

// Material UI
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const DisplayReply = ({ firebase, postId }) => {
    const [comments, setComments] = useState([]);
    dayjs.extend(relativeTime);

    useEffect(() => {
        const getComments = async () => {
            const result = await firebase.firestore.collection("comments").where("postId", "==", postId);

            result.onSnapshot((querySnapshot) => {
                const comments = [];
                querySnapshot.forEach((doc) => {
                    comments.push(doc.data());
                });
                setComments(comments);
            });
        };

        getComments();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {comments
                ? comments.map((comment, key) => {
                      return (
                          <Box width={1} display="flex" alignItems="flex-start" className="post-info post-reply" key={key}>
                              <Box mr={2} className="user-info">
                                  <Link to={`/user/${comment.userName}`}>
                                      <Avatar alt={comment.userName} src={comment.userImage} className="avatar" />
                                  </Link>
                              </Box>
                              <Box>
                                  <Box display="flex" alignItems="center">
                                      <Link to={`/user/${comment.userName}`}>
                                          <Typography variant="h6" component="span" className="post-username">
                                              {comment.userName}
                                          </Typography>
                                      </Link>
                                      <Typography variant="body2" component="p" className="post-date">
                                          {dayjs(comment.createdAt).fromNow(true)}
                                      </Typography>
                                  </Box>
                                  <Typography variant="body2" component="p" className="post-reply-to">
                                      Replying to <Link to={`/user/${comment.userName}`}>@{comment.userName}</Link>
                                  </Typography>
                                  <Typography variant="body1" component="p">
                                      {comment.body}
                                  </Typography>
                              </Box>
                          </Box>
                      );
                  })
                : null}
        </>
    );
};

export default withFirebase(DisplayReply);
