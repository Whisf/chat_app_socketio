const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const { username, room, userId } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    $messages.scrollTo(0, $messages.scrollHeight)
}
const connectToSocket = async () => {
    await socket.emit('join', { username, room }, (error) => {
        if (error) {
            alert(error)
            location.href = '/'
        }
    })

    console.log(45);

        fetch(`http://localhost:3000/rooms/${room}`, {
            method: 'GET',
            mode: 'cors'
        }).then(res => res.json()).then((data) => {
            console.log(12);
            const messages = data.data.messages
            messages.forEach((message) => {
                const html = Mustache.render(messageTemplate, {
                    username: message.username,
                    message: message.text,
                    createdAt: moment(message.createdAt).format('h:mm a')
                })
                $messages.insertAdjacentHTML('beforeend', html)
            })
            $messages.scrollTo(0, $messages.scrollHeight)
        })
    

    
    socket.on('message', (message) => {
        console.log(message);
        const html = Mustache.render(messageTemplate, {
            username: message.username,
            message: message.text,
            createdAt: moment(message.createdAt).format('MMMM Do, h:mm a')
        })
        $messages.insertAdjacentHTML('beforeend', html)
        $messages.scrollTo(0, $messages.scrollHeight)
    })
    
    socket.on('locationMessage', (message) => {
        const html = Mustache.render(locationMessageTemplate, {
            username: message.username,
            url: message.url,
            createdAt: moment(message.createdAt).format('h:mm a')
        })
        $messages.insertAdjacentHTML('beforeend', html)
        $messages.scrollTo(0, $messages.scrollHeight)
    })
    
    socket.on('roomData', ({ room, users, userId }) => {
        const html = Mustache.render(sidebarTemplate, {
            room,
            users: users
        })
        document.cookie = `userId=${userId}`
        document.querySelector('#sidebar').innerHTML = html
    })
}

connectToSocket()

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    const cookie = document.cookie
    const userId = cookie.substring(cookie.indexOf('=') + 1)

    socket.emit('sendMessage', {userId, message, room}, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

// var skip = 0 
// $messages.addEventListener("wheel", function(event){
//     if(event.deltaY < 0) {
//         skip += 1
//         socket.emit('oldMessage', {room, skip}, (err) => {
//             console.log(err);
//         })
//     }
// });


$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')  
        })
    })
})

