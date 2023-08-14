const Avatar=({username, userId, online})=>{ 


  const colors = ['bg-red-400','bg-green-400','bg-purple-400','bg-blue-400','bg-orange-400','bg-pink-400']
  
  const userIdBase = parseInt(userId, 16);
  const randomColor = colors[userIdBase % colors.length];

  return(
    <div className={`w-8 h-8 relative rounded-full flex items-center ${randomColor}`}>
      <div className="text-center w-full opacity-70 ">{username[0]}</div>
      {online ? (
        <div className="absolute w-3 h-3 bg-green-500 -bottom-0 -right-0 rounded-full border border-white "></div>
        ):
        <div className="absolute w-3 h-3 bg-gray-400 -bottom-0 -right-0 rounded-full border border-white "></div>
        
    }
    </div>
  )
  }

export default Avatar;