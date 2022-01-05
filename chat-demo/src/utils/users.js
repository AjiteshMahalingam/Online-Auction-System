const users = [];

const addUser = ({id, username, room}) => {
    // clean data
    username = username.trim().toLowerCase();
    username = username.slice(0,1).toUpperCase() + username.slice(1);
    room = room.trim().toLowerCase();
    room = room.slice(0,1).toUpperCase() + room.slice(1);

    // Validating data
    if(!username || !room){
        return {
            error : "Username and room is required"
        }
    }

    // Check and Validate for existing user
    const existingUser = users.find((user) => {
        return user.room == room && user.username == username
    });
    if(existingUser){
        return {
            error : "Username is in use"
        }
    }

    //Add user
    const user = {id, username, room};
    users.push(user);
    return {user};
};

const removeUser = (id) => {
    const removeidx = users.findIndex((user) => user.id === id);
    if(removeidx !== -1)
        return users.splice(removeidx, 1)[0];
};

const getUser = (id) => {
    return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room);
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}