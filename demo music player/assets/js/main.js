/**
 *  TASK
 1. Xây dựng giao diện -> ok
 2. Render song -> ok
 2.1 Xử lý cuộn -> ok
 3. xử lý play / pause -> ok
 4. Xử lý next / prev
 5. Xử lý thanh tiến độ
 6. Xử lý lặp / random song
 7. Focus song đang phát
 7.1 Click songElement play song
 8. Hoàn thiện
 9. save config to local stogare
 * */


const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const songs = [{
        "image": "./assets/images/song/past-lives.jpg",
        "path": "./assets/audio/past-lives.mp3",
        "name": "Past Lives (Sapientdream Remix)",
        "singer": "BORNS"
    },
    {
        "image": "./assets/images/song/love-is-gone.jpg",
        "path": "./assets/audio/love-is-gone.mp3",
        "name": "Love Is Gone",
        "singer": "Slander FT.Dylan Matthew (Acoustic)"
    },
    {
        "image": "./assets/images/song/someone-you-loved.jpg",
        "path": "./assets/audio/someone-you-loved.mp3",
        "name": "Someone You Loved",
        "singer": "Lewis Capaldi"
    },
    {
        "image": "./assets/images/song/dancing-with-your-ghost.jpg",
        "path": "./assets/audio/dancing-with-your-ghost.mp3",
        "name": "Dancing With Your Ghost",
        "singer": "Sasha Sloan"
    },
    {
        "image": "./assets/images/song/something-just-like-this.jpg",
        "path": "./assets/audio/something-just-like-this.mp3",
        "name": "Something Just Like This",
        "singer": "Coldplay, The Chainsmokers"
    },
    {
        "image": "./assets/images/song/willdy-hill.jpg",
        "path": "./assets/audio/willdy-hill.mp3",
        "name": "WindyHill",
        "singer": "Yu Zhong"
    },
    {
        "image": "./assets/images/song/ngau-hung.jpg",
        "path": "./assets/audio/ngau-hung.mp3",
        "name": "Ngẫu Hứng",
        "singer": "Hòa Prox"
    },
    {
        "image": "./assets/images/song/lantern.jpg",
        "path": "./assets/audio/lantern.mp3",
        "name": "Lantern (Remix)",
        "singer": "Miyuri FT.Xomu"
    },
    {
        "image": "./assets/images/song/time-to-love-2.jpg",
        "path": "./assets/audio/time-to-love-2.mp3",
        "name": "Time To Love 2 (Remix)",
        "singer": "Chang FT.Tom Milano "
    },
    {
        "image": "./assets/images/song/star-sky.jpg",
        "path": "./assets/audio/star-sky.mp3",
        "name": "Star Sky (Remix)",
        "singer": "V/A"
    }
];

class MusicPlayer {

    constructor(songs) {
        this.songs = songs;
    }
    getter() {
        this.playlist = $('#music-playlist');
        this.currentIndex = 0;
        this.audio = $('#audio');
        this.cdThumb = $('.cd-thumb');
        this.cd = $('#cd');
        this.songName = $('.song-name');
        this.togglePlayBtn = $('.btn-toggle-play');
        this.isPlaying = false;
        this.isRandom = false;
        this.isRepeat = false;
        this.player = $('#music-player');
        this.effectBtn = $('.btn-play--effect')
        this.nextBtn = $('.btn-next');
        this.prevBtn = $('.btn-prev');
        this.randomBtn = $('.btn-random');
        this.repeatBtn = $('.btn-repeat');
        this.musicProgress = $('input[name="music-progress"]');
        this.musicLine = $('.progress-time .progress-bar--line');
        this.currentTime = $('.progress-time .current-time')
        this.durationTime = $('.progress-time .duration-time')
        this.volumeProgress = $('input[name="music-volume"]');
        this.volumeLine = $('.progress-volume .progress-bar--line');
        this.volumeNode = $('.progress-volume');
        this.progressBar = $('.progress-bar');
    }
    setter() {
        this.animateCd = this.cdThumb.animate([
            // keyframes
            {
                transform: 'rotate(360deg'
            },
        ], {
            // timing options
            duration: 10000,
            iterations: Infinity
        });
        this.animateCd.pause();


    }

    start() {
        this.getter();
        this.setter();
        this.renderSong();

        this.defineProperties();

        this.loadCurrentSong();

        this.handleEvents();

    }


