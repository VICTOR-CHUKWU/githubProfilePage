const Form = document.querySelectorAll('.form');
const InputUser = document.querySelector('#input-user');
const ToggleSidebar = document.querySelector('.dropdown');
let mainDisplay = document.querySelector('.repo-description')
let Sidebar = document.querySelector('.sidebar')

let searchUser = ' ';

Form.forEach((element) => {
  element.addEventListener('submit', submitForm);
});

ToggleSidebar.addEventListener('click', showSidebar)


async function submitForm(e) {
  e.preventDefault();
  searchUser = InputUser.value;
  await getUserRepos(searchUser);
  InputUser.value = '';
};



function showSidebar(e) {
  Sidebar.classList.toggle('show-sidebar');
};





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
        repositories(first: 15) {
          totalCount
          edges {
            node {
              name
              stargazers {
                totalCount
              }
              forks {
                totalCount
              }
              watchers {
                totalCount
              }
              issues(states:[OPEN]) {
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
  document.querySelectorAll('.description-nametwo').forEach((element) => element.innerHTML = `${data.data.user.name}`)
  document.querySelectorAll('.description-bio').forEach((element) => element.innerHTML = `${data.data.user.bio}`)
  document.querySelectorAll('.user-image').forEach(element => {
    element.src = `${data.data.user.avatarUrl}`;
  });
  document.querySelectorAll('.repo-count').forEach((Element) => Element.innerHTML = `${data.data.user.repositories.totalCount}`);

  repoBody(data.data.user.repositories.edges)
}

getUserRepos('ireade');

let displayRepo = '';
function repoBody(repositories) {
  repositories.map((item) => {
    displayRepo += `
    <div class="repo-java flexbox">
    <div class="repo-description-rating">
        <a href="#">${item.node.name}</a>
        <div class="repo-ranking flexbox ">
          <span id="ranking-icon">
              <i class="fa fa-circle"></i>
              css
          </span> 
          <a href="#" id="ranking-icon" class="flexing">
          <span class="material-icons star-icon ">
          star_outline
          </span>
              ${item.node.stargazers.totalCount}
          </a> 
          <a href="#" id="ranking-icon">
          <i class="fa fa-code-fork" ></i>
            ${item.node.forks.totalCount}
         </a> 
         <span id="ranking-icon">updated 20 hours ago</span>
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


async function apiFectch(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer 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`,
    },
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  });
  return await res.json();
}







