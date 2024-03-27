"use strict";

// const fs = require('fs');
const video = document.querySelector("video");
const video_title = document.querySelector(".video-title");
const previous_song = document.querySelector(".previous-song");
const next_song = document.querySelector(".next-song");
// const btn = document.querySelector(".btn");
const video_size = document.querySelector(".video-size");
const songs_list = document.querySelector(".songs-list");
const search_bar = document.querySelector("[data-search]");
const suffle_icon = document.querySelector(".suffle-icon");
const loop_icon = document.querySelector(".loop-icon");

import allSongs from "./allSongs.json" assert {type: 'json'};


//stack implementation
class Stack {
    constructor() {
        this.stack = [];
    }

    push(item) {
        this.stack.push(item);
    }

    pop() {
        return this.stack.pop();
    }

    isEmpty() {
        return this.stack.length === 0;
    }

    // Custom method to pop the bottom element
    popBottom() {
        if (this.isEmpty()) {
            return null; // or throw an error
        }

        // Move all elements except the bottom one to a temporary stack
        const tempStack = new Stack();
        while (!this.isEmpty()) {
            tempStack.push(this.pop());
        }

        // Pop the bottom element
        const bottomElement = tempStack.pop();

        // Move back elements from temporary stack to the original stack
        while (!tempStack.isEmpty()) {
            this.push(tempStack.pop());
        }

        return bottomElement;
    }

    // Remove element at a specific index in the stack
    removeAtIndex(index) {
        if (index < 0 || index >= this.stack.length) {
            throw new Error('Index out of range');
        }

        // Create a temporary stack to hold elements
        const tempStack = [];

        // Pop elements from the original stack until the desired index is reached
        for (let i = 0; i < index; i++) {
            tempStack.push(this.pop());
        }

        // Remove the element at the desired index
        this.pop();

        // Push back elements from the temporary stack to the original stack
        while (tempStack.length > 0) {
            this.push(tempStack.pop());
        }
    }
}
// Directory path
// const directoryPath = './vibeSongs';

// Read all file names in the directory
// fs.readdir(directoryPath, function (err, files) {
//     if (err) {
//         console.error('Error reading directory:', err);
//         return;
//     }

//     // Log all file names
//     files.forEach(function (file) {
//         console.log(file);
//     });
// });

console.log(allSongs[0]);
const songs = allSongs;
let noLoopSongs = allSongs;
let currentSong = 0;

//if suffle is on
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// getRandomInt(0, songs.length - 1)
console.log(songs);


//displays all songs in songs-list
for (let i = 0; i < songs.length; i++) {
    var newSong = document.createElement('li');
    newSong.textContent = `${songs[i]}`;
    songs_list.appendChild(newSong);
    console.log(`${songs[i]}`);
}

previous_song.addEventListener("click", playPreviousSong);
next_song.addEventListener("click", playNextSong);

var file_size;
async function getVideoSize() {
    const url = video.src;

    try {
        const response = await fetch(url, {
            method: 'HEAD' // Use HEAD method to only get headers, not the entire video file
        });

        const sizeInBytes = parseInt(response.headers.get('Content-Length'));
        file_size = sizeInBytes / (1024 * 1024); // Convert bytes to megabytes
        file_size = (Math.floor(file_size) + 1);
        video_size.textContent = `size:${file_size} MB`;
        console.log('Video Size (MB):', file_size)
    } catch (error) {
        console.error('Error fetching video size:', error);
    }
};

//
const history = new Stack();
function noLoopPlay() {
    //implement code
    if (noLoopSongs.length > 0) {
        if (currentSong > noLoopSongs.length - 1) {
            currentSong = 0;
        }
        noLoopSongs.splice(currentSong, 1);
        console.log(`removed --> ${currentSong}`);
        console.log(`remaining size --> ${noLoopSongs.length - 1}`);
        if (suffle) {
            if (history.length > 10) {
                history.popBottom();
                history.push(currentSong);
                currentSong = getRandomInt(0, noLoopSongs.length - 1);
            }
            else {
                history.push(currentSong);
                currentSong = getRandomInt(0, noLoopSongs.length - 1);
            }
            video_title.innerHTML = `${noLoopSongs[currentSong]}`;
            video.src = `vibeSongs/${noLoopSongs[currentSong]}`;
            video.play();
            getVideoSize();
            removeClass();
            document.querySelector(`.songs-list li:nth-child(${currentSong + 1})`).classList.add("selected");
        }
        else {
            if (currentSong > noLoopSongs.length - 1) {
                currentSong = 0
            }
            currentSong += 1;
            video_title.innerHTML = `${noLoopSongs[currentSong]}`;
            video.src = `vibeSongs/${noLoopSongs[currentSong]}`;
            video.play();
            getVideoSize();
            removeClass();
            document.querySelector(`.songs-list li:nth-child(${currentSong + 1})`).classList.add("selected");

        }
    }
}


