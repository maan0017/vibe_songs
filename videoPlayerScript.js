const playPauseBtn = document.querySelector(".play-pause-btn");
const playPauseBtn2 = document.querySelector(".play-pause-btn2");
const videoContainer = document.querySelector(".video-container");
const timeline_container = document.querySelector(".timeline-container");
const video = document.querySelector("video");
const volume_btn = document.querySelector(".volume-btn");
const volume_slider = document.querySelector(".volume-slider");
const current_time = document.querySelector(".current-time");
const total_time = document.querySelector(".total-time");
const current_video_duration = document.querySelector(".current-video-duration");
const total_video_duration = document.querySelector(".total-video-duration");
const speed_btn = document.querySelector(".speed-btn");
const miniplayer_btn = document.querySelector(".miniplayer-btn");
const theater_btn = document.querySelector(".theater-btn");
const fullscreen_btn = document.querySelector(".fullscreen-btn");

console.log(video);

//timeline feature
let isScrubbing = false;
const rect = timeline_container.getBoundingClientRect();
function toggelScrubbing(e) {
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    isScrubbing = (e.buttons & 1) === 1;
    videoContainer.classList.toggle("scrubbing", isScrubbing);
    if (isScrubbing) {
        wasPaused = video.paused;
        video.pause()
    }
    else {
        video.currentTime = percent * video.duration;
        if (!wasPaused) {
            video.play();
        }
    }
    handleTimelineUpdate(e);
}
timeline_container.addEventListener("mousedown", toggelScrubbing);
timeline_container.addEventListener("mousemove", handleTimelineUpdate);
function handleTimelineUpdate(e) {
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    timeline_container.style.setProperty("--preview-position", percent);

    if (isScrubbing) {
        e.preventDefault();
        timeline_container.style.setProperty("--progress-position", percent);
    }
}
document.addEventListener("mouseup", e => {
    if (isScrubbing) {
        toggelScrubbing(e);
    }
});
// document.addEventListener("mousemove", e => {
//     if (isScrubbing) {
//         toggelScrubbing(e);
//     }
// });


//play pause feature
function togglePlay() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}
playPauseBtn.addEventListener('click', togglePlay);
playPauseBtn2.addEventListener('click', togglePlay);


//video player event listener
video.addEventListener("click", togglePlay);
video.addEventListener("play", () => {
    videoContainer.classList.remove("paused");
    playPauseBtn.src = "icons/pause(white).png"
    playPauseBtn2.src = "icons/pause(pink).png"
});

video.addEventListener("pause", () => {
    videoContainer.classList.add("paused");
    playPauseBtn.src = "icons/play(white).png"
    playPauseBtn2.src = "icons/play(pink).png"
});


//volume controls
volume_slider.value = video.volume;
volume_btn.addEventListener("click", toggleMute);
volume_slider.addEventListener("click", (event) => {
    video.volume = event.target.value;
    video.muted = event.target.value === 0;
});
var videoMuted = false;
//mute unmute feature
function toggleMute() {
    video.muted = !video.muted;
    volumeIcon();
}

function volumeIcon() {
    if (video.muted || video.volume === 0) {
        volume_btn.src = "icons/mute(white).png";
    }
    else if (video.volume >= .7) {
        volume_btn.src = "icons/volume(white).png";
    }
    else {
        volume_btn.src = "icons/low-volume(white).png";
    }
}

video.addEventListener("volumechange", () => {
    let volumeLevel;
    if (video.muted || video.volume === 0) {
        volume_slider.value = 0;
        volumeIcon();
    }
    else if (video.volume >= .7) {
        volumeIcon();
    }
    else {
        volumeIcon();
    }

    videoContainer.dataset.volumeLevel = volumeLevel;
});

function volumeUp() {
    if (video.volume > 0.95) {
        video.volume = 1.0;
        return;
    }
    video.volume += .10;
    volume_slider.value = video.volume;
}
function volumeDown() {
    if (video.volume < 0.05) {
        video.volume = 0;
        return;
    }
    video.volume -= .10;
    volume_slider.value = video.volume;
}


