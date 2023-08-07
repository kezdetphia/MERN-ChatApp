const Avatar=({username, userId})=>{ 
  const colors = ['bg-red-400','bg-green-400','bg-purple-400','bg-blue-400','bg-orange-400','bg-pink-400']
  
  const userIdBase = parseInt(userId, 16)
  const randomColor= colors[userIdBase % colors.length]
  console.log(randomColor)

  return(
    <div className={`w-8 h-8  rounded-full flex items-center ${randomColor}`}>
      <div className="text-center w-full opacity-70 ">
        {username[0]}

      </div>
    </div>
  )
}

export default Avatar;