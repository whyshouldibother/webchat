export class AudioBleep {
    constructor() {
        this.lastPlayed = 0;

        this.audio = document.createElement('audio');
        let source = document.createElement('source');

        if (this.audio.canPlayType('audio/mpeg;')) {
            source.type = 'audio/mpeg';
            source.src = 'static/highlight.mp3';
        } else {
            source.type = 'audio/ogg';
            source.src = 'static/highlight.ogg';
        }

        this.audio.appendChild(source);
    }

    play() {
        // Only play the bleep once every 2 seconds
        if (!this.lastPlayed || Date.now() - this.lastPlayed > 2000) {
            this.audio.play();
            this.lastPlayed = Date.now();
        }
    }
}

export function listenForHighlights(state) {
    let bleep = new AudioBleep();

    state.$on('message.new', (message, buffer) => {
        if (buffer.setting('mute_sound')) {
            return;
        }

        let ignoreTypes = [
            'connection',
            'traffic',
            'nick',
        ];
        if (ignoreTypes.indexOf(message.type) > -1) {
            return;
        }

        if (message.ignore) {
            return;
        }

        let isHighlight = message.isHighlight;
        let isActiveBuffer = state.getActiveBuffer() === buffer;
        let inFocus = isActiveBuffer && state.ui.app_has_focus;

        if (isHighlight || (buffer.isQuery() && !inFocus)) {
            bleep.play();
        }
    });
}
