import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";

const Conversation = ({ conversation, currentUser }) => {
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  useEffect(() => {
    let isMount = true;
    if (isMount) {
      const friendId = conversation.members.find((m) => m !== currentUser._id);
      const getUser = async () => {
        const res = await axios.get(`/users?userId=${friendId}`);
        setUser(res.data);
      };
      getUser();
    }
    return () => {
      isMount = false;
    };
  }, [conversation, currentUser]);

  return (
        <div className="conversation">
          <img
            src={
              user?.profilePicture
                ? PF + `${user.profilePicture}`
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="conversationImg"
          />
          <span className="conversationName">{user?.username}</span>
        </div>
  );
};

export default Conversation;
