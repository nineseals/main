import React from 'react';
import { SiTwitter } from "react-icons/si";

import './TeamMember.scss';

const TeamMember = (props) => {

    return (
      <div className="team-member-item">
        <div className="team-member-image active">
          <img 
            src={ props.imageUrl } 
            loading="lazy" 
            srcSet={ props.imageUrl }
            alt={ props.title } /> 
        </div>

        <h2 className="title">{ props.title }</h2>
        <div className="twitter"><a href={`https://twitter.com/${props.twitter}`} target="_blank" rel="noopener noreferrer"><SiTwitter className="social-icon" /> @{ props.twitter }</a></div>
        <p className="description">{ props.description }</p>
      </div>
    );
}

export default TeamMember;