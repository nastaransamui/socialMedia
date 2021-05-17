import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";

const Messenger = () => {
  const [conversation, setConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMassage, setArrivalMassage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      socket.current = io("ws://localhost:8900");
      socket.current.on("getMessage", (data) => {
        setArrivalMassage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      });
    }
    return () => {
      isMount = false;
    };
  }, []);

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      socket.current.emit("addUser", user._id);
      socket.current.on("getUsers", (users) => {
        setOnlineUsers(user.followings.filter(f => users.some(u => u.userId === f)))
        // setOnlineUsers(users);
      });
    }
    return () => {
      isMount = false;
    };
  }, [user]);

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      const getConversations = async () => {
        try {
          const res = await axios.get(`/conversations/${user._id}`);
          setConversation(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      getConversations();
    }
    return () => {
      isMount = false;
    };
  }, [user._id]);

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      try {
        const getMessages = async () => {
          const res = await axios.get(`/messages/${currentChat?._id}`);
          setMessages(res.data);
        };
        getMessages();
      } catch (error) {
        console.log(error);
      }
    }
    return () => {
      isMount = false;
    };
  }, [currentChat]);

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    return () => {
      isMount = false;
    };
  }, [messages]);

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      arrivalMassage &&
        currentChat?.members.includes(arrivalMassage.sender) &&
        setMessages((prev) => [...prev, arrivalMassage]);
    }
    return () => {
      isMount = false;
    };
  }, [arrivalMassage, currentChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const message = {
      conversationId: currentChat._id,
      sender: user._id,
      text: newMessage,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );
    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });
    try {
      const res = await axios.post(`/messages`, message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              placeholder="Search for Friends"
              className="chatMenuInput"
            />
            {conversation.map((c) => (
              <div
                key={c._id}
                onClick={() => {
                  setCurrentChat(c);
                }}
              >
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m, i) => (
                    <div key={`${m._id}${i}`} ref={scrollRef}>
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxButtom">
                  <textarea
                    placeholder="write something"
                    className="chatMessageInput"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button
                    className="chatSubmitButton"
                    onClick={handleSendMessage}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noCoversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
