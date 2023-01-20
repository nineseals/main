import React from 'react';

import bgVideo from '../../assets/img/preloader-effect.mp4';
import './Background.scss';

const Background = (props) => {

    return (
      <div id="qodef-page-spinner" className="qodef-m qodef-layout--plamen" style={{opacity: 1}}>
        <div className="qodef-m-inner">
          <div className="qodef-m-spinner">
            <div className="qodef-m-plamen">
              <div className="qodef-m-plamen-frame qodef-animate-elements" style={{opacity: 0}}>
                {/* <div className="qodef-m-plamen-image">
                  <img width="380" height="66" src="https://plamen.qodeinteractive.com/wp-content/uploads/2020/04/Plamen.png" className="attachment-full size-full" alt="" loading="lazy" srcset="https://plamen.qodeinteractive.com/wp-content/uploads/2020/04/Plamen.png 380w, https://plamen.qodeinteractive.com/wp-content/uploads/2020/04/Plamen-300x52.png 300w" sizes="(max-width: 380px) 100vw, 380px" /> 
                </div> */}
                <div className="qodef-m-plamen-text">
                  <span>Est. 2023</span>
                </div>
              </div>
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