//play next song after song completion
var current_time;
var video_duration;
video.addEventListener("loadeddata", () => {
    video_duration = video.duration;
    console.log(video_duration);
});

//
var loopAll = true;
var loopOne = false;
var noLoop = false;
function toggleLoop() {
    if (loopAll) {
        loopAll = false;
        noLoop = true;
        loop_icon.src = "icons/right-arrow(white).png"
        noLoopSongs = allSongs;
    }
    else if (noLoop) {
        noLoop = false;
        loopOne = true;
        loop_icon.src = "icons/loop-one(white).png"
    }
    else {
        loopOne = false;
        loopAll = true;
        loop_icon.src = "icons/loop(white).png"
    }
}
loop_icon.addEventListener("click", toggleLoop);
video.addEventListener("timeupdate", () => {
    current_time = video.currentTime;
    if (current_time == video_duration) {
        console.log("next song playing");
        if (loopOne) {
            video.play();
        }
        else {
            playNextSong();
        }
    }
});
//auto play next song after completed
// function playSong(val) {
//     currentSong += val;
//     if (currentSong < 0) {
//         currentSong = songs.length;
//     }
//     else if (currentSong > songs.length) {
//         currentSong = 0
//     }
//     video_title.innerHTML = `${songs[currentSong]}`;
//     video.src = `vibeSongs/${songs[currentSong]}`;
//     video.play();
// }
var suffle = false;
function toggleShuffle() {
    if (suffle) {
        suffle = !suffle;
        suffle_icon.src = "icons/suffle(white).png";
    }
    else {
        suffle = !suffle;
        suffle_icon.src = "icons/suffle(red).png";
    }
}
suffle_icon.addEventListener("click", toggleShuffle);

function playNextSong() {
    if (noLoop) {
        noLoopPlay();
        return
    }
    if (suffle) {
        if (history.length > 10) {
            history.popBottom();
            history.push(currentSong);
            currentSong = getRandomInt(0, songs.length - 1);
        }
        else {
            history.push(currentSong);
            currentSong = getRandomInt(0, songs.length - 1);
        }

    }
    else {
        currentSong += 1;
    }
    if (currentSong > songs.length - 1) {
        currentSong = 0
    }
    video_title.innerHTML = `${songs[currentSong]}`;
    video.src = `vibeSongs/${songs[currentSong]}`;
    video.play();
    getVideoSize();
    removeClass();
    document.querySelector(`.songs-list li:nth-child(${currentSong + 1})`).classList.add("selected");
    // document.querySelector(`.songs-list li:nth-child(${currentSong - 1})`).classList.add("active");
    // displaySize();
}
function playPreviousSong() {
    if (suffle) {
        if (!history.isEmpty()) {
            currentSong = history.pop();
            console.log(currentSong);
        }
        else {
            console.log("hello");
            currentSong = getRandomInt(0, songs.length - 1)
        }
    }
    else {
        currentSong -= 1;
    }
    if (currentSong < 0) {
        currentSong = songs.length - 1;
    }
    video_title.innerHTML = `${songs[currentSong]}`;
    video.src = `vibeSongs/${songs[currentSong]}`;
    video.play();
    getVideoSize();
    removeClass();
    document.querySelector(`.songs-list li:nth-child(${currentSong - 1})`).classList.add("selected");
    // document.querySelector(`.songs-list li:nth-child(${currentSong - 1})`).classList.add("active");

    // displaySize();
}

// //video size feture
// async function displaySize() {

// }

// btn.addEventListener("click", () => {
//     console.log(currentSong);
// });