    renderSong() {
        const htmls = this.songs.map((song, index) =>
            `
        <div data-index=${index} class="song ${this.currentIndex === index ?'active':''}">
                <div class="thumb" style="background-image: url('${song.image}')">
                    <span class="song-waves">
                        <div class="song-wave"></div>
                        <div class="song-wave"></div>
                        <div class="song-wave"></div>
                    </span>
                    <span class="song-play"> <i class="fa-solid fa-play icon-play icon"></i></span>
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `
        )
        this.playlist.innerHTML = htmls.join('');
    }

    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })

    }

    loadCurrentSong() {
        this.audio.src = this.currentSong.path;
        this.cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        this.songName.textContent = this.currentSong.name;
    }

    scrollActiveSong() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: "auto",
                block: "end"
            })
        }, 150)

    }

    handleEvents() {
        // scrollTop 
        this.handleScrollTop();

        //  play music
        this.handlePlayMusic();

        this.activeBtn();

        // next song
        this.handleNextSong();

        // prev song
        this.handlePrevSong();

        // chạy thanh tiến trình nhạc
        this.handleProgressMusic();

        // xử lý chạy hết bài
        this.handleEndSong();

        // thanh volume bài hát
        this.handleVolume();

        // click vào ảnh để hát bài đó
        // dbclick vào song để hát bài đó
        this.handleClickSong();

    }

    activeBtn() {
        this.randomBtn.onclick = () => {
            this.isRandom = !this.isRandom;
            this.randomBtn.classList.toggle('active');
        }

        this.repeatBtn.onclick = () => {
            this.isRepeat = !this.isRepeat;
            this.repeatBtn.classList.toggle('active');
        }
    }

    handleClickSong() {
        this.playlist.onclick = (e) => {
            const songNode = e.target.closest('.song:not(.active)');
            const thumbNode = e.target.closest('.song:not(.active) .thumb')
            if (thumbNode) {
                this.currentIndex = Number(songNode.dataset.index);
                this.loadCurrentSong();
                audio.play();
                this.renderSong();
            }

            if (e.target.closest('.option')) {
                console.log(e.target);
            }
        }

        this.playlist.ondblclick = (e) => {
            const songNode = e.target.closest('.song:not(.active)');

            if (songNode) {
                this.currentIndex = Number(songNode.dataset.index);
                this.loadCurrentSong();
                audio.play();
                this.renderSong();
                console.log('here');
            }

        }
    }

    handleVolume() {
        this.volumeLine.style.width = this.volumeProgress.value + '%';
        this.audio.volume = this.volumeProgress.value / 100;

        this.volumeProgress.onchange = () => {
            this.volumeLine.style.width = this.volumeProgress.value + '%';
            this.audio.volume = this.volumeProgress.value / 100;
            this.audio.volume === 0 ?
                this.volumeNode.classList.add('mute') : this.volumeNode.classList.remove('mute');
        }
    }


    handleProgressMusic() {
        this.audio.ontimeupdate = () => {
            const percentTime = this.audio.currentTime / this.audio.duration * 100;
            this.musicLine.style.width = percentTime + '%';
            this.currentTime.textContent = this.convertTime(Math.floor(this.audio.currentTime));
            this.durationTime.textContent = this.audio.duration ? this.convertTime(Math.floor(this.audio.duration)) : '00:00';
        }

        this.musicProgress.onchange = () => {
            const value = this.musicProgress.value * 2;
            this.musicLine.style.width = value + '%';
        }

        this.musicProgress.onclick = (e) => {
            const currentTime = e.target.value * 2 * this.audio.duration / 100;
            console.log(currentTime);
            this.audio.currentTime = currentTime;
        }
        // xử lý kéo progress!!!
    }

    handlePrevSong() {
        this.prevBtn.onclick = () => {
            this.isRandom ? this.randomSong() : this.prevSong();

            this.renderSong();
            $('.song.active').classList.add('playing');
            $('.song.active').classList.remove('pause');
            this.scrollActiveSong();
            this.audio.play();
        }
    }


    handleNextSong() {
        this.nextBtn.onclick = () => {
            this.isRandom ? this.randomSong() : this.nextSong();
            this.renderSong();
            $('.song.active').classList.add('playing');
            $('.song.active').classList.remove('pause');
            this.scrollActiveSong();
            this.audio.play();
        }
    }

    handleEndSong() {
        this.audio.onended = () => {
            setTimeout(() => {
                this.isRepeat ? this.audio.play() : this.nextBtn.click();
            }, 2000)
        }
    }


    handlePlayMusic() {
        this.togglePlayBtn.onclick = () => this.isPlaying ? this.audio.pause() : this.audio.play();

        this.audio.onplay = () => {
            this.isPlaying = true;
            this.player.classList.add('playing');
            this.effectBtn.style.opacity = 1;
            this.animateCd.play();
            $('.song.active').classList.add('playing');
            $('.song.active').classList.remove('pause');
        }

        this.audio.onpause = () => {
            this.isPlaying = false;
            this.player.classList.remove('playing');
            this.effectBtn.style.opacity = 0;
            this.animateCd.pause();
            $('.song.active').classList.remove('playing');
            $('.song.active').classList.add('pause');
        }
    }

    // scroll thu nhỏ cd 
    handleScrollTop() {
        const cdWidth = this.cd.offsetWidth;
        document.onscroll = () => {
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = scrollTop > cdWidth ? 0 : cdWidth - scrollTop;
            Object.assign(this.cd.style, {
                width: newCdWidth + 'px',
                opacity: newCdWidth / cdWidth
            })
        }
    }


    // method support
    randomSong() {

        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * this.songs.length);
        } while (this.currentIndex === randomIndex)
        this.currentIndex = randomIndex;
        this.loadCurrentSong();
    }

    nextSong() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length)
            this.currentIndex = 0;

        this.loadCurrentSong();


    }
    prevSong() {
        this.currentIndex--;
        if (this.currentIndex < 0)
            this.currentIndex = this.songs.length - 1;

        this.loadCurrentSong();
    }


    convertTime(seconds = 0) {
        const minute = parseInt(seconds / 60);
        seconds = seconds % 60;
        const front = (minute < 10) ? `0${minute}` : minute;
        const back = (seconds < 10) ? `0${seconds}` : seconds;

        return `${front}:${back}`;
    }

}

const music = new MusicPlayer(songs);
music.start();