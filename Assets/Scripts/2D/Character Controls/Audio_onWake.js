var soundTrack  : AudioClip       ;
var randomPitch : boolean = false ;
var randomRange : float   = 0.25  ;

function Awake(){
  if(!audio.isPlaying){
    if(randomPitch){
      audio.pitch  = Random.Range(1.0-randomRange, 1.0+randomRange) ;
    }
    audio.clip = soundTrack ;
    audio.Play()            ;
  }
}
