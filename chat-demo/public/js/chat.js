const socket = io();

//Elements
const $msgForm = document.querySelector('#msg-form');
const $msgFormInput = document.querySelector('input');
const $msgFormSubmit = document.querySelector('#submit');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix : true});

//Auto-scroll
const autoscroll = () => {

    
    // New message element
    const $newMessage = $messages.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = $messages.offsetHeight;

    // Height of messages container
    const containerHeight = $messages.scrollHeight;

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
}

// Socket Event Listeners
socket.on('message', (msg) => {
    console.log(msg);
    const html = Mustache.render(messageTemplate, {
        username : msg.username,
        message: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

socket.on('locationMessage', (location) => {
    console.log(location);
    const html = Mustache.render(locationTemplate, {
        username : location.username,
        url : location.url,
        createdAt : moment(location.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);    
    autoscroll();
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML = html;
})

// Client-side Event Listeners
$msgForm.addEventListener('submit', (e) => {
    //Prevents refresh every time form submitted
    e.preventDefault();
    const msg = $msgFormInput.value;

    $msgFormSubmit.setAttribute('disabled', 'disabled');
    $msgFormInput.value = '';
    $msgFormInput.focus();
    
    socket.emit('sendMessage', msg, (err) => {
        $msgFormSubmit.removeAttribute('disabled');
        if(err)
            return alert(err);
        console.log('Delivered');
    });
});

$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation)
        return alert('Geolocation services not available in your browser');
    
    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude : position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled');
            console.log('Location shared');
        });
    })
});

// Socket Events Emitters
socket.emit('join', {username, room}, (error) => {
    if(error){
        alert(error);
        // Client-side redirection
        location.href = '/';
    }
});