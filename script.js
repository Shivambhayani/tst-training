'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const dotconinter = document.querySelector('.dots');


const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//     btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

//  scrolling

const btnscrollto = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnscrollto.addEventListener('click', function (e) {
    e.preventDefault()
    const s1coords = section1.getBoundingClientRect();
    console.log(s1coords);

    console.log(e.target.getBoundingClientRect());
    console.log('current scroll (x/y)', window.pageXOffset, window.pageYOffset);
    console.log('height/width', document.documentElement.clientHeight, document.documentElement.clientWidth);

    //  old way
    // window.scrollTo({
    //     left: s1coords.left + window.pageXOffset,
    //     top: s1coords.top + window.pageYOffset,
    //     behavior: 'smooth'
    // })

    // modren way
    section1.scrollIntoView({ behavior: 'smooth' });


});

//  page navigation
// 1 add event listner to comman parent elemnt

document.querySelector('.nav__links').addEventListener('click', function (e) {
    // console.log(e.target);
    e.preventDefault()

    // matching
    if (e.target.classList.contains('nav__link')) {
        // console.log('link');
        const id = e.target.getAttribute('href');
        console.log(id);
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });

    }
})


//  Tabbed components
const tabs = document.querySelectorAll('.operations__tab');

const tabContainer = document.querySelector('.operations__tab-container');

const tabContent = document.querySelectorAll('.operations__content');

// tabs.forEach(t => t.addEventListener('click', () => console.log('tab')));

tabContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');

    //  Guard clause
    if (!clicked) return;

    //  remove active class
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabContent.forEach(c => c.classList.remove('operations__content--active'));

    //  Actibe tab

    clicked.classList.add('operations__tab--active');

    //  active contain area
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
});

//  Menu fade animation

//  handle the hover  we use this keyword for the opacity 
const handlehover = function (e) {
    // console.log(this, e.currentTarget);
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = link.closest('.nav').
            querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img')

        siblings.forEach(el => {
            if (el !== link) el.style.opacity = this;
        });
        logo.style.opacity = this;
    };
};

//  passing "argument" into handler  bind method used for creta new method

nav.addEventListener('mouseover', handlehover.bind(0.5));

nav.addEventListener('mouseout', handlehover.bind(1));

// sticky navigation
// window.addEventListener('scroll', function () {
//     console.log(this.window.scrollY);
// })


// intersection  observer api
// const obsCallback = function () { };
// const obsOptions = {};

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);


const headers = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickyNav = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`
});
headerObserver.observe(headers);

//  Revel section
const allsection = document.querySelectorAll('.section')
const revelsection = function (entries, observe) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observe.unobserve(entry.target);
}

const sectionobserver = new IntersectionObserver(revelsection, {
    root: null,
    threshold: 0.15,
})
allsection.forEach(function (section) {
    sectionobserver.observe(section);
    section.classList.add('section--hidden');
});

//  Lazy-loading images
const imgtargets = document.querySelectorAll('img[data-src]');

const loading = function (entries, observe) {
    const [entry] = entries;
    // console.log(entry);

    if (!entry.isIntersecting) return;

    //  replace src with data-src
    entry.target.src = entry.target.dataset.src;


    entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img')
    })

    observe.unobserve(entry.target);

}

const imgObserver = new IntersectionObserver(loading, {
    root: null,
    threshold: 0
});

imgtargets.forEach(img => imgObserver.observe(img))

//  slider
const slides = document.querySelectorAll('.slide')
// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.2) transletx(-800px)';
// slider.style.overflow = 'visible';
// slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
const btnleft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let curSlide = 0;
const maxslide = slides.length;

//  dots
const createdots = function () {
    slides.forEach(function (_, i) {
        dotconinter.insertAdjacentHTML(
            `beforeend`, `<button class="dots__dot" data-slide="${i}"></button>`
        );
    });
};
createdots()

//  active dots
const activeDot = function (slide) {
    document.querySelectorAll('.dots__dot')
        .forEach(dot => dot.classList.remove('dots__dot--active'))

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
};
activeDot(0);
// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.7) translateX(400px)'
// slider.style.overflow = 'visible';

const goToSlide = function (slide) {
    slides.forEach(
        (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
};
goToSlide(0)

//  next slide

const nextSlide = function () {
    if (curSlide === maxslide - 1) {
        curSlide = 0;
    } else {
        curSlide++;
    }
    goToSlide(curSlide);
    activeDot(curSlide);
}

const prevslide = function () {
    if (curSlide === 0) {
        curSlide = maxslide - 1;
    }
    else {
        curSlide--;
    }
    goToSlide(curSlide);
    activeDot(curSlide);
}

btnleft.addEventListener('click', nextSlide)
btnRight.addEventListener('click', prevslide)

document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowLeft') prevslide();
    e.key === 'ArrowRight' && nextSlide();
})


dotconinter.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
        const { slide } = e.target.dataset;
        goToSlide(slide);
        activeDot(slide);
    }
})



//  selecting elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);


// const allsection = document.querySelectorAll('section');
// console.log(allsection);

// document.getElementById('section--1');
// const allbuttons = document.getElementsByTagName('button');
// console.log(allbuttons);

// console.log(document.getElementsByClassName('btn'));

//  crating and inserting element
const header = document.querySelector('.header');

const message = document.createElement('div');
message.classList.add('cookie-message');

message.innerHTML =
    ' we use cookei for improving your expireance  and alaytics. <button class="btn btn--close--cookie"> Got it! </button> ';

header.append(message)
// header.prepend(message)
// header.before(message)
// header.after(message)

//  delete element
document.querySelector('.btn--close--cookie')
    .addEventListener('click', function () {
        message.remove()
    })

// styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%'

// console.log(message.style.color);

// document.documentElement.style.setProperty('--color-primary', 'o rangered');
//  attribute
// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));
// console.log(logo.getAttribute('src'));

//  data attribute
// console.log(logo.dataset.versionNumber);

//  class
// logo.classList.add()
// logo.classList.remove()
// logo.classList.toggle()
// logo.classList.contain()


// const h1 = document.querySelector('h1');
// const alerth1 = function (e) {
//     alert('addEventListner: Great! You are in add event listner ');
// }
// h1.addEventListener('mouseenter', alerth1);
// setTimeout(() => h1.removeEventListener('mouseenter', alerth1), 3000)


//  Dom Traversing
const h1 = document.querySelector('h1');

//  going downwards:child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);

// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// //  going upwards : parents
// h1.closest('.header').style.background = 'white'

// console.log(h1.parentNode);
// console.log(h1.parentElement);

//  sideways : siblings
// console.log(h1.previousSibling);








//   Arguments
// const addex = function () {
//     console.log(arguments);
// }
// addex(100, 200)
// console.log(addex(100, 200, 300));

//  this
// const abc = {
//     fname: 'joans',
//     year: 1990,
//     calage: function () {
//         console.log(2030 - this.year);

//         //  solution 1
//         const self = this;
//         const isregular = function () {
//             console.log(self);
//             console.log(self.year);
//         };
//         isregular()


//         const isarrow = () => {
//             console.log(this);
//             console.log(this.year >= 1981 && this.year <= 1996);
//         }
//         isarrow();
//     }
// }
// abc.calage()

//  life cycle of dom
document.addEventListener('DOMContentLoaded', function (e) {
    console.log('Html parsed and dom tree built!', e);
})

window.addEventListener('load', function (e) {
    console.log('page fully loaded', e);
})

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    console.log(e);
    e.returnValue = '';
})