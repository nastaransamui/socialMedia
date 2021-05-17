import "./online.css";

const Online = ({ Users }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <li className="rightbarFriend" key={Users.id}>
      <div className="rightbarProfileImgContainer">
        <img src={PF +Users.profilePicture} alt="" className="rightbarProfileImg" />
        <span className="rightBarOnline"></span>
      </div>
      <span className="rightbarUsername">{Users.username}</span>
    </li>
  );
};

export default Online;