//keyboard events
window.addEventListener("keydown", (event) => {

    //imp lines
    //does not affect the video if buttons are pressed oustide of vidoplayer
    //like comments section ,etc...
    const tagName = document.activeElement.tagName.toLowerCase();
    if (tagName === "input") {
        return;
    }
    if (event.key.toLowerCase() === "enter") {
        retrun
    }
    if (tagName === "button") { retrun }

    switch (event.key.toLowerCase()) {
        case "p": playPreviousSong();
            break;
        case "n": playNextSong();
            break;
        case "s": toggleShuffle();
            break;
    }
});


// video_title.innerHTML = `${songs[currentSong]}`;
// video.src = `vibeSongs/${songs[currentSong]}`;
//next previous song features
video_title.innerHTML = `${songs[currentSong]}`;
video.src = `vibeSongs/${songs[currentSong]}`;
video.play();
getVideoSize();
document.querySelector('.songs-list li:nth-child(1)').classList.add("selected");
// displaySize();



// Get all the <li> elements
const listItems = document.querySelectorAll('.songs-list li');


function removeClass() {
    // Remove active class from all <li> elements
    listItems.forEach(function (li) {
        li.classList.remove('active');
        li.classList.remove('selected');
    });
}
// Loop through each <li> element to attach click event listener
listItems.forEach(function (item) {
    item.addEventListener('click', function () {
        removeClass();

        // Add active class to the clicked <li> element
        item.classList.add('active');

        // Log the text content of the selected <li> element
        console.log('Selected item:', item.textContent);

        //playing song
        video_title.innerHTML = `${item.textContent}`;
        video.src = `vibeSongs/${item.textContent}`;
        video.play();
        getVideoSize();
        currentSong = songs.indexOf(`${item.textContent}`);
        item.classList.add("selected");
    });
});


//planned but didn't worked
//fetching data from allSongs.json file
//we start our code with an ajax request to fetch the data from the json file.
//first create a new xmlhttp-request object
// let http = new XMLHttpRequest();
//the variable http now holds all methods and properties of the object
//next prepare the request with an open() method.
// http.open("get", "allSongs.json", true);
//the first argument sets the http method
//in the second argument we pass the json file
//and last the keyword true,sets the request to be an async
//now,send the request
// http.send();
//now check the response through onload eventlistener
// http.onload = function () {
//inside this function check the readystate and status properties
// if (this.readyState == 4 && this.status == 200) {
//if the response is successfull,parse the json data
//and convert them to a javascript array
// let songs = JSON.parse(this.responseText);
// console.log(songs);
//next create an empty vairable to add the incoming data
// let output = "";
//now,loop through the products,and in every iteration
//add an html template to the output variouble
// for (let item of allSongs) {
//     output += `

//     `;
// }
// }
// }

// var fileDir = "vibeSongs/Zaroorat Full Video Song _ Ek Villain _ Mithoon _ Mustafa Zahid(1080P_HD).mp4"
// var file;
// var fileSize;
// video.addEventListener("change", () => {
//     file = fileDir.files[0];
//     fileSize = fileDir.size;

//     console.log("file size :", fileSize, "bytes");
// });

// fileDir.addEventListener("change", () => {
//     var vid = fileDir.files[0];
//     fileSize = vid.size;
// });
// //
// btn.addEventListener("click", () => {
//     // console.log(current_time);
//     // console.log(video_duration);
//     // console.log(fileDir);
//     // console.log(file);
//     // console.log(fileSize);
//     // console.log(vid_size);
// });

// btn.addEventListener("click", customFun);


//search bar functionality
search_bar.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    console.log(value);
    listItems.forEach(function (item) {
        let text = item.textContent.toLocaleLowerCase();
        let index = text.indexOf(value);
        // const isVisible = item.textContent.toLocaleLowerCase().includes(value);
        // item.classList.toggle("hide", !isVisible);
        if (text.includes(value)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
        // if (index !== -1) {
        //     let newText = item.textContent.substring(0, index) + '<span class="highlight">' + item.textContent.substring(index, input.length) + '</span>' + item.textContent.substr(index + input.length);
        //     item.innerHTML = newText;
        // }
        // else {
        //     item.innerHTML = item.textContent;
        // }
    });
});