import {config} from './config.js';
const Form = document.querySelector('#form-body');
const FormSide = document.querySelector('#form-sidebar');
const InputUser = document.querySelector('#input-user');
const InputSide = document.querySelector('#input-side');
const ToggleSidebar = document.querySelector('.dropdown');
let mainDisplay = document.querySelector('.repo-description')
let Sidebar = document.querySelector('.sidebar');
let myTok = config.MY_TOKEN;
let tok = myTok.split(";;;;;").join("")


let searchUser = ' ';

//form event listener
Form.addEventListener('submit', submitForm);
FormSide.addEventListener('submit', submitSideForm);

//for toggle of sidebar
ToggleSidebar.addEventListener('click', showSidebar)


//submits form both side bar
async function submitForm(e) {
  e.preventDefault();
  searchUser = InputUser.value;
  await getUserRepos(searchUser);
  InputUser.value = '';
};
async function submitSideForm(e) {
  e.preventDefault();
  searchUser = InputSide.value;
  await getUserRepos(searchUser);
  InputSide.value = '';
};



function showSidebar(e) {
  Sidebar.classList.toggle('show-sidebar');
};




//apifetch is called in this function with a variable userprofile wich is input value
async function getUserRepos(userprofile) {
  const data = await apiFectch(`
    query  {
      user(login: "${userprofile}") {
        login,
        name,
        bio,
        avatarUrl
        starredRepositories {
          totalCount
        }
        repositories(first: 20) {
          totalCount
          edges {
            node {
              languages(first:1){
                edges{
                  node{
                    color
                    name
                  }
                }
              }
              name
              description
              updatedAt
              stargazers {
                totalCount
              }
              forks {
                totalCount
              }
            }
          }
        }
      }
    }`
  );


  console.log(data.data.user.repositories.edges)

  document.querySelectorAll('.description-name').forEach((element) => element.innerHTML = `${data.data.user.login}`)
  document.querySelectorAll('.description-nametwo').forEach((element) => element.innerHTML = `${data.data.user.name ==null? '': data.data.user.name}`)
  document.querySelectorAll('.description-bio').forEach((element) => element.innerHTML = `${data.data.user.bio==null? '': data.data.user.bio}`)
  document.querySelectorAll('.user-image').forEach(element => {
    element.src = `${data.data.user.avatarUrl}`;
  });
  document.querySelectorAll('.repo-count').forEach((Element) => Element.innerHTML = `${data.data.user.repositories.totalCount}`);
if(data.data){
  repoBody(data.data.user.repositories.edges)
}else{
  alert('no name found')
}
  
}

//setting a constant user on load
getUserRepos('ireade');


function repoBody(repositories) {
  let displayRepo = '';
  repositories.map((item) => {

    //setting variables to get repo update
    let dayword = 'days'
    var day1 = new Date().getTime();
    var day2 = new Date(item.node.updatedAt).getTime()
    var difference = Math.abs(day2 - day1);
    let days = difference / (1000 * 3600 * 24)
    let realDays = days.toFixed(0);
    let result = realDays
    if (realDays / 7 >= 1) {
      dayword = 'weeks';
      result = (realDays / 7).toFixed(0)
    }
    if (realDays / 7 >= 4) {
      dayword = 'months';
      result = (realDays / 30).toFixed(0)
    }
    if (realDays / 7 >= 52) {
      dayword = 'years';
      result = (realDays / 365).toFixed(0)
    }

 //to display repos in main page
    displayRepo += `
    <div class="repo-java flexbox">
    <div class="repo-description-rating">
        <a href="#">${item.node.name}</a>
        <p class='repo-description-paragraph'>${ item.node.description ==null? '': item.node.description}</p>
        <div class="repo-ranking flexbox ">
           <span class="ranking-icon flexing ">
                <i class="fa fa-circle" style='color: ${item.node.languages.edges.map((item)=> item.node.color)};' > </i>
                 ${item.node.languages.edges.map((item) =>  item.node.name )}
            </span> 
          <a href="#" class="ranking-icon flexing" >
          <span class="material-icons star-icon ">
          star_outline
          </span>
          <span class='icon-count'>${item.node.stargazers.totalCount}</>
              
          </a> 
          <a href="#" class="ranking-icon flexing" >
          <svg aria-hidden="true" viewBox="0 0 16 16" version="1.1" data-view-component="true" height="16" width="16" class="octicon octicon-git-branch text-gray">
    <path fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"></path>
</svg>
          <span class='icon-count'> ${item.node.forks.totalCount}</>
           
         </a> 
         <span class="ranking-icon" id='update-counter'>updated at ${result} ${dayword} ago</span>
        </div>
      </div>
      <div>
      <span class="border-span">
      <span class="material-icons star-icon">
          star_outline
          </span>
      star
   </span>
      </div>
  </div>
     `
  })

  mainDisplay.innerHTML = displayRepo;
}


async function apiFectch(query) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tok}`,
    },
    body: JSON.stringify({
      query: query,
      // variables: variables
    })
  });
  return await res.json();
}







