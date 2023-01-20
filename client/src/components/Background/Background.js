import React from 'react';

import bgVideo from '../../assets/img/preloader-effect.mp4';
import './Background.scss';

const Background = (props) => {

    return (
      <div id="qodef-page-spinner" className="qodef-m qodef-layout--plamen" style={{opacity: 1}}>
        <div className="qodef-m-inner">
          <div className="qodef-m-spinner">
            <div className="qodef-m-plamen">
              <div className="qodef-m-plamen-smoke">
                <video className='videoTag' autoPlay loop muted>
                    <source src={bgVideo} type='video/mp4' />
                </video>
              </div>
            </div> 
          </div>
        </div>
      </div>
    );
}

export default Background;