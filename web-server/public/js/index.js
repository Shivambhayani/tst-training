// console.log('Client side js loaded');

// fetch(`https://puzzle.mead.io/puzzle`)
//     .then((res) => {
//         res.json().then((data) => {
//             console.log(data);
//         })
//     })
//     .catch(err => console.log(err))

const weatherform = document.querySelector('form');
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messagetwo = document.querySelector('#message-2')



weatherform.addEventListener('submit', (e) => {
    e.preventDefault()
    const location = search.value;

    messageOne.textContent = 'Loading..'
    messagetwo.textContent = ''

    fetch(`http://localhost:3000/weather?address=${location}`)
        .then((res) => {
            res.json()
                .then((data) => {
                    if (data.error) {
                        messageOne.textContent = data.error;
                    } else {
                        messageOne.textContent = data.location;
                        messagetwo.textContent = data.forecast
                        console.log(data.location);
                        console.log(data.forecast);
                    }
                }
                )
        })

})