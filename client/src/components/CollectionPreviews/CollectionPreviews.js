import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.scss";

// import required modules
import { EffectCoverflow } from "swiper";

import './CollectionPreviews.scss';


import preview1 from '../../assets/img/nine_seals_1.png';
import preview2 from '../../assets/img/nine_seals_2.png';
import preview3 from '../../assets/img/nine_seals_3.png';
import preview4 from '../../assets/img/nine_seals_4.png';
import preview5 from '../../assets/img/nine_seals_5.png';
import preview6 from '../../assets/img/nine_seals_6.png';
import preview7 from '../../assets/img/nine_seals_7.png';
import preview8 from '../../assets/img/nine_seals_8.png';
import preview9 from '../../assets/img/nine_seals_9.png';

const previewImages = [
  preview1,
  preview2,
  preview3,
  preview4,
  preview5,
  preview6,
  preview7,
  preview8,
  preview9
];

const CollectionPreviews = (props) => {

    const slides = previewImages.map((item, key) => (
      <SwiperSlide>
        <img key={key} src={item} />
      </SwiperSlide>
    ));

    return (
        <div>
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            initialSlide={4}
            coverflowEffect={{
              rotate: 20,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            modules={[EffectCoverflow]}
            className="mySwiper"
          >
            {slides}
          </Swiper>
        </div>
      );
}

export default CollectionPreviews;