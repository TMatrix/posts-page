// dataRaw = {
//   createdAt: "0290-01-20T18:19:35.727Z",
//   description: "Aliquam qui nemo voluptatem. Voluptatibus dolorum non tenetur aut et voluptates et. Eveniet qui aut tempora asperiores assumenda facilis ut neque. Sapiente molestias molestiae corporis.",
//   image: "http://via.placeholder.com/150x150",
//   tags: ["Business", "Politics", "Sport"],
//   title: "Quo repudiandae qui sit."
// }

fetch('https://api.myjson.com/bins/152f9j').then(function
(response) { 
	return response.json();
}).then(function(dataIn) {
  const dataRaw = dataIn;
  
  for(let i = 0; i < dataRaw.data.length; i++){
    initPosts(dataRaw.data[i]);
  }

  createTagList(dataRaw);

  window.localStorage.getItem("temp")? startToggle(window.localStorage.getItem("temp")): sortByDateAll(-1);
  
});

function removeItem(){
  let item = this.parentNode;
  item.remove();
}


function toggleTag(event){
  let target = event.target;
  if (target.hasAttribute("class")){
    target.removeAttribute("class");

    let temp = '';
    let currentActive =document.getElementsByClassName("active");

    for(let i = 0; i < currentActive.length; i++){
      temp += " " + currentActive[i].innerText;
    }

    window.localStorage.removeItem("temp");
    window.localStorage.setItem("temp", temp);

    renderPosts(window.localStorage.getItem("temp"));
  } else {
    target.setAttribute("class", "active");

    // renderPosts(target.innerText);
    let temp = '';
    let currentActive =document.getElementsByClassName("active");

    for(let i = 0; i < currentActive.length; i++){
      temp += " " + currentActive[i].innerText;
    }
    window.localStorage.removeItem("temp");
    window.localStorage.setItem("temp", temp);

    renderPosts(window.localStorage.getItem("temp"));
  }
}

function startToggle(wordlist){
  let list = document.getElementsByTagName("li");
  for (let i = 0; i < list.length; i++) {
    if (wordlist.includes(list[i].innerText)){
      list[i].setAttribute("class", "active");
    } else {
      list[i].removeAttribute("class");
    }
  }
  renderPosts(wordlist);
}

function createpostTags(){
  let postContainer = document.getElementsByClassName("post");
  let postTags= [];
  for (let i = 0; i < postContainer.length; i++) {
    let tags = [];
    const arrayText = postContainer[i].getElementsByClassName("tags")[0].innerText.split(',');
    for (let j = 0; j < arrayText.length; j++) {
      tags.push({
        name: arrayText[j],
        checked: false
      });
    }
    postTags.push(
      {
        tags: tags,
        elem: postContainer[i]
      }
    );
  }
  return postTags;
}

function renderPosts(activeWordList){
  //Mark all posts
  let postTags = markPost(activeWordList);

  //Display all posts in certain container
  displayPost(postTags);
}

function addToContainer(post, num){
  let container = document.getElementsByClassName("post-container" + num)[0];
  container.appendChild(post);

  let rows = [];
  for (let i = 0; i < container.children.length; i++) {
    let elem = container.children[i];
    rows.push({
      value: Date.parse(elem.getElementsByClassName("createdAt")[0].innerText),
      elem: elem
    });
  }
  rows.sort(function(a, b) {
    return b.value - a.value;
  });

  for (let i = 0; i < rows.length; i++) {
    container.appendChild(rows[i].elem);
  }
}

function displayPost(postTags){
  for(let  i = 0; i < 4; i++){
    let temp = document.getElementsByClassName("post-container" + i)[0];
    for(let j = 0; temp && j < temp.length; j++) {
      console.log(i + 1000);
      temp[j].remove();
    };
  }
  for (let i = 0; i < postTags.length; i++){
    let k = 0;
    postTags[i].tags.forEach( el => {
      if (el.checked){
        k++;
      }
    });
    switch (k) {
      case 1:
        addToContainer(postTags[i].elem, 1);
        break;
      case 2:
        addToContainer(postTags[i].elem, 2);
        break;
      case 3:
        addToContainer(postTags[i].elem, 3);
        break;
      default:
        addToContainer(postTags[i].elem, 0);
        break;
    }
  }
}

