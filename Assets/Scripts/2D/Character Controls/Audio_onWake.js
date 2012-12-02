var soundTrack : AudioClip;

function Awake(){
  if(!audio.isPlaying){
    audio.clip = soundTrack;
    audio.Play();
  }
}
