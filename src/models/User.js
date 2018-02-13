class User {
  id = 0
  name = ""
  email = ""
  birthday = ""
  imageUrl = ""

  constructor(name){
    this.name = name
  }

  static all(){
    var users = []

    list.forEach(function(element) {
      let user = new User(element.name, element.avatar_url)
      
      users.push(user)
    }); 

    return users
  }
  
  static filter(keyword){
    let users = User.all()
    var data = []    

    if(keyword){
      var usersFiltered = users.filter(function (user) {
        return user.name.toLowerCase() == keyword.toLowerCase() 
          || user.name.toLowerCase().includes(keyword.toLowerCase());
      })

      data = usersFiltered
    } else {
      data = users     
    }

    return data
  }

}

export default User
