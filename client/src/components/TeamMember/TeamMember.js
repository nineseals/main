import React from 'react';

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
        <p className="description">{ props.description }</p>
      </div>
    );
}

export default TeamMember;