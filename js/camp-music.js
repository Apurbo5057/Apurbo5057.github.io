// A quiet original plucked melody and wordless humming. Sound starts only on request.
const button = document.getElementById('camp-sound');
let context, timer;
function stop() {
    clearInterval(timer);
    context?.close(); context = null;
    button.textContent = 'Play campfire music ♫';
    button.setAttribute('aria-pressed', 'false');
}
function voice(frequency, when, length, type, volume) {
    const oscillator = context.createOscillator(), gain = context.createGain();
    oscillator.type = type; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(volume, when + .035);
    gain.gain.exponentialRampToValueAtTime(.0001, when + length);
    oscillator.connect(gain); gain.connect(context.destination);
    oscillator.start(when); oscillator.stop(when + length + .05);
}
button.addEventListener('click', async () => {
    if (context) { stop(); return; }
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) { button.textContent = 'Audio unavailable in this browser'; return; }
    const startedContext = new Audio();
    context = startedContext;
    await startedContext.resume();
    if (context !== startedContext) return;
    button.textContent = 'Pause campfire music'; button.setAttribute('aria-pressed','true');
    let beat=0, next=context.currentTime+.1;
    const melody=[196,246.94,293.66,246.94,220,261.63,329.63,293.66,196,293.66,246.94,220,174.61,220,261.63,196];
    const bass=[130.81,146.83,110,174.61];
    function schedule() {
        if (!context) return;
        while(next<context.currentTime+.3) {
            voice(melody[beat%melody.length],next,.75,'triangle',.035);
            if(beat%4===0) {
                voice(bass[Math.floor(beat/4)%4],next,1.5,'sine',.025);
                voice(melody[beat%melody.length]/2,next,1.4,'sine',.025);
            }
            next+=.42;beat++;
        }
    }
    schedule();timer=setInterval(schedule,100);
});
document.addEventListener('campfire-leave',stop);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
