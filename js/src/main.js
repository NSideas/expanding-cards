
const siteTitle = document.querySelector('.site-title');
const cards = document.querySelectorAll('.card');
const cardWrapper = document.getElementById('card-wrapper');
const closeButton = document.getElementById('close-project');
const cardDelay = 250;
const projectCards = [];

const getProjectByUrl = () =>
  projectCards.filter(item => item.project === getUrlParameter('content'))[0];

const getProjectByElement = element =>
  projectCards.filter(item => item.el === element)[0];


let cardHeight, cardScale, gutter;

function calculateScale() {
  cardHeight = mq.medium.matches ? 480
             : mq.small.matches ? 360
             : 300;

  cardScale = mq.small.matches ? 0.95 : 0.925;
  gutter = cardWrapper.clientWidth * (1 - cardScale)/2;
}

const calculateDuration = element => {
  const distanceFromTop = element.getBoundingClientRect().top;
  const duration =  Math.abs(distanceFromTop) / 5 + 300;
  return Math.max(duration, 300);
}

function setWrapperHeight() {
  const wrapperHeight = cards.length * (cardHeight + gutter);
  cardWrapper.style.height = `${wrapperHeight}px`;
}

function positionCard(card) {
  // console.log('Positioning card');
  const index = childIndex(card);
  const header = document.getElementById('header');
  const hh = header ? header.clientHeight : 0;
  const y = hh + index * cardHeight;
  card.style.transform = `scaleX(${cardScale}) translateY(${y + gutter * index}px)`;
}

function renderNextLink(project) {
  const nextCard = cards[childIndex(project.el) + 1];
  if (nextCard !== undefined) {
    const nextProject = getProjectByElement(nextCard);

    const btnContainer = document.createElement('div');
    btnContainer.classList.add('btn-container');
    project.body.appendChild(btnContainer);

    const nextLink = document.createElement('a');
    nextLink.classList.add('btn-next-project');
    nextLink.innerHTML = 'Next Project';
    nextLink.href = nextProject.link;

    nextLink.addEventListener('click', event => {
      event.preventDefault();
      const lastCard = document.querySelector('.card.expanded');
      openCard(nextProject, true, 500);
      setTimeout(() => {
        closeCard(lastCard);
      }, 500);
    });

    btnContainer.appendChild(nextLink);
  }
}

function fetchProjectInfo(card) {
  // console.log('Fetching project info');
  fetch(`./pages/${card.project}.html`).then((response) => {
    return response.text();
  }).then((content) => {
    card.body.innerHTML += content;
    renderNextLink(card);
    setTimeout(() => {
      card.el.classList.add('content-loaded');
    }, 125);
  }).catch((err) => {
    console.log('Fetch Error', err);
  });
}

function openCard(card, push, duration = null) {
  // console.log('Opening card');
  if (push) {
    const stateObj = { content: card.project };
    history.pushState(stateObj, 'project page', card.link);
  }

  const transitionTime = duration ? duration : calculateDuration(card.el);
  const bodyWrapper = card.el.querySelector('.card-body--outer');
  card.el.style.transitionDuration = `${transitionTime}ms`;
  bodyWrapper.style.transitionDuration = `${transitionTime}ms`;

  card.el.classList.add('expanded', 'anim-in');
  card.el.style.transform = `scaleX(1) translateY(${window.pageYOffset}px)`;
  card.el.style.top = `-${window.pageYOffset}px`;
  bodyScrollLock.disableBodyScroll(card.el);
  document.body.classList.add('card-open');

  setTimeout(() => {
    card.el.classList.remove('anim-in');
    if (closeButton) {
      closeButton.classList.add('visible');
    }
  }, cardDelay);
  if (!card.el.classList.contains('content-loaded')) {
    fetchProjectInfo(card);
  }
}

function closeCard(card) {
  if (closeButton) closeButton.classList.remove('visible');
  card.scrollTop = 0;
  card.classList.add('anim-out');
  bodyScrollLock.enableBodyScroll(card);
  positionCard(card);
  setTimeout(() => {
    card.classList.remove('expanded', 'anim-out');
    card.style.top = `0`;
    if (!document.querySelector('.card.expanded')) {
      document.body.classList.remove('card-open');
    }
  }, cardDelay);
}

function closeCurrentCard() {
  const currentCard = document.querySelector('.card.expanded');
  if (currentCard) {
    closeCard(currentCard);
  }
}

function defaultHistoryState(push) {
  const stateObj = { content: 'project index' };
  if (push) {
    history.pushState(stateObj, document.title, 'index.html');
  } else {
    history.replaceState(stateObj, document.title, 'index.html');
  }
}

function ProjectCard(card) {
  this.el = card;
  this.header = card.querySelector('.card-header');
  this.body = card.querySelector('.card-body--inner');
  this.project = card.getAttribute('id');
  this.link = this.header.getAttribute('href');

  this.header.addEventListener('click', event => {
    event.preventDefault();
    if (!this.el.classList.contains('expanded')) {
      openCard(this, true);
    }
  });

}

function setUpCards() {
  // console.log('Setting up cards');
  calculateScale();
  setWrapperHeight();
  if (!getUrlParameter('content')) {
    defaultHistoryState();
  }
  for (let card of cards) {
    let newCard = new ProjectCard(card);
    projectCards.push(newCard);
    positionCard(card);
  }
}

function resetCards() {
  calculateScale();
  setWrapperHeight();
  for (let card of cards) {
    if (!card.classList.contains('expanded')) {
      positionCard(card);
    }
  }
}

const popStateHandler = event => {
  // console.log('Popstate fired!');
  if (event.state.content === 'project index') {
    closeCurrentCard();
  } else if (getUrlParameter('content')) {
    closeCurrentCard();
    let delay = document.body.classList.contains('card-open') ? 500 : 0;
    const project = getProjectByUrl();
    setTimeout(() => {
      openCard(project, false, 500);
    }, delay);
  }
};

function pageLoad() {
  if (window.location.search) {
    const project = getProjectByUrl();
    openCard(project, false);
  }
}

function homeBtnHandler(e) {
  e.preventDefault();
  if (getUrlParameter('content') !== '') {
    closeCurrentCard();
    defaultHistoryState(true);
  } else {
    window.location = 'index.html';
  }
}


siteTitle.addEventListener('click', homeBtnHandler);
window.addEventListener('popstate', popStateHandler);
window.addEventListener('load', pageLoad);

window.addEventListener('resize', debounce(() => {
  resetCards();
}, 100));

setUpCards();
setTimeout(() => {
  cardWrapper.classList.add('visible');
  cardWrapper.classList.remove('no-trans');
}, cardDelay);
