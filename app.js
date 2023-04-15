tinymce.init({
  selector: "textarea",
  plugins:
    "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss preview",
  toolbar:
    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
  tinycomments_mode: "embedded",
  tinycomments_author: "Author name",
  mergetags_list: [
    { value: "First.Name", title: "First Name" },
    { value: "Email", title: "Email" },
  ],
});

function saveResource() {
  var resourceTitle = document.getElementById("resource-title").value;
  var resourceDesc = document.getElementById("resource-desc").value;
  var resourceLink = document.getElementById("resource-link").value;
  console.log(resourceDesc);
  var videoId = getVideoId(resourceLink); // get the video ID from the YouTube URL
  var thumbnailUrl = "https://img.youtube.com/vi/" + videoId + "/mqdefault.jpg"; // construct the thumbnail URL
  var savedResources = localStorage.getItem("resources");
  if (savedResources) {
    savedResources = JSON.parse(savedResources);
    savedResources.push({
      title: resourceTitle,
      description: tinymce.get("resource-desc").getContent(),
      link: resourceLink,
      videoId: videoId, // save the video ID
      thumbnail: thumbnailUrl, // save the thumbnail URL
    });
  } else {
    savedResources = [
      {
        title: resourceTitle,
        description: tinymce.get("resource-desc").getContent(),
        link: resourceLink,
        videoId: videoId, // save the video ID
        thumbnail: thumbnailUrl, // save the thumbnail URL
      },
    ];
  }
  localStorage.setItem("resources", JSON.stringify(savedResources));
  displayResources();
}

function getVideoId(url) {
  var videoId = "";
  var regex = /[?&]v=([^&#]*)/;
  var match = url.match(regex);
  if (match) {
    videoId = match[1];
  }
  return videoId;
}

function showResources() {
  var resources = JSON.parse(localStorage.getItem("resources")) || [];
  var resourceList = document.getElementById("resource-list");
  resourceList.innerHTML = "";
  for (var i = 0; i < resources.length; i++) {
    var resource = resources[i];
    var resourceItem = document.createElement("div");
    resourceItem.innerHTML =
      "<a href='" +
      resource.url +
      "' target='_blank'>" +
      resource.name +
      "</a>";
    resourceList.appendChild(resourceItem);
  }
}

function displayResources() {
  var savedResources = localStorage.getItem("resources");
  var resourcesList = document.createElement("ul");
  if (savedResources) {
    savedResources = JSON.parse(savedResources);
    for (var i = 0; i < savedResources.length; i++) {
      var resourceItem = document.createElement("li");
      var resourceTitle = document.createElement("h2");
      var resourceDesc = document.createElement("div");

      var resourceLink = document.createElement("a");
      var resourceImage = document.createElement("img"); // create image element
      resourceTitle.textContent = savedResources[i].title;

      resourceDesc.innerHTML = savedResources[i].description;
      console.log(resourceDesc);
      tinymce.get("resource-desc").setContent(savedResources[i].description);

      resourceLink.textContent = "Explore";
      resourceLink.href =
        "https://www.youtube.com/watch?v=" + savedResources[i].videoId;
      resourceLink.target = "_blank";
      resourceImage.src = savedResources[i].thumbnail; // set image source
      resourceImage.alt = savedResources[i].title; // set image alt text
      resourceItem.appendChild(resourceImage); // append image to resource item
      resourceItem.appendChild(resourceTitle);
      resourceItem.appendChild(resourceDesc);
      resourceItem.appendChild(resourceLink);
      resourcesList.appendChild(resourceItem);
    }
  } else {
    var noResources = document.createElement("p");
    noResources.textContent = "No resources saved.";
    resourcesList.appendChild(noResources);
  }
  var savedResourcesDiv = document.getElementById("saved-resources");
  savedResourcesDiv.innerHTML = "";
  savedResourcesDiv.appendChild(resourcesList);
}

window.onload = function () {
  displayResources();
};