//time duration
//total time
video.addEventListener("loadeddata", () => {
    total_time.textContent = formatDuration(video.duration);
    total_video_duration.textContent = formatDuration(video.duration);
});
const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2
});
function formatDuration(time) {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);
    if (hours === 0) {
        return `${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`;
    }
    else {
        return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`;
    }
}
//current time
video.addEventListener("timeupdate", () => {
    current_time.textContent = formatDuration(video.currentTime);
    current_video_duration.textContent = formatDuration(video.currentTime);
    const percent = video.currentTime / video.duration;
    timeline_container.style.setProperty("--progress-position", percent);
});
//skip time function
function skipTime(duration) {
    video.currentTime += duration;
}


//speed feature
var playbackSpeed = 1;
speed_btn.addEventListener("click", changePlaybackSpeed);

function changePlaybackSpeed() {
    playbackSpeed = video.playbackRate + .25;
    if (playbackSpeed > 2) playbackSpeed = .25;
    video.playbackRate = playbackSpeed;
    speed_btn.textContent = `${playbackSpeed}x`;
}


//miniplayer mode
var miniPlayerClass = videoContainer.classList.contains("mini-player");
function toggleMiniPlayerMode() {
    if (miniPlayerClass) {
        document.exitPictureInPicture();
        miniPlayerClass = false;
    }
    else {
        video.requestPictureInPicture();
        miniPlayerClass = true;
    }
}
miniplayer_btn.addEventListener("click", toggleMiniPlayerMode);


//theater mode
var theaterStatus = false;
//theater mode source code
function toggleTheaterMode() {
    if (!theaterStatus) {
        videoContainer.classList.add("theater");
        theaterStatus = true;
    }
    else {
        videoContainer.classList.remove("theater");
        theaterStatus = false;
    }
}
//theater btn clicked
theater_btn.addEventListener("click", toggleTheaterMode);


//fullscreen btn clicked
fullscreen_btn.addEventListener("click", fullscreenChange);
video.addEventListener("dblclick", fullscreenChange);
//videoPlayer fullscreen feature
/* When the openFullscreen() function is executed, open the video in fullscreen.
Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet */
var fullscreen = false;
/*
another way to check that if currently we are in fullscreen mode is -->
    >document.fullscreenElement != null
*/
function openFullscreen() {
    if (video.requestFullscreen) {
        videoContainer.requestFullscreen();
    } else if (video.webkitRequestFullscreen) { /* Safari */
        videoContainer.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) { /* IE11 */
        videoContainer.msRequestFullscreen();
    }
}
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}
function fullscreenChange() {
    if (fullscreen) {
        openFullscreen();
        fullscreen = !fullscreen;
        fullscreen_btn.src = "icons/exitFullscreen(white).png";
    }
    else {
        closeFullscreen();
        fullscreen = !fullscreen;
        fullscreen_btn.src = "icons/fullscreen(white).png";
    }
}
document.addEventListener("fullscreenchange", () => {
    videoContainer.classList.toggle("full-screen", document.fullscreenElement);
});


//keyboard events
window.addEventListener("keydown", (event) => {

    //imp lines
    //does not affect the video if buttons are pressed oustide of vidoplayer
    //like comments section ,etc...
    const tagName = document.activeElement.tagName.toLowerCase();
    if (tagName === "input") {
        if (event.key.toLowerCase() === "enter") {
            return;
        }
        return;
    }
    if (tagName === "button") { retrun }

    switch (event.key.toLowerCase()) {
        case "enter": break;
        case " ":
            togglePlay();
            break;
        case "f": fullscreenChange();
            break;
        case "t": toggleTheaterMode();
            break;
        case 'i': toggleMiniPlayerMode();
            break;
        case "m": toggleMute();
            break;
        case "arrowup": volumeUp();
            break;
        case "arrowdown": volumeDown();
            break;
        case "arrowleft": skipTime(-5);
            break;
        case "arrowright": skipTime(5);
            break;
    }
});

// function checkFileExtension() {
//     fileName = video.value;
//     extension = fileName.split('.').pop();
//     console.log(extension['type']);
// };
// checkFileExtension;