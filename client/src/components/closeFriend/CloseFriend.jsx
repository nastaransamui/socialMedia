import "./closefriend.css";

const CloseFriend = ({User}) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <li className="sidebarFriend">
      <img src={PF +User.profilePicture} alt="" className="sidebarFriendImage" />
      <span className="sidebarFriendName">{User.username}</span>
    </li>
  );
};

export default CloseFriend;
