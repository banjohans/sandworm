import React from 'react';

export const AudioElements: React.FC = () => {
  return (
    <>
      <audio id="background-music" loop>
        <source src="/sounds/arrakistheme.mp3" type="audio/mp3" />
      </audio>
      <audio id="mainscreen-music" loop>
        <source src="/sounds/mainscreentheme.mp3" type="audio/mp3" />
      </audio>
      <audio id="lisan-al-gaib" src="/sounds/lisanalgaib.mp3" />
      <audio id="swallow-sound" src="/sounds/swallow.mp3" />
      <audio id="chomp1" src="/sounds/chomp1.mp3" />
      <audio id="chomp2" src="/sounds/chomp2.mp3" />
      <audio id="chomp3" src="/sounds/chomp3.mp3" />
      <audio id="blip-sound">
        <source src="/sounds/blip.mp3" type="audio/mp3" />
      </audio>
    </>
  );
};
