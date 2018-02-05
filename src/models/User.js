const list = [
  { 
    id: 1,
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President'
  },
  {
    id: 2,
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  },
  {
    id: 3,
    name: 'Chris Jackson 1',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  },
  {
    id: 4,
    name: 'Chris Jackson 2',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  },
  {
    id: 5,
    name: 'Chris Jackson 3',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  },
  {
    id: 6,
    name: 'Chris Jackson 4',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  },
  {
    id: 7,
    name: 'Chris Jackson 5',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  },
  {
    id: 8,
    name: 'Chris Jackson 6',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  },
  {
    id: 9,
    name: 'Chris Jackson 7',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  },
  {
    id: 10,
    name: 'Chris Jackson 8',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  }
]

class User {
  id = 0
  name = ""

  constructor(name, avatar_url){
    this.name = name
    this.avatar_url = avatar_url
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
