import React, { useState, useContext } from "react";
import InfoIcon from "@mui/icons-material/Info";
import { Button,TextField } from "@material-ui/core";
import Comment from "../../components/comment/comment.jsx";
import { IconButton } from "@material-ui/core";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useHistory } from "react-router-dom";
import axios from "axios";
import './sidebar.scss';
import { useParams } from 'react-router-dom';
import { AuthContext } from "../../Context/Authcontext";

function Sidebar(props) {
  console.log(props);
  const [comment, setComment] = useState(null);
  const { user, isAdmin } = useContext(AuthContext);
  const { id } = useParams();
  let history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!comment){
      alert("Please comment first!");
      return;
    }
    console.log(comment);
    const res = await axios
      .post("http://localhost:8080/api/posts/comment",{user:user,comment:comment, postId:id}, {
        withCredentials: true,
      })
      .catch((err) => console.log(err));
    
      if(res){
        console.log(res);
        if(res.data.success)  props.fetchPosts();
        else  alert(res.data.message);
      }
  };
  return (
    <div>
      <div className="sidebar">
        <div className="icons">
          <div>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
            <IconButton aria-label="favorite" disabled = {isAdmin}>
              <FavoriteIcon />
            </IconButton>
          </div>
          <div>
            <Button
              variant="outlined"
              startIcon={<InfoIcon />}
              style={{
                color: "rgba(0,0,0,0.54)",
                borderColor: "rgba(0,0,0,0.54)",
              }}
            >
              Details
            </Button>
          </div>
        </div>
        <br />
        <h2>Feedback</h2>
        {props.comment.map((data) => {
          return (
            <Comment
              imgUrl={data.commenterImg.profileImgUrl}
              name={data.commentData.username}
              comment={data.commentData.commentData}
            />
          );
        })}
        <form onSubmit={handleSubmit} style={{width:"100%"}}>
        {(user && !isAdmin) && <> <TextField
          fullWidth
          variant="outlined"
          label="Write a  Comment"
          margin="normal"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
          <Button style={{ backgroundColor: "#22577A", textTransform: "none", color: "white" }}
            type="submit"
            variant="outlined" >
            Comment
          </Button></>}
        </form>
      </div>
    </div>
  );
}

export default Sidebar;
