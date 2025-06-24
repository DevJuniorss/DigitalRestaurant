// src/components/SocialMediaLinks.tsx
import React from 'react';

const SocialMediaLinks: React.FC = () => {
  return (
    <div className="social-media">
      <ul className="list-social-media">
        <li className="item-social-media">
          <a className="link-social-media" href="#">
            <i className="fab fa-facebook-f"></i>
          </a>
        </li>
        <li className="item-social-media">
          <a className="link-social-media" href="#">
            <i className="fab fa-google-plus-g"></i>
          </a>
        </li>
        <li className="item-social-media">
          <a className="link-social-media" href="#">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default SocialMediaLinks;
