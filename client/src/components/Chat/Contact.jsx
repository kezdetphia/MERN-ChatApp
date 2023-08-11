import Avatar from "./Avatar";

const Contact = ({ id, onClick, selected, username, online }) => {
  return (
    <div
      key={id}
      onClick={() => onClick(id)}
      className={
        "border-b border-gray-100 flex items-center gap-2 cursor-pointer " +
        (selected? "bg-blue-200" : "")
      }
    >
      {selected && (
        <div className=" w-1 bg-blue-500 h-12 rounded-r-md "></div>
      )}

      <div className="flex gap-2 py-2 pl-4 items-center">
        <Avatar online={online} username={username} userId={id} />
        <span className="text-gray-500 font-bold">{username}</span>
      </div>
    </div>
  );
};

export default Contact; 
