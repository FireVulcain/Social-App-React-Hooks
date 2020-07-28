import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

//Component
import { UserAvatar } from "./Post/UserAvatar";
import { PostBody } from "./Post/PostBody";
import { CommentMenuAction } from "./Comment/CommentMenuAction";

//context
import { withFirebase } from "../../config/Firebase/context";

// Material UI
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const DisplayReply = ({ firebase, postId, commentCount }) => {
    const [comments, setComments] = useState([]);
    dayjs.extend(relativeTime);

    useEffect(() => {
        const result = firebase.firestore
            .collection("comments")
            .where("postId", "==", postId)
            .onSnapshot((querySnapshot) => {
                const comments = [];
                querySnapshot.forEach((doc) => {
                    let commentData = doc.data();
                    commentData.commentId = doc.id;
                    comments.push(commentData);
                });
                setComments(comments);
            });

        return () => {
            result();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {comments
                ? comments.map((comment) => {
                      return (
                          <Box width={1} display="flex" alignItems="flex-start" className="post-info post-reply" key={comment.commentId}>
                              <UserAvatar userImage={comment.userImage} userName={comment.userName} />
                              <Box>
                                  <Box display="flex" alignItems="center">
                                      <Link to={`/user/${comment.userName}`}>
                                          <Typography variant="h6" component="span" className="post-displayed-name">
                                              {comment.displayedName}
                                          </Typography>
                                          <Typography variant="body2" component="span" className="post-username">
                                              @{comment.userName} <span className="spacer"> · </span>
                                          </Typography>
                                      </Link>
                                      <Typography variant="body2" component="p" className="post-date">
                                          {dayjs(comment.createdAt).fromNow(true)}
                                      </Typography>

                                      <CommentMenuAction
                                          commentUsername={comment.userName}
                                          postId={comment.postId}
                                          commentId={comment.commentId}
                                          commentCount={commentCount}
                                      />
                                  </Box>
                                  <Typography variant="body2" component="p" className="post-reply-to">
                                      Replying to <Link to={`/user/${comment.userName}`}>@{comment.userName}</Link>
                                  </Typography>
                                  <PostBody body={comment.body} postImg={comment.postImg} />
                              </Box>
                          </Box>
                      );
                  })
                : null}
        </>
    );
};

export default withFirebase(DisplayReply);
