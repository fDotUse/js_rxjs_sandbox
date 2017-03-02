import $ from 'jquery';
import Rx from 'rxjs/Rx';

// Observables of Events
// could attach to any event that the browser generates, (click, keyup, mousemove,etc...)
const btn = $('#btn')
const btnStream$ = Rx.Observable.fromEvent(btn, 'click');
btnStream$.subscribe(
  function(e) {
    console.log(e)
  },
  function(err) {
    console.log(err)
  },
  function() {
    console.log('completed!')
  }
)

// Observable of Arrays
const numbers = [1,2,3,4,5,6,7,8,9,10]
const numbers$ = Rx.Observable.from(numbers)

numbers$.subscribe(
  v => console.log(v),
  err => console.log(err),
  () => console.log('completed')
)

const posts = [
  { title: 'Sergio', text: 'my first post' },
  { title: 'Sergio', text: 'my second post' },
  { title: 'Sergio', text: 'my third post' },
  { title: 'Sergio', text: 'my forth post' },
]

const posts$ = Rx.Observable.from(posts)
posts$.subscribe(
  post => $('#posts').append(`<li><h3>${post.title}</h3><p>${post.text}</p></li>`),
  err => console.log(err),
  () => console.log('completed')
)

// Custom Observables
const source$ = new Rx.Observable(  
  observer => {
    console.log('Custom Observable')
    observer.next('Hello world')
    observer.next('Another Value')
    observer.error(new Error('something went wrong'))
    observer.next('Another Value After Error') // this will not run
    observer.complete()
  }
)

source$
.catch(err => Rx.Observable.of(err)) // this will allow the observable to continue to complete if not it will stop at the error
.subscribe(
  x => console.log(x),
  err => console.log(err),
  () => console.log('completed custom observable!')
)

// Observable of Promises
const myPromise = new Promise((resolve, reject) => {
  console.log('Promise Created')
  setTimeout(() => {
    resolve('Promise has finished')
  }, 3000)
})

const promiseSource$ = Rx.Observable.fromPromise(myPromise)
promiseSource$.subscribe(result => console.log(result))

function getUser(username) {
  return $.ajax({
    url: `https://api.github.com/users/${username}`,
    dataType: 'jsonp'
  }).promise()
}

Rx.Observable.fromPromise(getUser('smartinsantos'))
.subscribe(
  (res) => {
  let user = res.data
  $('#user').append(`
  <h3>${user.name}</h3>
  <p>${user.location}</p>
  <a href='${user.url}'>${user.url}</a>
  `),
  (err) => console.log(err),
  () => console.log('finished!')
})