//Mark post for current tag list
function markPost(activeWordList){
  let postTags = createpostTags();
  
  for (let i = 0; i < postTags.length; i++){
    postTags[i].tags.forEach( el => {
      if (activeWordList.includes(el.name)){
        el.checked = !el.checked;
      }
    });
  }

  return postTags;
}

//Sortind by Date for all posts
function sortByDateAll(num){
  startToggle("");
  let container = [];
  container.push(document.getElementsByClassName("post-container0")[0].children);
  container.push(document.getElementsByClassName("post-container1")[0].children);
  container.push(document.getElementsByClassName("post-container2")[0].children);
  container.push(document.getElementsByClassName("post-container3")[0].children);
  let postContainer = document.getElementsByClassName("post-container0")[0];
  let other = [
    document.getElementsByClassName("post-container1")[0],
    document.getElementsByClassName("post-container2")[0],
    document.getElementsByClassName("post-container3")[0] ];
  other.forEach(elem => {
    if (elem)
    elem.remove();
  })
  let body = postContainer.parentNode;
  postContainer.remove();

  let rows = [];
  for (let i = 0; i < container[0].length; i++) {
    let elem = container[0][i];
    rows.push({
      value: Date.parse(elem.getElementsByClassName("createdAt")[0].innerText),
      elem: elem
    });
  }
  if (num > 0) {
    rows.sort(function(a, b) {
      return a.value - b.value;
    });
  } else {
    rows.sort(function(a, b) {
      return b.value - a.value;
    });
  }

  for (let i = 0; i < rows.length; i++) {
    postContainer.appendChild(rows[i].elem);
  }

  for(let i = 2; i >= 0; i--){
    body.appendChild(other[i]);
  }
  body.appendChild(postContainer);
}

//Initialize posts
function initPosts(dataItem){
  let removeSVG = '<i class="far fa-trash-alt"></i>';
  let postContainer = document.getElementsByClassName("post-container0")[0];
  let post = document.createElement("div");
  post.className = "post 0";

  let title = document.createElement("div");
  title.innerText = dataItem["title"];
  title.setAttribute("class", "title");

  let image = document.createElement("img");
  image.setAttribute("src", dataItem["image"]);

  let description = document.createElement("div");
  description.innerText = dataItem["description"];
  description.setAttribute("class", "description");

  let createdAt = document.createElement("div");
  createdAt.innerText = dataItem["createdAt"];
  createdAt.setAttribute("class", "createdAt");

  let tags = document.createElement("div");
  tags.innerText = dataItem["tags"];
  tags.setAttribute("class", "tags");

  let remove = document.createElement("button");
  remove.innerHTML = removeSVG;
  remove.addEventListener("click", removeItem);

  post.appendChild(title);
  post.appendChild(image);
  post.appendChild(description);
  post.appendChild(createdAt);
  post.appendChild(tags);
  post.appendChild(remove);
  postContainer.appendChild(post);
}

//for tag sort function
function createTagList(dataRaw){
  let tagList = [];
  let list = document.getElementsByClassName("tags-list")[0];
  dataRaw.data.forEach(element => {
    for(let i = 0; i < element.tags.length; i++){
      if(tagList.includes(element["tags"][i])){
        continue;
      }else {
        tagList.push(element["tags"][i]);
      }
      // console.log(element["tags"][i]);
    }
  });
  
  for(let i = 0; i < tagList.length; i++){
    let listItem = document.createElement("li");
    listItem.innerText = tagList[i];
    listItem.setAttribute("onclick", "toggleTag(event)");
    list.appendChild(listItem);
  }

  // return tagList;
}

//for seach function
function allTitlesList(dataRaw) {
  let list = [];
  let postsTitles = document.getElementsByClassName("title");
  for(let i = 0; i < postsTitles.length; i++) {
    list.push({
      value: postsTitles[i].innerText.substr(0, postsTitles[i].innerText.length - 1).split(" "),
      elem: postsTitles[i].parentNode
    });
  }

  return list;
}

function searchPost(){
  let inputValue = document.getElementById("search").value;
  // />(.*?)</g
  let htmlFragment = document.createDocumentFragment();


  let local_copy = document.getElementsByClassName("title");
  let local_copyLen = local_copy.length;

  let search = new RegExp(inputValue, 'gi');
  let cont3 = document.getElementsByClassName("post-container3")[0];

  for(let i = 0; i < local_copyLen; i++){
    if(search.test(local_copy[i].innerText)){
      let temp = local_copy[i].parentNode;
      cont3.insertAdjacentElement("afterbegin", temp);
    }
  }
}