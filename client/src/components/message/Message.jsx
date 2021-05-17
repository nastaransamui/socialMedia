import "./message.css";
import { format } from "timeago.js";

const Message = ({ message, own }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img src={PF + `person/1.jpeg`} alt="" className="messageImg" />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageButtom">{format(message.createdAt)}</div>
    </div>
  );
};

export default Message;